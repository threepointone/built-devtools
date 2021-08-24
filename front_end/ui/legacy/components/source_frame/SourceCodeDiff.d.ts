import * as Diff from '../../../../third_party/diff/diff.js';
import type { SourcesTextEditor } from './SourcesTextEditor.js';
export declare class SourceCodeDiff {
    private readonly textEditor;
    private animatedLines;
    private animationTimeout;
    constructor(textEditor: SourcesTextEditor);
    highlightModifiedLines(oldContent: string | null, newContent: string | null): void;
    private updateHighlightedLines;
    static computeDiff(diff: Diff.Diff.DiffArray): {
        type: EditType;
        from: number;
        to: number;
    }[];
}
export declare enum EditType {
    Insert = "Insert",
    Delete = "Delete",
    Modify = "Modify"
}
