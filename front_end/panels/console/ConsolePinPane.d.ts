import * as Common from '../../core/common/common.js';
import * as UI from '../../ui/legacy/legacy.js';
export declare class ConsolePinPane extends UI.ThrottledWidget.ThrottledWidget {
    private readonly liveExpressionButton;
    private pins;
    private readonly pinsSetting;
    constructor(liveExpressionButton: UI.Toolbar.ToolbarButton);
    wasShown(): void;
    willHide(): void;
    savePins(): void;
    private contextMenuEventFired;
    private removeAllPins;
    removePin(pin: ConsolePin): void;
    addPin(expression: string, userGesture?: boolean): void;
    private focusedPinAfterDeletion;
    doUpdate(): Promise<void>;
    private updatedForTest;
}
export declare class ConsolePin extends Common.ObjectWrapper.ObjectWrapper {
    private readonly pinElement;
    private readonly pinPreview;
    private lastResult;
    private lastExecutionContext;
    private editor;
    private committedExpression;
    private hovered;
    private lastNode;
    private readonly editorPromise;
    private consolePinNumber;
    constructor(expression: string, pinPane: ConsolePinPane);
    setHovered(hovered: boolean): void;
    expression(): string;
    element(): Element;
    focus(): Promise<void>;
    appendToContextMenu(contextMenu: UI.ContextMenu.ContextMenu): void;
    updatePreview(): Promise<void>;
}
