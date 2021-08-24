import * as Common from '../../core/common/common.js';
import * as UI from '../../ui/legacy/legacy.js';
import { ChangesSidebar } from './ChangesSidebar.js';
export declare class ChangesView extends UI.Widget.VBox {
    private emptyWidget;
    private readonly workspaceDiff;
    readonly changesSidebar: ChangesSidebar;
    private selectedUISourceCode;
    private diffRows;
    private maxLineDigits;
    private readonly editor;
    private readonly toolbar;
    private readonly diffStats;
    private constructor();
    static instance(opts?: {
        forceNew: boolean | null;
    }): ChangesView;
    private selectedUISourceCodeChanged;
    private revert;
    private click;
    private revealUISourceCode;
    wasShown(): void;
    private refreshDiff;
    private hideDiff;
    private renderDiffRows;
    private lineFormatter;
}
export declare const enum RowType {
    Deletion = "deletion",
    Addition = "addition",
    Equal = "equal",
    Spacer = "spacer"
}
export declare class DiffUILocationRevealer implements Common.Revealer.Revealer {
    static instance(opts?: {
        forceNew: boolean;
    }): DiffUILocationRevealer;
    reveal(diffUILocation: Object, omitFocus?: boolean | undefined): Promise<void>;
}
export interface Token {
    text: string;
    className: string;
}
export interface Row {
    baselineLineNumber: number;
    currentLineNumber: number;
    tokens: Token[];
    type: RowType;
}
