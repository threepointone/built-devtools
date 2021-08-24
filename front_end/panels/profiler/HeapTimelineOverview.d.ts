import * as PerfUI from '../../ui/legacy/components/perf_ui/perf_ui.js';
import * as UI from '../../ui/legacy/legacy.js';
export declare class HeapTimelineOverview extends UI.Widget.VBox {
    readonly overviewCalculator: OverviewCalculator;
    overviewContainer: HTMLElement;
    overviewGrid: PerfUI.OverviewGrid.OverviewGrid;
    overviewCanvas: HTMLCanvasElement;
    windowLeft: number;
    windowRight: number;
    readonly yScale: SmoothScale;
    readonly xScale: SmoothScale;
    profileSamples: Samples;
    running?: boolean;
    updateOverviewCanvas?: boolean;
    updateGridTimerId?: number;
    updateTimerId?: number | null;
    windowWidth?: number;
    constructor();
    start(): void;
    stop(): void;
    setSamples(samples: Samples): void;
    drawOverviewCanvas(width: number, height: number): void;
    onResize(): void;
    onWindowChanged(): void;
    scheduleUpdate(): void;
    updateBoundaries(): void;
    update(): void;
    updateGrid(): void;
}
export declare const IdsRangeChanged: unique symbol;
export declare class SmoothScale {
    lastUpdate: number;
    currentScale: number;
    constructor();
    nextScale(target: number): number;
}
export declare class Samples {
    sizes: number[];
    ids: number[];
    timestamps: number[];
    max: number[];
    totalTime: number;
    constructor();
}
export declare class OverviewCalculator implements PerfUI.TimelineGrid.Calculator {
    maximumBoundaries: number;
    minimumBoundaries: number;
    xScaleFactor: number;
    constructor();
    updateBoundaries(chart: HeapTimelineOverview): void;
    computePosition(time: number): number;
    formatValue(value: number, precision?: number): string;
    maximumBoundary(): number;
    minimumBoundary(): number;
    zeroTime(): number;
    boundarySpan(): number;
}
