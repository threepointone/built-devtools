/*
 * Copyright (C) 2011 Google Inc. All rights reserved.
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
import * as Common from '../../core/common/common.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as Workspace from '../workspace/workspace.js';
import { DebuggerWorkspaceBinding } from './DebuggerWorkspaceBinding.js';
import { LiveLocationPool } from './LiveLocation.js';
let breakpointManagerInstance;
export class BreakpointManager extends Common.ObjectWrapper.ObjectWrapper {
    storage;
    workspace;
    targetManager;
    debuggerWorkspaceBinding;
    breakpointsForUISourceCode;
    breakpointByStorageId;
    constructor(targetManager, workspace, debuggerWorkspaceBinding) {
        super();
        this.storage = new Storage();
        this.workspace = workspace;
        this.targetManager = targetManager;
        this.debuggerWorkspaceBinding = debuggerWorkspaceBinding;
        this.breakpointsForUISourceCode = new Map();
        this.breakpointByStorageId = new Map();
        this.workspace.addEventListener(Workspace.Workspace.Events.UISourceCodeAdded, this.uiSourceCodeAdded, this);
        this.workspace.addEventListener(Workspace.Workspace.Events.UISourceCodeRemoved, this.uiSourceCodeRemoved, this);
        this.workspace.addEventListener(Workspace.Workspace.Events.ProjectRemoved, this.projectRemoved, this);
    }
    static instance(opts = { forceNew: null, targetManager: null, workspace: null, debuggerWorkspaceBinding: null }) {
        const { forceNew, targetManager, workspace, debuggerWorkspaceBinding } = opts;
        if (!breakpointManagerInstance || forceNew) {
            if (!targetManager || !workspace || !debuggerWorkspaceBinding) {
                throw new Error(`Unable to create settings: targetManager, workspace, and debuggerWorkspaceBinding must be provided: ${new Error().stack}`);
            }
            breakpointManagerInstance = new BreakpointManager(targetManager, workspace, debuggerWorkspaceBinding);
        }
        return breakpointManagerInstance;
    }
    static breakpointStorageId(url, lineNumber, columnNumber) {
        if (!url) {
            return '';
        }
        return `${url}:${lineNumber}` + (typeof columnNumber === 'number' ? `:${columnNumber}` : '');
    }
    async copyBreakpoints(fromURL, toSourceCode) {
        const breakpointItems = this.storage.breakpointItems(fromURL);
        for (const item of breakpointItems) {
            await this.setBreakpoint(toSourceCode, item.lineNumber, item.columnNumber, item.condition, item.enabled);
        }
    }
    restoreBreakpoints(uiSourceCode) {
        const url = uiSourceCode.url();
        if (!url) {
            return;
        }
        this.storage.mute();
        const breakpointItems = this.storage.breakpointItems(url);
        for (const item of breakpointItems) {
            this.innerSetBreakpoint(uiSourceCode, item.lineNumber, item.columnNumber, item.condition, item.enabled);
        }
        this.storage.unmute();
    }
    uiSourceCodeAdded(event) {
        const uiSourceCode = event.data;
        this.restoreBreakpoints(uiSourceCode);
    }
    uiSourceCodeRemoved(event) {
        const uiSourceCode = event.data;
        this.removeUISourceCode(uiSourceCode);
    }
    projectRemoved(event) {
        const project = event.data;
        for (const uiSourceCode of project.uiSourceCodes()) {
            this.removeUISourceCode(uiSourceCode);
        }
    }
    removeUISourceCode(uiSourceCode) {
        const breakpoints = this.breakpointLocationsForUISourceCode(uiSourceCode);
        breakpoints.forEach(bp => bp.breakpoint.removeUISourceCode(uiSourceCode));
    }
    async setBreakpoint(uiSourceCode, lineNumber, columnNumber, condition, enabled) {
        let uiLocation = new Workspace.UISourceCode.UILocation(uiSourceCode, lineNumber, columnNumber);
        const normalizedLocation = await this.debuggerWorkspaceBinding.normalizeUILocation(uiLocation);
        if (normalizedLocation.id() !== uiLocation.id()) {
            Common.Revealer.reveal(normalizedLocation);
            uiLocation = normalizedLocation;
        }
        return this.innerSetBreakpoint(uiLocation.uiSourceCode, uiLocation.lineNumber, uiLocation.columnNumber, condition, enabled);
    }
    innerSetBreakpoint(uiSourceCode, lineNumber, columnNumber, condition, enabled) {
        const itemId = BreakpointManager.breakpointStorageId(uiSourceCode.url(), lineNumber, columnNumber);
        let breakpoint = this.breakpointByStorageId.get(itemId);
        if (breakpoint) {
            breakpoint.updateState(condition, enabled);
            breakpoint.addUISourceCode(uiSourceCode);
            breakpoint.updateBreakpoint();
            return breakpoint;
        }
        breakpoint = new Breakpoint(this, uiSourceCode, uiSourceCode.url(), lineNumber, columnNumber, condition, enabled);
        this.breakpointByStorageId.set(itemId, breakpoint);
        return breakpoint;
    }
    findBreakpoint(uiLocation) {
        const breakpoints = this.breakpointsForUISourceCode.get(uiLocation.uiSourceCode);
        return breakpoints ? (breakpoints.get(uiLocation.id())) || null : null;
    }
    async possibleBreakpoints(uiSourceCode, textRange) {
        const { pluginManager } = this.debuggerWorkspaceBinding;
        if (pluginManager) {
            // TODO(bmeurer): Refactor this logic, as for DWARF and sourcemaps, it doesn't make sense
            //                to even ask V8 for possible break locations, since these are determined
            //                from the debugging information.
            const rawLocations = await pluginManager.uiLocationToRawLocations(uiSourceCode, textRange.startLine);
            if (rawLocations) {
                const uiLocations = [];
                for (const rawLocation of rawLocations) {
                    const uiLocation = await this.debuggerWorkspaceBinding.rawLocationToUILocation(rawLocation);
                    if (uiLocation) {
                        uiLocations.push(uiLocation);
                    }
                }
                return uiLocations;
            }
        }
        const startLocationsPromise = DebuggerWorkspaceBinding.instance().uiLocationToRawLocations(uiSourceCode, textRange.startLine, textRange.startColumn);
        const endLocationsPromise = DebuggerWorkspaceBinding.instance().uiLocationToRawLocations(uiSourceCode, textRange.endLine, textRange.endColumn);
        const [startLocations, endLocations] = await Promise.all([startLocationsPromise, endLocationsPromise]);
        const endLocationByModel = new Map();
        for (const location of endLocations) {
            endLocationByModel.set(location.debuggerModel, location);
        }
        let startLocation = null;
        let endLocation = null;
        for (const location of startLocations) {
            const endLocationCandidate = endLocationByModel.get(location.debuggerModel);
            if (endLocationCandidate) {
                startLocation = location;
                endLocation = endLocationCandidate;
                break;
            }
        }
        if (!startLocation || !endLocation) {
            return [];
        }
        return startLocation.debuggerModel
            .getPossibleBreakpoints(startLocation, endLocation, /* restrictToFunction */ false)
            .then(toUILocations.bind(this));
        async function toUILocations(locations) {
            const sortedLocationsPromises = locations.map(location => this.debuggerWorkspaceBinding.rawLocationToUILocation(location));
            const nullableLocations = await Promise.all(sortedLocationsPromises);
            const sortedLocations = nullableLocations.filter(location => location && location.uiSourceCode === uiSourceCode);
            if (!sortedLocations.length) {
                return [];
            }
            sortedLocations.sort(Workspace.UISourceCode.UILocation.comparator);
            let lastLocation = sortedLocations[0];
            const result = [lastLocation];
            for (const location of sortedLocations) {
                if (location.id() !== lastLocation.id()) {
                    result.push(location);
                    lastLocation = location;
                }
            }
            return result;
        }
    }
    breakpointLocationsForUISourceCode(uiSourceCode) {
        const breakpoints = this.breakpointsForUISourceCode.get(uiSourceCode);
        return breakpoints ? Array.from(breakpoints.values()) : [];
    }
    allBreakpointLocations() {
        const result = [];
        for (const breakpoints of this.breakpointsForUISourceCode.values()) {
            result.push(...breakpoints.values());
        }
        return result;
    }
    removeBreakpoint(breakpoint, removeFromStorage) {
        if (removeFromStorage) {
            this.storage.removeBreakpoint(breakpoint);
        }
        this.breakpointByStorageId.delete(breakpoint.breakpointStorageId());
    }
    uiLocationAdded(breakpoint, uiLocation) {
        let breakpoints = this.breakpointsForUISourceCode.get(uiLocation.uiSourceCode);
        if (!breakpoints) {
            breakpoints = new Map();
            this.breakpointsForUISourceCode.set(uiLocation.uiSourceCode, breakpoints);
        }
        const breakpointLocation = { breakpoint: breakpoint, uiLocation: uiLocation };
        breakpoints.set(uiLocation.id(), breakpointLocation);
        this.dispatchEventToListeners(Events.BreakpointAdded, breakpointLocation);
    }
    uiLocationRemoved(breakpoint, uiLocation) {
        const breakpoints = this.breakpointsForUISourceCode.get(uiLocation.uiSourceCode);
        if (!breakpoints) {
            return;
        }
        const breakpointLocation = breakpoints.get(uiLocation.id()) || null;
        if (!breakpointLocation) {
            return;
        }
        breakpoints.delete(uiLocation.id());
        if (breakpoints.size === 0) {
            this.breakpointsForUISourceCode.delete(uiLocation.uiSourceCode);
        }
        this.dispatchEventToListeners(Events.BreakpointRemoved, { breakpoint: breakpoint, uiLocation: uiLocation });
    }
}
// TODO(crbug.com/1167717): Make this a const enum again
// eslint-disable-next-line rulesdir/const_enum
export var Events;
(function (Events) {
    Events["BreakpointAdded"] = "breakpoint-added";
    Events["BreakpointRemoved"] = "breakpoint-removed";
})(Events || (Events = {}));
export class Breakpoint {
    breakpointManager;
    urlInternal;
    lineNumberInternal;
    columnNumberInternal;
    uiLocations;
    uiSourceCodes;
    conditionInternal;
    enabledInternal;
    isRemoved;
    currentState;
    modelBreakpoints;
    constructor(breakpointManager, primaryUISourceCode, url, lineNumber, columnNumber, condition, enabled) {
        this.breakpointManager = breakpointManager;
        this.urlInternal = url;
        this.lineNumberInternal = lineNumber;
        this.columnNumberInternal = columnNumber;
        this.uiLocations = new Set(); // Bound locations
        this.uiSourceCodes = new Set(); // All known UISourceCodes with this url
        this.currentState = null;
        this.modelBreakpoints = new Map();
        this.updateState(condition, enabled);
        this.addUISourceCode(primaryUISourceCode);
        this.breakpointManager.targetManager.observeModels(SDK.DebuggerModel.DebuggerModel, this);
    }
    async refreshInDebugger() {
        if (!this.isRemoved) {
            const breakpoints = Array.from(this.modelBreakpoints.values());
            await Promise.all(breakpoints.map(breakpoint => breakpoint.refreshBreakpoint()));
        }
    }
    modelAdded(debuggerModel) {
        const debuggerWorkspaceBinding = this.breakpointManager.debuggerWorkspaceBinding;
        this.modelBreakpoints.set(debuggerModel, new ModelBreakpoint(debuggerModel, this, debuggerWorkspaceBinding));
    }
    modelRemoved(debuggerModel) {
        const modelBreakpoint = this.modelBreakpoints.get(debuggerModel);
        this.modelBreakpoints.delete(debuggerModel);
        if (!modelBreakpoint) {
            return;
        }
        modelBreakpoint.cleanUpAfterDebuggerIsGone();
        modelBreakpoint.removeEventListeners();
    }
    addUISourceCode(uiSourceCode) {
        if (!this.uiSourceCodes.has(uiSourceCode)) {
            this.uiSourceCodes.add(uiSourceCode);
            if (!this.bound()) {
                this.breakpointManager.uiLocationAdded(this, this.defaultUILocation(uiSourceCode));
            }
        }
    }
    clearUISourceCodes() {
        if (!this.bound()) {
            this.removeAllUnboundLocations();
        }
        this.uiSourceCodes.clear();
    }
    removeUISourceCode(uiSourceCode) {
        if (this.uiSourceCodes.has(uiSourceCode)) {
            this.uiSourceCodes.delete(uiSourceCode);
            if (!this.bound()) {
                this.breakpointManager.uiLocationRemoved(this, this.defaultUILocation(uiSourceCode));
            }
        }
        // Do we need to do this? Not sure if bound locations will leak...
        if (this.bound()) {
            for (const uiLocation of this.uiLocations) {
                if (uiLocation.uiSourceCode === uiSourceCode) {
                    this.uiLocations.delete(uiLocation);
                    this.breakpointManager.uiLocationRemoved(this, uiLocation);
                }
            }
            if (!this.bound() && !this.isRemoved) {
                // Switch to unbound locations
                this.addAllUnboundLocations();
            }
        }
    }
    url() {
        return this.urlInternal;
    }
    lineNumber() {
        return this.lineNumberInternal;
    }
    columnNumber() {
        return this.columnNumberInternal;
    }
    uiLocationAdded(uiLocation) {
        if (this.isRemoved) {
            return;
        }
        if (!this.bound()) {
            // This is our first bound location; remove all unbound locations
            this.removeAllUnboundLocations();
        }
        this.uiLocations.add(uiLocation);
        this.breakpointManager.uiLocationAdded(this, uiLocation);
    }
    uiLocationRemoved(uiLocation) {
        if (this.uiLocations.has(uiLocation)) {
            this.uiLocations.delete(uiLocation);
            this.breakpointManager.uiLocationRemoved(this, uiLocation);
            if (!this.bound() && !this.isRemoved) {
                this.addAllUnboundLocations();
            }
        }
    }
    enabled() {
        return this.enabledInternal;
    }
    bound() {
        return this.uiLocations.size !== 0;
    }
    hasBoundScript() {
        for (const uiSourceCode of this.uiSourceCodes) {
            if (uiSourceCode.project().type() === Workspace.Workspace.projectTypes.Network) {
                return true;
            }
        }
        return false;
    }
    setEnabled(enabled) {
        this.updateState(this.conditionInternal, enabled);
    }
    condition() {
        return this.conditionInternal;
    }
    setCondition(condition) {
        this.updateState(condition, this.enabledInternal);
    }
    updateState(condition, enabled) {
        if (this.enabledInternal === enabled && this.conditionInternal === condition) {
            return;
        }
        this.enabledInternal = enabled;
        this.conditionInternal = condition;
        this.breakpointManager.storage.updateBreakpoint(this);
        this.updateBreakpoint();
    }
    updateBreakpoint() {
        if (!this.bound()) {
            this.removeAllUnboundLocations();
            if (!this.isRemoved) {
                this.addAllUnboundLocations();
            }
        }
        for (const modelBreakpoint of this.modelBreakpoints.values()) {
            modelBreakpoint.scheduleUpdateInDebugger();
        }
    }
    remove(keepInStorage) {
        this.isRemoved = true;
        const removeFromStorage = !keepInStorage;
        for (const modelBreakpoint of this.modelBreakpoints.values()) {
            modelBreakpoint.scheduleUpdateInDebugger();
            modelBreakpoint.removeEventListeners();
        }
        this.breakpointManager.removeBreakpoint(this, removeFromStorage);
        this.breakpointManager.targetManager.unobserveModels(SDK.DebuggerModel.DebuggerModel, this);
        this.clearUISourceCodes();
    }
    breakpointStorageId() {
        return BreakpointManager.breakpointStorageId(this.urlInternal, this.lineNumberInternal, this.columnNumberInternal);
    }
    resetLocations() {
        this.clearUISourceCodes();
        for (const modelBreakpoint of this.modelBreakpoints.values()) {
            modelBreakpoint.resetLocations();
        }
    }
    defaultUILocation(uiSourceCode) {
        return uiSourceCode.uiLocation(this.lineNumberInternal, this.columnNumberInternal);
    }
    removeAllUnboundLocations() {
        for (const uiSourceCode of this.uiSourceCodes) {
            this.breakpointManager.uiLocationRemoved(this, this.defaultUILocation(uiSourceCode));
        }
    }
    addAllUnboundLocations() {
        for (const uiSourceCode of this.uiSourceCodes) {
            this.breakpointManager.uiLocationAdded(this, this.defaultUILocation(uiSourceCode));
        }
    }
    getUiSourceCodes() {
        return this.uiSourceCodes;
    }
    getIsRemoved() {
        return this.isRemoved;
    }
}
export class ModelBreakpoint {
    debuggerModel;
    breakpoint;
    debuggerWorkspaceBinding;
    liveLocations;
    uiLocations;
    hasPendingUpdate;
    isUpdating;
    cancelCallback;
    currentState;
    breakpointIds;
    constructor(debuggerModel, breakpoint, debuggerWorkspaceBinding) {
        this.debuggerModel = debuggerModel;
        this.breakpoint = breakpoint;
        this.debuggerWorkspaceBinding = debuggerWorkspaceBinding;
        this.liveLocations = new LiveLocationPool();
        this.uiLocations = new Map();
        this.debuggerModel.addEventListener(SDK.DebuggerModel.Events.DebuggerWasDisabled, this.cleanUpAfterDebuggerIsGone, this);
        this.debuggerModel.addEventListener(SDK.DebuggerModel.Events.DebuggerWasEnabled, this.scheduleUpdateInDebugger, this);
        this.hasPendingUpdate = false;
        this.isUpdating = false;
        this.cancelCallback = false;
        this.currentState = null;
        this.breakpointIds = [];
        if (this.debuggerModel.debuggerEnabled()) {
            this.scheduleUpdateInDebugger();
        }
    }
    resetLocations() {
        for (const uiLocation of this.uiLocations.values()) {
            this.breakpoint.uiLocationRemoved(uiLocation);
        }
        this.uiLocations.clear();
        this.liveLocations.disposeAll();
    }
    scheduleUpdateInDebugger() {
        if (this.isUpdating) {
            this.hasPendingUpdate = true;
            return;
        }
        this.isUpdating = true;
        this.updateInDebugger().then(() => {
            this.isUpdating = false;
            if (this.hasPendingUpdate) {
                this.hasPendingUpdate = false;
                this.scheduleUpdateInDebugger();
            }
        });
    }
    scriptDiverged() {
        for (const uiSourceCode of this.breakpoint.getUiSourceCodes()) {
            const scriptFile = this.debuggerWorkspaceBinding.scriptFile(uiSourceCode, this.debuggerModel);
            if (scriptFile && scriptFile.hasDivergedFromVM()) {
                return true;
            }
        }
        return false;
    }
    async updateInDebugger() {
        if (this.debuggerModel.target().isDisposed()) {
            this.cleanUpAfterDebuggerIsGone();
            return;
        }
        const lineNumber = this.breakpoint.lineNumber();
        const columnNumber = this.breakpoint.columnNumber();
        const condition = this.breakpoint.condition();
        let newState = null;
        if (!this.breakpoint.getIsRemoved() && this.breakpoint.enabled() && !this.scriptDiverged()) {
            let debuggerLocations = [];
            for (const uiSourceCode of this.breakpoint.getUiSourceCodes()) {
                const locations = await DebuggerWorkspaceBinding.instance().uiLocationToRawLocations(uiSourceCode, lineNumber, columnNumber);
                debuggerLocations = locations.filter(location => location.debuggerModel === this.debuggerModel);
                if (debuggerLocations.length) {
                    break;
                }
            }
            if (debuggerLocations.length && debuggerLocations.every(loc => loc.script())) {
                const positions = debuggerLocations.map(loc => {
                    const script = loc.script();
                    return {
                        url: script.sourceURL,
                        scriptId: script.scriptId,
                        scriptHash: script.hash,
                        lineNumber: loc.lineNumber,
                        columnNumber: loc.columnNumber,
                    };
                });
                newState = new Breakpoint.State(positions, condition);
            }
            else if (this.breakpoint.currentState) {
                newState = new Breakpoint.State(this.breakpoint.currentState.positions, condition);
            }
            else {
                // TODO(bmeurer): This fallback doesn't make a whole lot of sense, we should
                // at least signal a warning to the developer that this breakpoint wasn't
                // really resolved.
                const position = {
                    url: this.breakpoint.url(),
                    scriptId: '',
                    scriptHash: '',
                    lineNumber,
                    columnNumber,
                };
                newState = new Breakpoint.State([position], condition);
            }
        }
        if (this.breakpointIds.length && Breakpoint.State.equals(newState, this.currentState)) {
            return;
        }
        this.breakpoint.currentState = newState;
        if (this.breakpointIds.length) {
            await this.refreshBreakpoint();
            return;
        }
        if (!newState) {
            return;
        }
        const results = await Promise.all(newState.positions.map(pos => {
            if (pos.url) {
                return this.debuggerModel.setBreakpointByURL(pos.url, pos.lineNumber, pos.columnNumber, condition);
            }
            return this.debuggerModel.setBreakpointInAnonymousScript(pos.scriptId, pos.scriptHash, pos.lineNumber, pos.columnNumber, condition);
        }));
        const breakpointIds = [];
        let locations = [];
        let maybeRescheduleUpdate = false;
        for (const result of results) {
            if (result.breakpointId) {
                breakpointIds.push(result.breakpointId);
                locations = locations.concat(result.locations);
            }
            else if (this.debuggerModel.debuggerEnabled() && !this.debuggerModel.isReadyToPause()) {
                maybeRescheduleUpdate = true;
            }
        }
        if (!breakpointIds.length && maybeRescheduleUpdate) {
            // TODO(crbug.com/1229541): This is a quickfix to prevent breakpoints from
            // disappearing if the Debugger is actually not enabled
            // yet. This quickfix should be removed as soon as we have a solution
            // to correctly synchronize the front-end with the inspector back-end.
            this.scheduleUpdateInDebugger();
            return;
        }
        this.currentState = newState;
        if (this.cancelCallback) {
            this.cancelCallback = false;
            return;
        }
        if (!breakpointIds.length) {
            this.breakpoint.remove(true);
            return;
        }
        this.breakpointIds = breakpointIds;
        this.breakpointIds.forEach(breakpointId => this.debuggerModel.addBreakpointListener(breakpointId, this.breakpointResolved, this));
        await Promise.all(locations.map(location => this.addResolvedLocation(location)));
    }
    async refreshBreakpoint() {
        if (!this.breakpointIds.length) {
            return;
        }
        this.resetLocations();
        await Promise.all(this.breakpointIds.map(id => this.debuggerModel.removeBreakpoint(id)));
        this.didRemoveFromDebugger();
        this.currentState = null;
        this.scheduleUpdateInDebugger();
    }
    didRemoveFromDebugger() {
        if (this.cancelCallback) {
            this.cancelCallback = false;
            return;
        }
        this.resetLocations();
        this.breakpointIds.forEach(breakpointId => this.debuggerModel.removeBreakpointListener(breakpointId, this.breakpointResolved, this));
        this.breakpointIds = [];
    }
    async breakpointResolved(event) {
        await this.addResolvedLocation(event.data);
    }
    async locationUpdated(liveLocation) {
        const oldUILocation = this.uiLocations.get(liveLocation);
        const uiLocation = await liveLocation.uiLocation();
        if (oldUILocation) {
            this.breakpoint.uiLocationRemoved(oldUILocation);
        }
        if (uiLocation) {
            this.uiLocations.set(liveLocation, uiLocation);
            this.breakpoint.uiLocationAdded(uiLocation);
        }
        else {
            this.uiLocations.delete(liveLocation);
        }
    }
    async addResolvedLocation(location) {
        const uiLocation = await this.debuggerWorkspaceBinding.rawLocationToUILocation(location);
        if (!uiLocation) {
            return;
        }
        const breakpointLocation = this.breakpoint.breakpointManager.findBreakpoint(uiLocation);
        if (breakpointLocation && breakpointLocation.breakpoint !== this.breakpoint) {
            // location clash
            this.breakpoint.remove(false /* keepInStorage */);
            return;
        }
        await this.debuggerWorkspaceBinding.createLiveLocation(location, this.locationUpdated.bind(this), this.liveLocations);
    }
    cleanUpAfterDebuggerIsGone() {
        if (this.isUpdating) {
            this.cancelCallback = true;
        }
        this.resetLocations();
        this.currentState = null;
        if (this.breakpointIds.length) {
            this.didRemoveFromDebugger();
        }
    }
    removeEventListeners() {
        this.debuggerModel.removeEventListener(SDK.DebuggerModel.Events.DebuggerWasDisabled, this.cleanUpAfterDebuggerIsGone, this);
        this.debuggerModel.removeEventListener(SDK.DebuggerModel.Events.DebuggerWasEnabled, this.scheduleUpdateInDebugger, this);
    }
}
(function (Breakpoint) {
    class State {
        positions;
        condition;
        constructor(positions, condition) {
            this.positions = positions;
            this.condition = condition;
        }
        static equals(stateA, stateB) {
            if (!stateA || !stateB) {
                return false;
            }
            if (stateA.condition !== stateB.condition) {
                return false;
            }
            if (stateA.positions.length !== stateB.positions.length) {
                return false;
            }
            for (let i = 0; i < stateA.positions.length; i++) {
                const positionA = stateA.positions[i];
                const positionB = stateB.positions[i];
                if (positionA.url !== positionB.url) {
                    return false;
                }
                if (positionA.scriptId !== positionB.scriptId) {
                    return false;
                }
                if (positionA.scriptHash !== positionB.scriptHash) {
                    return false;
                }
                if (positionA.lineNumber !== positionB.lineNumber) {
                    return false;
                }
                if (positionA.columnNumber !== positionB.columnNumber) {
                    return false;
                }
            }
            return true;
        }
    }
    Breakpoint.State = State;
})(Breakpoint || (Breakpoint = {}));
class Storage {
    setting;
    breakpoints;
    muted;
    constructor() {
        this.setting = Common.Settings.Settings.instance().createLocalSetting('breakpoints', []);
        this.breakpoints = new Map();
        const items = this.setting.get();
        for (const item of items) {
            this.breakpoints.set(BreakpointManager.breakpointStorageId(item.url, item.lineNumber, item.columnNumber), item);
        }
    }
    mute() {
        this.muted = true;
    }
    unmute() {
        delete this.muted;
    }
    breakpointItems(url) {
        return Array.from(this.breakpoints.values()).filter(item => item.url === url);
    }
    updateBreakpoint(breakpoint) {
        if (this.muted || !breakpoint.breakpointStorageId()) {
            return;
        }
        this.breakpoints.set(breakpoint.breakpointStorageId(), new Storage.Item(breakpoint));
        this.save();
    }
    removeBreakpoint(breakpoint) {
        if (!this.muted) {
            this.breakpoints.delete(breakpoint.breakpointStorageId());
            this.save();
        }
    }
    save() {
        this.setting.set(Array.from(this.breakpoints.values()));
    }
}
(function (Storage) {
    class Item {
        url;
        lineNumber;
        columnNumber;
        condition;
        enabled;
        constructor(breakpoint) {
            this.url = breakpoint.url();
            this.lineNumber = breakpoint.lineNumber();
            this.columnNumber = breakpoint.columnNumber();
            this.condition = breakpoint.condition();
            this.enabled = breakpoint.enabled();
        }
    }
    Storage.Item = Item;
})(Storage || (Storage = {}));
//# sourceMappingURL=BreakpointManager.js.map