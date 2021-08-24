import type { DataGridData, Parameters } from './DataGrid.js';
import { DataGridImpl, DataGridNode } from './DataGrid.js';
export declare class ViewportDataGrid<T> extends DataGridImpl<ViewportDataGridNode<T>> {
    private readonly onScrollBound;
    private visibleNodes;
    stickToBottom: boolean;
    private updateIsFromUser;
    private lastScrollTop;
    private firstVisibleIsStriped;
    private isStriped;
    private updateAnimationFrameId?;
    constructor(dataGridParameters: Parameters);
    setStriped(striped: boolean): void;
    private updateStripesClass;
    setScrollContainer(scrollContainer: HTMLElement): void;
    onResize(): void;
    setStickToBottom(stick: boolean): void;
    private onScroll;
    scheduleUpdateStructure(): void;
    scheduleUpdate(isFromUser?: boolean): void;
    updateInstantly(): void;
    renderInline(): void;
    private calculateVisibleNodes;
    private contentHeight;
    private update;
    revealViewportNode(node: ViewportDataGridNode<T>): void;
}
export declare enum Events {
    ViewportCalculated = "ViewportCalculated"
}
export declare class ViewportDataGridNode<T> extends DataGridNode<ViewportDataGridNode<T>> {
    private stale;
    private flatNodes;
    private isStripedInternal;
    constructor(data?: DataGridData | null, hasChildren?: boolean);
    element(): Element;
    setStriped(isStriped: boolean): void;
    isStriped(): boolean;
    clearFlatNodes(): void;
    flatChildren(): ViewportDataGridNode<T>[];
    insertChild(child: DataGridNode<ViewportDataGridNode<T>>, index: number): void;
    removeChild(child: DataGridNode<ViewportDataGridNode<T>>): void;
    removeChildren(): void;
    private unlink;
    collapse(): void;
    expand(): void;
    attached(): boolean;
    refresh(): void;
    reveal(): void;
    recalculateSiblings(index: number): void;
}
