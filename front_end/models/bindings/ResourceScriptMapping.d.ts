import * as Common from '../../core/common/common.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as Workspace from '../workspace/workspace.js';
import type * as Protocol from '../../generated/protocol.js';
import type { Breakpoint } from './BreakpointManager.js';
import type { DebuggerSourceMapping, DebuggerWorkspaceBinding } from './DebuggerWorkspaceBinding.js';
export declare class ResourceScriptMapping implements DebuggerSourceMapping {
    readonly debuggerModel: SDK.DebuggerModel.DebuggerModel;
    private workspace;
    readonly debuggerWorkspaceBinding: DebuggerWorkspaceBinding;
    private readonly uiSourceCodeToScriptFile;
    private readonly projects;
    private acceptedScripts;
    private readonly eventListeners;
    constructor(debuggerModel: SDK.DebuggerModel.DebuggerModel, workspace: Workspace.Workspace.WorkspaceImpl, debuggerWorkspaceBinding: DebuggerWorkspaceBinding);
    private project;
    rawLocationToUILocation(rawLocation: SDK.DebuggerModel.Location): Workspace.UISourceCode.UILocation | null;
    uiLocationToRawLocations(uiSourceCode: Workspace.UISourceCode.UISourceCode, lineNumber: number, columnNumber: number): SDK.DebuggerModel.Location[];
    private acceptsScript;
    private parsedScriptSource;
    scriptFile(uiSourceCode: Workspace.UISourceCode.UISourceCode): ResourceScriptFile | null;
    private removeScript;
    private executionContextDestroyed;
    private globalObjectCleared;
    resetForTest(): void;
    dispose(): void;
}
export declare class ResourceScriptFile extends Common.ObjectWrapper.ObjectWrapper {
    private readonly resourceScriptMapping;
    private readonly uiSourceCodeInternal;
    scriptInternal: SDK.Script.Script | undefined;
    private scriptSource?;
    private isDivergingFromVMInternal?;
    private hasDivergedFromVMInternal?;
    private isMergingToVMInternal?;
    constructor(resourceScriptMapping: ResourceScriptMapping, uiSourceCode: Workspace.UISourceCode.UISourceCode, scripts: SDK.Script.Script[]);
    hasScripts(scripts: SDK.Script.Script[]): boolean;
    private isDiverged;
    private workingCopyChanged;
    private workingCopyCommitted;
    scriptSourceWasSet(source: string, breakpoints: Breakpoint[], error: string | null, exceptionDetails?: Protocol.Runtime.ExceptionDetails): Promise<void>;
    private update;
    private divergeFromVM;
    private mergeToVM;
    hasDivergedFromVM(): boolean;
    isDivergingFromVM(): boolean;
    isMergingToVM(): boolean;
    checkMapping(): void;
    private mappingCheckedForTest;
    dispose(): void;
    addSourceMapURL(sourceMapURL: string): void;
    hasSourceMapURL(): boolean;
    get script(): SDK.Script.Script | null;
    get uiSourceCode(): Workspace.UISourceCode.UISourceCode;
}
export declare namespace ResourceScriptFile {
    enum Events {
        DidMergeToVM = "DidMergeToVM",
        DidDivergeFromVM = "DidDivergeFromVM"
    }
}
