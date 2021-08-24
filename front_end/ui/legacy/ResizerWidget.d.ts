import * as Common from '../../core/common/common.js';
export declare class ResizerWidget extends Common.ObjectWrapper.ObjectWrapper {
    private isEnabledInternal;
    private elementsInternal;
    private readonly installDragOnMouseDownBound;
    private cursorInternal;
    private startX?;
    private startY?;
    constructor();
    isEnabled(): boolean;
    setEnabled(enabled: boolean): void;
    elements(): Element[];
    addElement(element: HTMLElement): void;
    removeElement(element: HTMLElement): void;
    updateElementCursors(): void;
    private updateElementCursor;
    cursor(): string;
    setCursor(cursor: string): void;
    private installDragOnMouseDown;
    private dragStart;
    sendDragStart(x: number, y: number): void;
    private drag;
    sendDragMove(startX: number, currentX: number, startY: number, currentY: number, shiftKey: boolean): void;
    private dragEnd;
}
export declare enum Events {
    ResizeStart = "ResizeStart",
    ResizeUpdate = "ResizeUpdate",
    ResizeEnd = "ResizeEnd"
}
export declare class SimpleResizerWidget extends ResizerWidget {
    private isVerticalInternal;
    constructor();
    isVertical(): boolean;
    /**
     * Vertical widget resizes height (along y-axis).
     */
    setVertical(vertical: boolean): void;
    cursor(): string;
    sendDragStart(x: number, y: number): void;
    sendDragMove(startX: number, currentX: number, startY: number, currentY: number, shiftKey: boolean): void;
}
