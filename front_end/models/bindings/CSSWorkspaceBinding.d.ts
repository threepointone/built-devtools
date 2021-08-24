import * as SDK from '../../core/sdk/sdk.js';
import type * as Workspace from '../workspace/workspace.js';
import type { LiveLocation as LiveLocationInterface, LiveLocationPool } from './LiveLocation.js';
import { LiveLocationWithPool } from './LiveLocation.js';
export declare class CSSWorkspaceBinding implements SDK.TargetManager.SDKModelObserver<SDK.CSSModel.CSSModel> {
    private readonly workspace;
    private readonly modelToInfo;
    private readonly sourceMappings;
    private readonly liveLocationPromises;
    private constructor();
    static instance(opts?: {
        forceNew: boolean | null;
        targetManager: SDK.TargetManager.TargetManager | null;
        workspace: Workspace.Workspace.WorkspaceImpl | null;
    }): CSSWorkspaceBinding;
    static removeInstance(): void;
    private getCSSModelInfo;
    modelAdded(cssModel: SDK.CSSModel.CSSModel): void;
    modelRemoved(cssModel: SDK.CSSModel.CSSModel): void;
    /**
     * The promise returned by this function is resolved once all *currently*
     * pending LiveLocations are processed.
     */
    pendingLiveLocationChangesPromise(): Promise<void>;
    private recordLiveLocationChange;
    updateLocations(header: SDK.CSSStyleSheetHeader.CSSStyleSheetHeader): Promise<void>;
    createLiveLocation(rawLocation: SDK.CSSModel.CSSLocation, updateDelegate: (arg0: LiveLocationInterface) => Promise<void>, locationPool: LiveLocationPool): Promise<LiveLocation>;
    propertyUILocation(cssProperty: SDK.CSSProperty.CSSProperty, forName: boolean): Workspace.UISourceCode.UILocation | null;
    rawLocationToUILocation(rawLocation: SDK.CSSModel.CSSLocation): Workspace.UISourceCode.UILocation | null;
    uiLocationToRawLocations(uiLocation: Workspace.UISourceCode.UILocation): SDK.CSSModel.CSSLocation[];
    addSourceMapping(sourceMapping: SourceMapping): void;
}
/**
 * @interface
 */
export interface SourceMapping {
    rawLocationToUILocation(rawLocation: SDK.CSSModel.CSSLocation): Workspace.UISourceCode.UILocation | null;
    uiLocationToRawLocations(uiLocation: Workspace.UISourceCode.UILocation): SDK.CSSModel.CSSLocation[];
}
export declare class ModelInfo {
    private readonly eventListeners;
    private stylesSourceMapping;
    private sassSourceMapping;
    private readonly locations;
    private readonly unboundLocations;
    constructor(cssModel: SDK.CSSModel.CSSModel, workspace: Workspace.Workspace.WorkspaceImpl);
    createLiveLocation(rawLocation: SDK.CSSModel.CSSLocation, updateDelegate: (arg0: LiveLocationInterface) => Promise<void>, locationPool: LiveLocationPool): Promise<LiveLocation>;
    disposeLocation(location: LiveLocation): void;
    updateLocations(header: SDK.CSSStyleSheetHeader.CSSStyleSheetHeader): Promise<void[]>;
    private styleSheetAdded;
    private styleSheetRemoved;
    rawLocationToUILocation(rawLocation: SDK.CSSModel.CSSLocation): Workspace.UISourceCode.UILocation | null;
    uiLocationToRawLocations(uiLocation: Workspace.UISourceCode.UILocation): SDK.CSSModel.CSSLocation[];
    dispose(): void;
}
export declare class LiveLocation extends LiveLocationWithPool {
    readonly url: string;
    private readonly lineNumber;
    private readonly columnNumber;
    private readonly info;
    headerInternal: SDK.CSSStyleSheetHeader.CSSStyleSheetHeader | null;
    constructor(rawLocation: SDK.CSSModel.CSSLocation, info: ModelInfo, updateDelegate: (arg0: LiveLocationInterface) => Promise<void>, locationPool: LiveLocationPool);
    header(): SDK.CSSStyleSheetHeader.CSSStyleSheetHeader | null;
    setHeader(header: SDK.CSSStyleSheetHeader.CSSStyleSheetHeader | null): void;
    uiLocation(): Promise<Workspace.UISourceCode.UILocation | null>;
    dispose(): void;
    isIgnoreListed(): Promise<boolean>;
}
