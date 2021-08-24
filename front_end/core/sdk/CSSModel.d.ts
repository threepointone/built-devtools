import * as TextUtils from '../../models/text_utils/text_utils.js';
import * as Common from '../common/common.js';
import type * as ProtocolProxyApi from '../../generated/protocol-proxy-api.js';
import type * as Protocol from '../../generated/protocol.js';
import { CSSFontFace } from './CSSFontFace.js';
import { CSSMatchedStyles } from './CSSMatchedStyles.js';
import { CSSMedia } from './CSSMedia.js';
import { CSSStyleRule } from './CSSRule.js';
import { CSSStyleDeclaration } from './CSSStyleDeclaration.js';
import { CSSStyleSheetHeader } from './CSSStyleSheetHeader.js';
import type { DOMNode } from './DOMModel.js';
import { DOMModel } from './DOMModel.js';
import type { Target } from './Target.js';
import { SDKModel } from './SDKModel.js';
import { SourceMapManager } from './SourceMapManager.js';
export declare class CSSModel extends SDKModel<EventTypes> {
    private isEnabledInternal;
    private cachedMatchedCascadeNode;
    private cachedMatchedCascadePromise;
    private readonly domModelInternal;
    private readonly sourceMapManagerInternal;
    agent: ProtocolProxyApi.CSSApi;
    private readonly styleLoader;
    private readonly resourceTreeModel;
    private styleSheetIdToHeader;
    private readonly styleSheetIdsForURL;
    private readonly originalStyleSheetTextInternal;
    private isRuleUsageTrackingEnabled;
    private readonly fontFacesInternal;
    private cssPropertyTracker;
    private isCSSPropertyTrackingEnabled;
    private isTrackingRequestPending;
    private readonly trackedCSSProperties;
    private readonly stylePollingThrottler;
    constructor(target: Target);
    headersForSourceURL(sourceURL: string): CSSStyleSheetHeader[];
    createRawLocationsByURL(sourceURL: string, lineNumber: number, columnNumber?: number | undefined): CSSLocation[];
    sourceMapManager(): SourceMapManager<CSSStyleSheetHeader>;
    static trimSourceURL(text: string): string;
    domModel(): DOMModel;
    setStyleText(styleSheetId: Protocol.CSS.StyleSheetId, range: TextUtils.TextRange.TextRange, text: string, majorChange: boolean): Promise<boolean>;
    setSelectorText(styleSheetId: Protocol.CSS.StyleSheetId, range: TextUtils.TextRange.TextRange, text: string): Promise<boolean>;
    setKeyframeKey(styleSheetId: Protocol.CSS.StyleSheetId, range: TextUtils.TextRange.TextRange, text: string): Promise<boolean>;
    startCoverage(): Promise<Protocol.ProtocolResponseWithError>;
    takeCoverageDelta(): Promise<{
        timestamp: number;
        coverage: Array<Protocol.CSS.RuleUsage>;
    }>;
    setLocalFontsEnabled(enabled: boolean): Promise<Protocol.ProtocolResponseWithError>;
    stopCoverage(): Promise<void>;
    mediaQueriesPromise(): Promise<CSSMedia[]>;
    isEnabled(): boolean;
    private enable;
    matchedStylesPromise(nodeId: Protocol.DOM.NodeId): Promise<CSSMatchedStyles | null>;
    classNamesPromise(styleSheetId: Protocol.CSS.StyleSheetId): Promise<string[]>;
    computedStylePromise(nodeId: Protocol.DOM.NodeId): Promise<Map<string, string> | null>;
    backgroundColorsPromise(nodeId: Protocol.DOM.NodeId): Promise<ContrastInfo | null>;
    platformFontsPromise(nodeId: Protocol.DOM.NodeId): Promise<Protocol.CSS.PlatformFontUsage[] | null>;
    allStyleSheets(): CSSStyleSheetHeader[];
    inlineStylesPromise(nodeId: Protocol.DOM.NodeId): Promise<InlineStyleResult | null>;
    forcePseudoState(node: DOMNode, pseudoClass: string, enable: boolean): boolean;
    pseudoState(node: DOMNode): string[] | null;
    setMediaText(styleSheetId: Protocol.CSS.StyleSheetId, range: TextUtils.TextRange.TextRange, newMediaText: string): Promise<boolean>;
    setContainerQueryText(styleSheetId: Protocol.CSS.StyleSheetId, range: TextUtils.TextRange.TextRange, newContainerQueryText: string): Promise<boolean>;
    addRule(styleSheetId: Protocol.CSS.StyleSheetId, ruleText: string, ruleLocation: TextUtils.TextRange.TextRange): Promise<CSSStyleRule | null>;
    requestViaInspectorStylesheet(node: DOMNode): Promise<CSSStyleSheetHeader | null>;
    mediaQueryResultChanged(): void;
    fontsUpdated(fontFace?: Protocol.CSS.FontFace | null): void;
    fontFaces(): CSSFontFace[];
    styleSheetHeaderForId(id: Protocol.CSS.StyleSheetId): CSSStyleSheetHeader | null;
    styleSheetHeaders(): CSSStyleSheetHeader[];
    fireStyleSheetChanged(styleSheetId: Protocol.CSS.StyleSheetId, edit?: Edit): void;
    private ensureOriginalStyleSheetText;
    private originalContentRequestedForTest;
    originalStyleSheetText(header: CSSStyleSheetHeader): Promise<string | null>;
    getAllStyleSheetHeaders(): Iterable<CSSStyleSheetHeader>;
    styleSheetAdded(header: Protocol.CSS.CSSStyleSheetHeader): void;
    styleSheetRemoved(id: Protocol.CSS.StyleSheetId): void;
    getStyleSheetIdsForURL(url: string): Protocol.CSS.StyleSheetId[];
    setStyleSheetText(styleSheetId: Protocol.CSS.StyleSheetId, newText: string, majorChange: boolean): Promise<string | null>;
    getStyleSheetText(styleSheetId: Protocol.CSS.StyleSheetId): Promise<string | null>;
    private resetStyleSheets;
    private resetFontFaces;
    suspendModel(): Promise<void>;
    resumeModel(): Promise<void>;
    setEffectivePropertyValueForNode(nodeId: Protocol.DOM.NodeId, propertyName: string, value: string): void;
    cachedMatchedCascadeForNode(node: DOMNode): Promise<CSSMatchedStyles | null>;
    discardCachedMatchedCascade(): void;
    createCSSPropertyTracker(propertiesToTrack: Protocol.CSS.CSSComputedStyleProperty[]): CSSPropertyTracker;
    enableCSSPropertyTracker(cssPropertyTracker: CSSPropertyTracker): void;
    disableCSSPropertyTracker(): void;
    private pollComputedStyleUpdates;
    dispose(): void;
    getAgent(): ProtocolProxyApi.CSSApi;
}
export declare enum Events {
    FontsUpdated = "FontsUpdated",
    MediaQueryResultChanged = "MediaQueryResultChanged",
    ModelWasEnabled = "ModelWasEnabled",
    PseudoStateForced = "PseudoStateForced",
    StyleSheetAdded = "StyleSheetAdded",
    StyleSheetChanged = "StyleSheetChanged",
    StyleSheetRemoved = "StyleSheetRemoved"
}
export declare type EventTypes = {
    [Events.FontsUpdated]: void;
    [Events.MediaQueryResultChanged]: void;
    [Events.ModelWasEnabled]: void;
    [Events.PseudoStateForced]: {
        node: DOMNode;
        pseudoClass: string;
        enable: boolean;
    };
    [Events.StyleSheetAdded]: CSSStyleSheetHeader;
    [Events.StyleSheetChanged]: {
        styleSheetId: Protocol.CSS.StyleSheetId;
        edit?: Edit;
    };
    [Events.StyleSheetRemoved]: CSSStyleSheetHeader;
};
export declare class Edit {
    styleSheetId: string;
    oldRange: TextUtils.TextRange.TextRange;
    newRange: TextUtils.TextRange.TextRange;
    newText: string;
    payload: Object | null;
    constructor(styleSheetId: string, oldRange: TextUtils.TextRange.TextRange, newText: string, payload: Object | null);
}
export declare class CSSLocation {
    private readonly cssModelInternal;
    styleSheetId: Protocol.CSS.StyleSheetId;
    url: string;
    lineNumber: number;
    columnNumber: number;
    constructor(header: CSSStyleSheetHeader, lineNumber: number, columnNumber?: number);
    cssModel(): CSSModel;
    header(): CSSStyleSheetHeader | null;
}
export declare class InlineStyleResult {
    inlineStyle: CSSStyleDeclaration | null;
    attributesStyle: CSSStyleDeclaration | null;
    constructor(inlineStyle: CSSStyleDeclaration | null, attributesStyle: CSSStyleDeclaration | null);
}
export declare class CSSPropertyTracker extends Common.ObjectWrapper.ObjectWrapper {
    private readonly cssModel;
    private readonly properties;
    constructor(cssModel: CSSModel, propertiesToTrack: Protocol.CSS.CSSComputedStyleProperty[]);
    start(): void;
    stop(): void;
    getTrackedProperties(): Protocol.CSS.CSSComputedStyleProperty[];
}
export declare enum CSSPropertyTrackerEvents {
    TrackedCSSPropertiesUpdated = "TrackedCSSPropertiesUpdated"
}
export interface ContrastInfo {
    backgroundColors: string[] | null;
    computedFontSize: string;
    computedFontWeight: string;
}
