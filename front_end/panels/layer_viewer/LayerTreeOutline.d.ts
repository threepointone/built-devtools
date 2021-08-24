import type * as SDK from '../../core/sdk/sdk.js';
import * as UI from '../../ui/legacy/legacy.js';
import type { LayerView, LayerViewHost, Selection } from './LayerViewHost.js';
export declare class LayerTreeOutline extends UI.TreeOutline.TreeOutline implements LayerView {
    private layerViewHost;
    private treeOutline;
    private lastHoveredNode;
    element: HTMLElement;
    private layerTree?;
    private layerSnapshotMap?;
    constructor(layerViewHost: LayerViewHost);
    focus(): void;
    selectObject(selection: Selection | null): void;
    hoverObject(selection: Selection | null): void;
    setLayerTree(layerTree: SDK.LayerTreeBase.LayerTreeBase | null): void;
    private update;
    private onMouseMove;
    selectedNodeChanged(node: LayerTreeElement): void;
    private onContextMenu;
    private selectionForNode;
}
export declare enum Events {
    PaintProfilerRequested = "PaintProfilerRequested"
}
export declare class LayerTreeElement extends UI.TreeOutline.TreeElement {
    treeOutlineInternal: LayerTreeOutline;
    layer: SDK.LayerTreeBase.Layer;
    constructor(tree: LayerTreeOutline, layer: SDK.LayerTreeBase.Layer);
    update(): void;
    onselect(): boolean;
    setHovered(hovered: boolean): void;
}
export declare const layerToTreeElement: WeakMap<SDK.LayerTreeBase.Layer, LayerTreeElement>;
