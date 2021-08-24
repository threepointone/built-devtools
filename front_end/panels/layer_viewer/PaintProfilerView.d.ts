import type * as Protocol from '../../generated/protocol.js';
import type * as SDK from '../../core/sdk/sdk.js';
import * as UI from '../../ui/legacy/legacy.js';
export declare class PaintProfilerView extends UI.Widget.HBox {
    private canvasContainer;
    private readonly progressBanner;
    private pieChart;
    private readonly showImageCallback;
    private canvas;
    private context;
    private readonly selectionWindowInternal;
    private readonly innerBarWidth;
    private minBarHeight;
    private readonly barPaddingWidth;
    private readonly outerBarWidth;
    private pendingScale;
    private scale;
    private samplesPerBar;
    private log;
    private snapshot?;
    private logCategories?;
    private profiles?;
    private updateImageTimer?;
    constructor(showImageCallback: (arg0?: string | undefined) => void);
    static categories(): {
        [x: string]: PaintProfilerCategory;
    };
    private static initLogItemCategories;
    private static categoryForLogItem;
    onResize(): void;
    setSnapshotAndLog(snapshot: SDK.PaintProfiler.PaintProfilerSnapshot | null, log: SDK.PaintProfiler.PaintProfilerLogItem[], clipRect: Protocol.DOM.Rect | null): Promise<void>;
    setScale(scale: number): void;
    private update;
    private renderBar;
    private onWindowChanged;
    private updatePieChart;
    private calculatePieChart;
    private populatePieChart;
    private formatPieChartTime;
    selectionWindow(): {
        left: number;
        right: number;
    } | null;
    private updateImage;
    private reset;
    wasShown(): void;
}
export declare enum Events {
    WindowChanged = "WindowChanged"
}
export declare class PaintProfilerCommandLogView extends UI.ThrottledWidget.ThrottledWidget {
    private readonly treeOutline;
    private log;
    private readonly treeItemCache;
    private selectionWindow?;
    constructor();
    setCommandLog(log: SDK.PaintProfiler.PaintProfilerLogItem[]): void;
    private appendLogItem;
    updateWindow(selectionWindow: {
        left: number;
        right: number;
    } | null): void;
    doUpdate(): Promise<void>;
}
export declare class LogTreeElement extends UI.TreeOutline.TreeElement {
    readonly logItem: SDK.PaintProfiler.PaintProfilerLogItem;
    private readonly ownerView;
    private readonly filled;
    constructor(ownerView: PaintProfilerCommandLogView, logItem: SDK.PaintProfiler.PaintProfilerLogItem);
    onattach(): void;
    onpopulate(): Promise<void>;
    private paramToString;
    private paramsToString;
    private update;
}
export declare class LogPropertyTreeElement extends UI.TreeOutline.TreeElement {
    private property;
    constructor(property: {
        name: string;
        value: SDK.PaintProfiler.RawPaintProfilerLogItemParamValue;
    });
    static appendLogPropertyItem(element: UI.TreeOutline.TreeElement, name: string, value: SDK.PaintProfiler.RawPaintProfilerLogItemParamValue): void;
    onattach(): void;
}
export declare class PaintProfilerCategory {
    name: string;
    title: string;
    color: string;
    constructor(name: string, title: string, color: string);
}
