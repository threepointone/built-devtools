import * as Platform from '../../core/platform/platform.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as UI from '../../ui/legacy/legacy.js';
import type { LayerView, LayerViewHost, Selection } from './LayerViewHost.js';
export declare class LayerDetailsView extends UI.Widget.Widget implements LayerView {
    private readonly layerViewHost;
    private readonly emptyWidget;
    private layerSnapshotMap;
    private tableElement;
    private tbodyElement;
    private sizeCell;
    private compositingReasonsCell;
    private memoryEstimateCell;
    private paintCountCell;
    private scrollRectsCell;
    private stickyPositionConstraintCell;
    private paintProfilerLink;
    private selection;
    constructor(layerViewHost: LayerViewHost);
    hoverObject(_selection: Selection | null): void;
    selectObject(selection: Selection | null): void;
    setLayerTree(_layerTree: SDK.LayerTreeBase.LayerTreeBase | null): void;
    wasShown(): void;
    private onScrollRectClicked;
    private invokeProfilerLink;
    private createScrollRectElement;
    private formatStickyAncestorLayer;
    private createStickyAncestorChild;
    private populateStickyPositionConstraintCell;
    update(): void;
    private buildContent;
    private createRow;
    private updateCompositingReasons;
    static getCompositingReasons(compositingReasonIds: string[]): string[];
}
export declare enum Events {
    PaintProfilerRequested = "PaintProfilerRequested"
}
export declare const slowScrollRectNames: Map<SDK.LayerTreeBase.Layer.ScrollRectType, () => Platform.UIString.LocalizedString>;
