import * as Workspace from '../../models/workspace/workspace.js';
import * as SourceFrame from '../../ui/legacy/components/source_frame/source_frame.js';
import type * as UI from '../../ui/legacy/legacy.js';
import { Plugin } from './Plugin.js';
export declare class GutterDiffPlugin extends Plugin {
    private readonly textEditor;
    private readonly uiSourceCode;
    private decorations;
    private readonly workspaceDiff;
    constructor(textEditor: SourceFrame.SourcesTextEditor.SourcesTextEditor, uiSourceCode: Workspace.UISourceCode.UISourceCode);
    static accepts(uiSourceCode: Workspace.UISourceCode.UISourceCode): boolean;
    private updateDecorations;
    private update;
    private innerUpdate;
    private decorationsByLine;
    private calculateDecorationsDiff;
    private decorationsSetForTest;
    populateLineGutterContextMenu(contextMenu: UI.ContextMenu.ContextMenu, _lineNumber: number): Promise<void>;
    populateTextAreaContextMenu(contextMenu: UI.ContextMenu.ContextMenu, _lineNumber: number, _columnNumber: number): Promise<void>;
    static appendRevealDiffContextMenu(contextMenu: UI.ContextMenu.ContextMenu, uiSourceCode: Workspace.UISourceCode.UISourceCode): void;
    dispose(): void;
}
export declare class GutterDecoration {
    private readonly textEditor;
    private readonly position;
    private readonly className;
    type: SourceFrame.SourceCodeDiff.EditType;
    constructor(textEditor: SourceFrame.SourcesTextEditor.SourcesTextEditor, lineNumber: number, type: SourceFrame.SourceCodeDiff.EditType);
    lineNumber(): number;
    install(): void;
    remove(): void;
}
export declare const DiffGutterType: string;
export declare class ContextMenuProvider implements UI.ContextMenu.Provider {
    static instance(opts?: {
        forceNew: boolean | null;
    }): ContextMenuProvider;
    appendApplicableItems(_event: Event, contextMenu: UI.ContextMenu.ContextMenu, target: Object): void;
}
