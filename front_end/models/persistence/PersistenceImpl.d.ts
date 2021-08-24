import * as Common from '../../core/common/common.js';
import * as Bindings from '../bindings/bindings.js';
import * as Workspace from '../workspace/workspace.js';
export declare class PersistenceImpl extends Common.ObjectWrapper.ObjectWrapper {
    private readonly workspace;
    private readonly breakpointManager;
    private readonly filePathPrefixesToBindingCount;
    private subscribedBindingEventListeners;
    private readonly mapping;
    constructor(workspace: Workspace.Workspace.WorkspaceImpl, breakpointManager: Bindings.BreakpointManager.BreakpointManager);
    static instance(opts?: {
        forceNew: boolean | null;
        workspace: Workspace.Workspace.WorkspaceImpl | null;
        breakpointManager: Bindings.BreakpointManager.BreakpointManager | null;
    }): PersistenceImpl;
    addNetworkInterceptor(interceptor: (arg0: Workspace.UISourceCode.UISourceCode) => boolean): void;
    refreshAutomapping(): void;
    addBinding(binding: PersistenceBinding): Promise<void>;
    addBindingForTest(binding: PersistenceBinding): Promise<void>;
    removeBinding(binding: PersistenceBinding): Promise<void>;
    removeBindingForTest(binding: PersistenceBinding): Promise<void>;
    private innerAddBinding;
    private innerRemoveBinding;
    private onStatusAdded;
    private onStatusRemoved;
    private onWorkingCopyChanged;
    private syncWorkingCopy;
    private onWorkingCopyCommitted;
    syncContent(uiSourceCode: Workspace.UISourceCode.UISourceCode, newContent: string, encoded: boolean): void;
    static rewrapNodeJSContent(uiSourceCode: Workspace.UISourceCode.UISourceCode, currentContent: string, newContent: string): string;
    private contentSyncedForTest;
    private moveBreakpoints;
    hasUnsavedCommittedChanges(uiSourceCode: Workspace.UISourceCode.UISourceCode): boolean;
    binding(uiSourceCode: Workspace.UISourceCode.UISourceCode): PersistenceBinding | null;
    subscribeForBindingEvent(uiSourceCode: Workspace.UISourceCode.UISourceCode, listener: () => void): void;
    unsubscribeFromBindingEvent(uiSourceCode: Workspace.UISourceCode.UISourceCode, listener: () => void): void;
    private notifyBindingEvent;
    fileSystem(uiSourceCode: Workspace.UISourceCode.UISourceCode): Workspace.UISourceCode.UISourceCode | null;
    network(uiSourceCode: Workspace.UISourceCode.UISourceCode): Workspace.UISourceCode.UISourceCode | null;
    private addFilePathBindingPrefixes;
    private removeFilePathBindingPrefixes;
    filePathHasBindings(filePath: string): boolean;
}
export declare const NodePrefix = "(function (exports, require, module, __filename, __dirname) { ";
export declare const NodeSuffix = "\n});";
export declare const NodeShebang = "#!/usr/bin/env node";
export declare const Events: {
    BindingCreated: symbol;
    BindingRemoved: symbol;
};
export declare class PathEncoder {
    private readonly encoder;
    constructor();
    encode(path: string): string;
    decode(path: string): string;
}
export declare class PersistenceBinding {
    network: Workspace.UISourceCode.UISourceCode;
    fileSystem: Workspace.UISourceCode.UISourceCode;
    constructor(network: Workspace.UISourceCode.UISourceCode, fileSystem: Workspace.UISourceCode.UISourceCode);
}
