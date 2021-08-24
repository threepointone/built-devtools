import * as Workspace from '../../models/workspace/workspace.js';
import * as WorkspaceDiff from '../../models/workspace_diff/workspace_diff.js';
import * as UI from '../../ui/legacy/legacy.js';
export declare class ChangesSidebar extends UI.Widget.Widget {
    private treeoutline;
    private readonly treeElements;
    private readonly workspaceDiff;
    constructor(workspaceDiff: WorkspaceDiff.WorkspaceDiff.WorkspaceDiffImpl);
    selectUISourceCode(uiSourceCode: Workspace.UISourceCode.UISourceCode, omitFocus?: boolean | undefined): void;
    selectedUISourceCode(): Workspace.UISourceCode.UISourceCode | null;
    private selectionChanged;
    private uiSourceCodeMofiedStatusChanged;
    private removeUISourceCode;
    private addUISourceCode;
    wasShown(): void;
}
export declare const enum Events {
    SelectedUISourceCodeChanged = "SelectedUISourceCodeChanged"
}
export declare class UISourceCodeTreeElement extends UI.TreeOutline.TreeElement {
    uiSourceCode: Workspace.UISourceCode.UISourceCode;
    private readonly eventListeners;
    constructor(uiSourceCode: Workspace.UISourceCode.UISourceCode);
    private updateTitle;
    dispose(): void;
}
