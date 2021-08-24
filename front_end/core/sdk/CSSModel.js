/*
 * Copyright (C) 2010 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
import * as TextUtils from '../../models/text_utils/text_utils.js';
import * as Common from '../common/common.js';
import * as Host from '../host/host.js';
import * as Platform from '../platform/platform.js';
import { CSSFontFace } from './CSSFontFace.js';
import { CSSMatchedStyles } from './CSSMatchedStyles.js';
import { CSSMedia } from './CSSMedia.js';
import { CSSStyleRule } from './CSSRule.js';
import { CSSStyleDeclaration, Type } from './CSSStyleDeclaration.js';
import { CSSStyleSheetHeader } from './CSSStyleSheetHeader.js';
import { DOMModel } from './DOMModel.js';
import { Events as ResourceTreeModelEvents, ResourceTreeModel } from './ResourceTreeModel.js';
import { Capability } from './Target.js';
import { SDKModel } from './SDKModel.js';
import { SourceMapManager } from './SourceMapManager.js';
export class CSSModel extends SDKModel {
    isEnabledInternal;
    cachedMatchedCascadeNode;
    cachedMatchedCascadePromise;
    domModelInternal;
    sourceMapManagerInternal;
    agent;
    styleLoader;
    resourceTreeModel;
    styleSheetIdToHeader;
    styleSheetIdsForURL;
    originalStyleSheetTextInternal;
    isRuleUsageTrackingEnabled;
    fontFacesInternal;
    cssPropertyTracker;
    isCSSPropertyTrackingEnabled;
    isTrackingRequestPending;
    trackedCSSProperties;
    stylePollingThrottler;
    constructor(target) {
        super(target);
        this.isEnabledInternal = false;
        this.cachedMatchedCascadeNode = null;
        this.cachedMatchedCascadePromise = null;
        this.domModelInternal = target.model(DOMModel);
        this.sourceMapManagerInternal = new SourceMapManager(target);
        this.agent = target.cssAgent();
        this.styleLoader = new ComputedStyleLoader(this);
        this.resourceTreeModel = target.model(ResourceTreeModel);
        if (this.resourceTreeModel) {
            this.resourceTreeModel.addEventListener(ResourceTreeModelEvents.MainFrameNavigated, this.resetStyleSheets, this);
        }
        target.registerCSSDispatcher(new CSSDispatcher(this));
        if (!target.suspended()) {
            this.enable();
        }
        this.styleSheetIdToHeader = new Map();
        this.styleSheetIdsForURL = new Map();
        this.originalStyleSheetTextInternal = new Map();
        this.isRuleUsageTrackingEnabled = false;
        this.fontFacesInternal = new Map();
        this.cssPropertyTracker = null; // TODO: support multiple trackers when we refactor the backend
        this.isCSSPropertyTrackingEnabled = false;
        this.isTrackingRequestPending = false;
        this.trackedCSSProperties = new Map();
        this.stylePollingThrottler = new Common.Throttler.Throttler(StylePollingInterval);
        this.sourceMapManagerInternal.setEnabled(Common.Settings.Settings.instance().moduleSetting('cssSourceMapsEnabled').get());
        Common.Settings.Settings.instance()
            .moduleSetting('cssSourceMapsEnabled')
            .addChangeListener(event => this.sourceMapManagerInternal.setEnabled(event.data));
    }
    headersForSourceURL(sourceURL) {
        const headers = [];
        for (const headerId of this.getStyleSheetIdsForURL(sourceURL)) {
            const header = this.styleSheetHeaderForId(headerId);
            if (header) {
                headers.push(header);
            }
        }
        return headers;
    }
    createRawLocationsByURL(sourceURL, lineNumber, columnNumber = 0) {
        const headers = this.headersForSourceURL(sourceURL);
        headers.sort(stylesheetComparator);
        const endIndex = Platform.ArrayUtilities.upperBound(headers, undefined, (_, header) => lineNumber - header.startLine || columnNumber - header.startColumn);
        if (!endIndex) {
            return [];
        }
        const locations = [];
        const last = headers[endIndex - 1];
        for (let index = endIndex - 1; index >= 0 && headers[index].startLine === last.startLine && headers[index].startColumn === last.startColumn; --index) {
            if (headers[index].containsLocation(lineNumber, columnNumber)) {
                locations.push(new CSSLocation(headers[index], lineNumber, columnNumber));
            }
        }
        return locations;
        function stylesheetComparator(a, b) {
            return a.startLine - b.startLine || a.startColumn - b.startColumn || a.id.localeCompare(b.id);
        }
    }
    sourceMapManager() {
        return this.sourceMapManagerInternal;
    }
    static trimSourceURL(text) {
        let sourceURLIndex = text.lastIndexOf('/*# sourceURL=');
        if (sourceURLIndex === -1) {
            sourceURLIndex = text.lastIndexOf('/*@ sourceURL=');
            if (sourceURLIndex === -1) {
                return text;
            }
        }
        const sourceURLLineIndex = text.lastIndexOf('\n', sourceURLIndex);
        if (sourceURLLineIndex === -1) {
            return text;
        }
        const sourceURLLine = text.substr(sourceURLLineIndex + 1).split('\n', 1)[0];
        const sourceURLRegex = /[\040\t]*\/\*[#@] sourceURL=[\040\t]*([^\s]*)[\040\t]*\*\/[\040\t]*$/;
        if (sourceURLLine.search(sourceURLRegex) === -1) {
            return text;
        }
        return text.substr(0, sourceURLLineIndex) + text.substr(sourceURLLineIndex + sourceURLLine.length + 1);
    }
    domModel() {
        return this.domModelInternal;
    }
    async setStyleText(styleSheetId, range, text, majorChange) {
        try {
            await this.ensureOriginalStyleSheetText(styleSheetId);
            const { styles } = await this.agent.invoke_setStyleTexts({ edits: [{ styleSheetId: styleSheetId, range: range.serializeToObject(), text }] });
            if (!styles || styles.length !== 1) {
                return false;
            }
            this.domModelInternal.markUndoableState(!majorChange);
            const edit = new Edit(styleSheetId, range, text, styles[0]);
            this.fireStyleSheetChanged(styleSheetId, edit);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    async setSelectorText(styleSheetId, range, text) {
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.StyleRuleEdited);
        try {
            await this.ensureOriginalStyleSheetText(styleSheetId);
            const { selectorList } = await this.agent.invoke_setRuleSelector({ styleSheetId, range, selector: text });
            if (!selectorList) {
                return false;
            }
            this.domModelInternal.markUndoableState();
            const edit = new Edit(styleSheetId, range, text, selectorList);
            this.fireStyleSheetChanged(styleSheetId, edit);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    async setKeyframeKey(styleSheetId, range, text) {
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.StyleRuleEdited);
        try {
            await this.ensureOriginalStyleSheetText(styleSheetId);
            const { keyText } = await this.agent.invoke_setKeyframeKey({ styleSheetId, range, keyText: text });
            if (!keyText) {
                return false;
            }
            this.domModelInternal.markUndoableState();
            const edit = new Edit(styleSheetId, range, text, keyText);
            this.fireStyleSheetChanged(styleSheetId, edit);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    startCoverage() {
        this.isRuleUsageTrackingEnabled = true;
        return this.agent.invoke_startRuleUsageTracking();
    }
    async takeCoverageDelta() {
        const r = await this.agent.invoke_takeCoverageDelta();
        const timestamp = (r && r.timestamp) || 0;
        const coverage = (r && r.coverage) || [];
        return { timestamp, coverage };
    }
    setLocalFontsEnabled(enabled) {
        return this.agent.invoke_setLocalFontsEnabled({
            enabled,
        });
    }
    async stopCoverage() {
        this.isRuleUsageTrackingEnabled = false;
        await this.agent.invoke_stopRuleUsageTracking();
    }
    async mediaQueriesPromise() {
        const { medias } = await this.agent.invoke_getMediaQueries();
        return medias ? CSSMedia.parseMediaArrayPayload(this, medias) : [];
    }
    isEnabled() {
        return this.isEnabledInternal;
    }
    async enable() {
        await this.agent.invoke_enable();
        this.isEnabledInternal = true;
        if (this.isRuleUsageTrackingEnabled) {
            await this.startCoverage();
        }
        this.dispatchEventToListeners(Events.ModelWasEnabled);
    }
    async matchedStylesPromise(nodeId) {
        const response = await this.agent.invoke_getMatchedStylesForNode({ nodeId });
        if (response.getError()) {
            return null;
        }
        const node = this.domModelInternal.nodeForId(nodeId);
        if (!node) {
            return null;
        }
        return new CSSMatchedStyles(this, node, response.inlineStyle || null, response.attributesStyle || null, response.matchedCSSRules || [], response.pseudoElements || [], response.inherited || [], response.cssKeyframesRules || []);
    }
    async classNamesPromise(styleSheetId) {
        const { classNames } = await this.agent.invoke_collectClassNames({ styleSheetId });
        return classNames || [];
    }
    computedStylePromise(nodeId) {
        return this.styleLoader.computedStylePromise(nodeId);
    }
    async backgroundColorsPromise(nodeId) {
        const response = await this.agent.invoke_getBackgroundColors({ nodeId });
        if (response.getError()) {
            return null;
        }
        return {
            backgroundColors: response.backgroundColors || null,
            computedFontSize: response.computedFontSize || '',
            computedFontWeight: response.computedFontWeight || '',
        };
    }
    async platformFontsPromise(nodeId) {
        const { fonts } = await this.agent.invoke_getPlatformFontsForNode({ nodeId });
        return fonts;
    }
    allStyleSheets() {
        const values = [...this.styleSheetIdToHeader.values()];
        function styleSheetComparator(a, b) {
            if (a.sourceURL < b.sourceURL) {
                return -1;
            }
            if (a.sourceURL > b.sourceURL) {
                return 1;
            }
            return a.startLine - b.startLine || a.startColumn - b.startColumn;
        }
        values.sort(styleSheetComparator);
        return values;
    }
    async inlineStylesPromise(nodeId) {
        const response = await this.agent.invoke_getInlineStylesForNode({ nodeId });
        if (response.getError() || !response.inlineStyle) {
            return null;
        }
        const inlineStyle = new CSSStyleDeclaration(this, null, response.inlineStyle, Type.Inline);
        const attributesStyle = response.attributesStyle ?
            new CSSStyleDeclaration(this, null, response.attributesStyle, Type.Attributes) :
            null;
        return new InlineStyleResult(inlineStyle, attributesStyle);
    }
    forcePseudoState(node, pseudoClass, enable) {
        const forcedPseudoClasses = node.marker(PseudoStateMarker) || [];
        const hasPseudoClass = forcedPseudoClasses.includes(pseudoClass);
        if (enable) {
            if (hasPseudoClass) {
                return false;
            }
            forcedPseudoClasses.push(pseudoClass);
            node.setMarker(PseudoStateMarker, forcedPseudoClasses);
        }
        else {
            if (!hasPseudoClass) {
                return false;
            }
            Platform.ArrayUtilities.removeElement(forcedPseudoClasses, pseudoClass);
            if (forcedPseudoClasses.length) {
                node.setMarker(PseudoStateMarker, forcedPseudoClasses);
            }
            else {
                node.setMarker(PseudoStateMarker, null);
            }
        }
        if (node.id === undefined) {
            return false;
        }
        this.agent.invoke_forcePseudoState({ nodeId: node.id, forcedPseudoClasses });
        this.dispatchEventToListeners(Events.PseudoStateForced, { node: node, pseudoClass: pseudoClass, enable: enable });
        return true;
    }
    pseudoState(node) {
        return node.marker(PseudoStateMarker) || [];
    }
    async setMediaText(styleSheetId, range, newMediaText) {
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.StyleRuleEdited);
        try {
            await this.ensureOriginalStyleSheetText(styleSheetId);
            const { media } = await this.agent.invoke_setMediaText({ styleSheetId, range, text: newMediaText });
            if (!media) {
                return false;
            }
            this.domModelInternal.markUndoableState();
            const edit = new Edit(styleSheetId, range, newMediaText, media);
            this.fireStyleSheetChanged(styleSheetId, edit);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    async setContainerQueryText(styleSheetId, range, newContainerQueryText) {
        Host.userMetrics.actionTaken(Host.UserMetrics.Action.StyleRuleEdited);
        try {
            await this.ensureOriginalStyleSheetText(styleSheetId);
            const { containerQuery } = await this.agent.invoke_setContainerQueryText({ styleSheetId, range, text: newContainerQueryText });
            if (!containerQuery) {
                return false;
            }
            this.domModelInternal.markUndoableState();
            const edit = new Edit(styleSheetId, range, newContainerQueryText, containerQuery);
            this.fireStyleSheetChanged(styleSheetId, edit);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    async addRule(styleSheetId, ruleText, ruleLocation) {
        try {
            await this.ensureOriginalStyleSheetText(styleSheetId);
            const { rule } = await this.agent.invoke_addRule({ styleSheetId, ruleText, location: ruleLocation });
            if (!rule) {
                return null;
            }
            this.domModelInternal.markUndoableState();
            const edit = new Edit(styleSheetId, ruleLocation, ruleText, rule);
            this.fireStyleSheetChanged(styleSheetId, edit);
            return new CSSStyleRule(this, rule);
        }
        catch (e) {
            return null;
        }
    }
    async requestViaInspectorStylesheet(node) {
        const frameId = node.frameId() ||
            (this.resourceTreeModel && this.resourceTreeModel.mainFrame ? this.resourceTreeModel.mainFrame.id : null);
        const headers = [...this.styleSheetIdToHeader.values()];
        const styleSheetHeader = headers.find(header => header.frameId === frameId && header.isViaInspector());
        if (styleSheetHeader) {
            return styleSheetHeader;
        }
        if (!frameId) {
            return null;
        }
        try {
            const { styleSheetId } = await this.agent.invoke_createStyleSheet({ frameId });
            if (!styleSheetId) {
                return null;
            }
            return this.styleSheetIdToHeader.get(styleSheetId) || null;
        }
        catch (e) {
            return null;
        }
    }
    mediaQueryResultChanged() {
        this.dispatchEventToListeners(Events.MediaQueryResultChanged);
    }
    fontsUpdated(fontFace) {
        if (fontFace) {
            this.fontFacesInternal.set(fontFace.src, new CSSFontFace(fontFace));
        }
        this.dispatchEventToListeners(Events.FontsUpdated);
    }
    fontFaces() {
        return [...this.fontFacesInternal.values()];
    }
    styleSheetHeaderForId(id) {
        return this.styleSheetIdToHeader.get(id) || null;
    }
    styleSheetHeaders() {
        return [...this.styleSheetIdToHeader.values()];
    }
    fireStyleSheetChanged(styleSheetId, edit) {
        this.dispatchEventToListeners(Events.StyleSheetChanged, { styleSheetId: styleSheetId, edit: edit });
    }
    ensureOriginalStyleSheetText(styleSheetId) {
        const header = this.styleSheetHeaderForId(styleSheetId);
        if (!header) {
            return Promise.resolve(null);
        }
        let promise = this.originalStyleSheetTextInternal.get(header);
        if (!promise) {
            promise = this.getStyleSheetText(header.id);
            this.originalStyleSheetTextInternal.set(header, promise);
            this.originalContentRequestedForTest(header);
        }
        return promise;
    }
    originalContentRequestedForTest(_header) {
    }
    originalStyleSheetText(header) {
        return this.ensureOriginalStyleSheetText(header.id);
    }
    getAllStyleSheetHeaders() {
        return this.styleSheetIdToHeader.values();
    }
    styleSheetAdded(header) {
        console.assert(!this.styleSheetIdToHeader.get(header.styleSheetId));
        const styleSheetHeader = new CSSStyleSheetHeader(this, header);
        this.styleSheetIdToHeader.set(header.styleSheetId, styleSheetHeader);
        const url = styleSheetHeader.resourceURL();
        let frameIdToStyleSheetIds = this.styleSheetIdsForURL.get(url);
        if (!frameIdToStyleSheetIds) {
            frameIdToStyleSheetIds = new Map();
            this.styleSheetIdsForURL.set(url, frameIdToStyleSheetIds);
        }
        if (frameIdToStyleSheetIds) {
            let styleSheetIds = frameIdToStyleSheetIds.get(styleSheetHeader.frameId);
            if (!styleSheetIds) {
                styleSheetIds = new Set();
                frameIdToStyleSheetIds.set(styleSheetHeader.frameId, styleSheetIds);
            }
            styleSheetIds.add(styleSheetHeader.id);
        }
        this.sourceMapManagerInternal.attachSourceMap(styleSheetHeader, styleSheetHeader.sourceURL, styleSheetHeader.sourceMapURL);
        this.dispatchEventToListeners(Events.StyleSheetAdded, styleSheetHeader);
    }
    styleSheetRemoved(id) {
        const header = this.styleSheetIdToHeader.get(id);
        console.assert(Boolean(header));
        if (!header) {
            return;
        }
        this.styleSheetIdToHeader.delete(id);
        const url = header.resourceURL();
        const frameIdToStyleSheetIds = this.styleSheetIdsForURL.get(url);
        console.assert(Boolean(frameIdToStyleSheetIds), 'No frameId to styleSheetId map is available for given style sheet URL.');
        if (frameIdToStyleSheetIds) {
            const stylesheetIds = frameIdToStyleSheetIds.get(header.frameId);
            if (stylesheetIds) {
                stylesheetIds.delete(id);
                if (!stylesheetIds.size) {
                    frameIdToStyleSheetIds.delete(header.frameId);
                    if (!frameIdToStyleSheetIds.size) {
                        this.styleSheetIdsForURL.delete(url);
                    }
                }
            }
        }
        this.originalStyleSheetTextInternal.delete(header);
        this.sourceMapManagerInternal.detachSourceMap(header);
        this.dispatchEventToListeners(Events.StyleSheetRemoved, header);
    }
    getStyleSheetIdsForURL(url) {
        const frameIdToStyleSheetIds = this.styleSheetIdsForURL.get(url);
        if (!frameIdToStyleSheetIds) {
            return [];
        }
        const result = [];
        for (const styleSheetIds of frameIdToStyleSheetIds.values()) {
            result.push(...styleSheetIds);
        }
        return result;
    }
    async setStyleSheetText(styleSheetId, newText, majorChange) {
        const header = this.styleSheetIdToHeader.get(styleSheetId);
        if (!header) {
            return 'Unknown stylesheet in CSS.setStyleSheetText';
        }
        newText = CSSModel.trimSourceURL(newText);
        if (header.hasSourceURL) {
            newText += '\n/*# sourceURL=' + header.sourceURL + ' */';
        }
        await this.ensureOriginalStyleSheetText(styleSheetId);
        const response = await this.agent.invoke_setStyleSheetText({ styleSheetId: header.id, text: newText });
        const sourceMapURL = response.sourceMapURL;
        this.sourceMapManagerInternal.detachSourceMap(header);
        header.setSourceMapURL(sourceMapURL);
        this.sourceMapManagerInternal.attachSourceMap(header, header.sourceURL, header.sourceMapURL);
        if (sourceMapURL === null) {
            return 'Error in CSS.setStyleSheetText';
        }
        this.domModelInternal.markUndoableState(!majorChange);
        this.fireStyleSheetChanged(styleSheetId);
        return null;
    }
    async getStyleSheetText(styleSheetId) {
        try {
            const { text } = await this.agent.invoke_getStyleSheetText({ styleSheetId });
            return text && CSSModel.trimSourceURL(text);
        }
        catch (e) {
            return null;
        }
    }
    resetStyleSheets() {
        const headers = [...this.styleSheetIdToHeader.values()];
        this.styleSheetIdsForURL.clear();
        this.styleSheetIdToHeader.clear();
        for (const header of headers) {
            this.sourceMapManagerInternal.detachSourceMap(header);
            this.dispatchEventToListeners(Events.StyleSheetRemoved, header);
        }
    }
    resetFontFaces() {
        this.fontFacesInternal.clear();
    }
    async suspendModel() {
        this.isEnabledInternal = false;
        await this.agent.invoke_disable();
        this.resetStyleSheets();
        this.resetFontFaces();
    }
    async resumeModel() {
        return this.enable();
    }
    setEffectivePropertyValueForNode(nodeId, propertyName, value) {
        this.agent.invoke_setEffectivePropertyValueForNode({ nodeId, propertyName, value });
    }
    cachedMatchedCascadeForNode(node) {
        if (this.cachedMatchedCascadeNode !== node) {
            this.discardCachedMatchedCascade();
        }
        this.cachedMatchedCascadeNode = node;
        if (!this.cachedMatchedCascadePromise) {
            if (node.id) {
                this.cachedMatchedCascadePromise = this.matchedStylesPromise(node.id);
            }
            else {
                return Promise.resolve(null);
            }
        }
        return this.cachedMatchedCascadePromise;
    }
    discardCachedMatchedCascade() {
        this.cachedMatchedCascadeNode = null;
        this.cachedMatchedCascadePromise = null;
    }
    createCSSPropertyTracker(propertiesToTrack) {
        const cssPropertyTracker = new CSSPropertyTracker(this, propertiesToTrack);
        return cssPropertyTracker;
    }
    enableCSSPropertyTracker(cssPropertyTracker) {
        const propertiesToTrack = cssPropertyTracker.getTrackedProperties();
        if (propertiesToTrack.length === 0) {
            return;
        }
        this.agent.invoke_trackComputedStyleUpdates({ propertiesToTrack });
        this.isCSSPropertyTrackingEnabled = true;
        this.cssPropertyTracker = cssPropertyTracker;
        this.pollComputedStyleUpdates();
    }
    // Since we only support one tracker at a time, this call effectively disables
    // style tracking.
    disableCSSPropertyTracker() {
        this.isCSSPropertyTrackingEnabled = false;
        this.cssPropertyTracker = null;
        // Sending an empty list to the backend signals the close of style tracking
        this.agent.invoke_trackComputedStyleUpdates({ propertiesToTrack: [] });
    }
    async pollComputedStyleUpdates() {
        if (this.isTrackingRequestPending) {
            return;
        }
        if (this.isCSSPropertyTrackingEnabled) {
            this.isTrackingRequestPending = true;
            const result = await this.agent.invoke_takeComputedStyleUpdates();
            this.isTrackingRequestPending = false;
            if (result.getError() || !result.nodeIds || !this.isCSSPropertyTrackingEnabled) {
                return;
            }
            if (this.cssPropertyTracker) {
                this.cssPropertyTracker.dispatchEventToListeners(CSSPropertyTrackerEvents.TrackedCSSPropertiesUpdated, {
                    domNodes: result.nodeIds.map(nodeId => this.domModelInternal.nodeForId(nodeId)),
                });
            }
        }
        if (this.isCSSPropertyTrackingEnabled) {
            this.stylePollingThrottler.schedule(this.pollComputedStyleUpdates.bind(this));
        }
    }
    dispose() {
        this.disableCSSPropertyTracker();
        super.dispose();
        this.sourceMapManagerInternal.dispose();
    }
    getAgent() {
        return this.agent;
    }
}
// TODO(crbug.com/1167717): Make this a const enum again
// eslint-disable-next-line rulesdir/const_enum
export var Events;
(function (Events) {
    Events["FontsUpdated"] = "FontsUpdated";
    Events["MediaQueryResultChanged"] = "MediaQueryResultChanged";
    Events["ModelWasEnabled"] = "ModelWasEnabled";
    Events["PseudoStateForced"] = "PseudoStateForced";
    Events["StyleSheetAdded"] = "StyleSheetAdded";
    Events["StyleSheetChanged"] = "StyleSheetChanged";
    Events["StyleSheetRemoved"] = "StyleSheetRemoved";
})(Events || (Events = {}));
const PseudoStateMarker = 'pseudo-state-marker';
export class Edit {
    styleSheetId;
    oldRange;
    newRange;
    newText;
    payload;
    constructor(styleSheetId, oldRange, newText, payload) {
        this.styleSheetId = styleSheetId;
        this.oldRange = oldRange;
        this.newRange = TextUtils.TextRange.TextRange.fromEdit(oldRange, newText);
        this.newText = newText;
        this.payload = payload;
    }
}
export class CSSLocation {
    cssModelInternal;
    styleSheetId;
    url;
    lineNumber;
    columnNumber;
    constructor(header, lineNumber, columnNumber) {
        this.cssModelInternal = header.cssModel();
        this.styleSheetId = header.id;
        this.url = header.resourceURL();
        this.lineNumber = lineNumber;
        this.columnNumber = columnNumber || 0;
    }
    cssModel() {
        return this.cssModelInternal;
    }
    header() {
        return this.cssModelInternal.styleSheetHeaderForId(this.styleSheetId);
    }
}
class CSSDispatcher {
    cssModel;
    constructor(cssModel) {
        this.cssModel = cssModel;
    }
    mediaQueryResultChanged() {
        this.cssModel.mediaQueryResultChanged();
    }
    fontsUpdated({ font }) {
        this.cssModel.fontsUpdated(font);
    }
    styleSheetChanged({ styleSheetId }) {
        this.cssModel.fireStyleSheetChanged(styleSheetId);
    }
    styleSheetAdded({ header }) {
        this.cssModel.styleSheetAdded(header);
    }
    styleSheetRemoved({ styleSheetId }) {
        this.cssModel.styleSheetRemoved(styleSheetId);
    }
}
class ComputedStyleLoader {
    cssModel;
    nodeIdToPromise;
    constructor(cssModel) {
        this.cssModel = cssModel;
        this.nodeIdToPromise = new Map();
    }
    computedStylePromise(nodeId) {
        let promise = this.nodeIdToPromise.get(nodeId);
        if (promise) {
            return promise;
        }
        promise = this.cssModel.getAgent().invoke_getComputedStyleForNode({ nodeId }).then(({ computedStyle }) => {
            this.nodeIdToPromise.delete(nodeId);
            if (!computedStyle || !computedStyle.length) {
                return null;
            }
            const result = new Map();
            for (const property of computedStyle) {
                result.set(property.name, property.value);
            }
            return result;
        });
        this.nodeIdToPromise.set(nodeId, promise);
        return promise;
    }
}
export class InlineStyleResult {
    inlineStyle;
    attributesStyle;
    constructor(inlineStyle, attributesStyle) {
        this.inlineStyle = inlineStyle;
        this.attributesStyle = attributesStyle;
    }
}
export class CSSPropertyTracker extends Common.ObjectWrapper.ObjectWrapper {
    cssModel;
    properties;
    constructor(cssModel, propertiesToTrack) {
        super();
        this.cssModel = cssModel;
        this.properties = propertiesToTrack;
    }
    start() {
        this.cssModel.enableCSSPropertyTracker(this);
    }
    stop() {
        this.cssModel.disableCSSPropertyTracker();
    }
    getTrackedProperties() {
        return this.properties;
    }
}
const StylePollingInterval = 1000; // throttling interval for style polling, in milliseconds
// TODO(crbug.com/1167717): Make this a const enum again
// eslint-disable-next-line rulesdir/const_enum
export var CSSPropertyTrackerEvents;
(function (CSSPropertyTrackerEvents) {
    CSSPropertyTrackerEvents["TrackedCSSPropertiesUpdated"] = "TrackedCSSPropertiesUpdated";
})(CSSPropertyTrackerEvents || (CSSPropertyTrackerEvents = {}));
SDKModel.register(CSSModel, { capabilities: Capability.DOM, autostart: true });
//# sourceMappingURL=CSSModel.js.map