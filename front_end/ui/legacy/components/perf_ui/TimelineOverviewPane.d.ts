import type * as SDK from '../../../../core/sdk/sdk.js';
import * as UI from '../../legacy.js';
import type { Calculator } from './TimelineGrid.js';
export declare class TimelineOverviewPane extends UI.Widget.VBox {
    private readonly overviewCalculator;
    private readonly overviewGrid;
    private readonly cursorArea;
    private cursorElement;
    private overviewControls;
    private markers;
    private readonly overviewInfo;
    private readonly updateThrottler;
    private cursorEnabled;
    private cursorPosition;
    private lastWidth;
    private windowStartTime;
    private windowEndTime;
    private muteOnWindowChanged;
    constructor(prefix: string);
    private onMouseMove;
    private buildOverviewInfo;
    private hideCursor;
    wasShown(): void;
    willHide(): void;
    onResize(): void;
    setOverviewControls(overviewControls: TimelineOverview[]): void;
    setBounds(minimumBoundary: number, maximumBoundary: number): void;
    setNavStartTimes(navStartTimes: Map<string, SDK.TracingModel.Event>): void;
    scheduleUpdate(): void;
    private update;
    setMarkers(markers: Map<number, Element>): void;
    private updateMarkers;
    reset(): void;
    private onClick;
    private onWindowChanged;
    setWindowTimes(startTime: number, endTime: number): void;
    private updateWindow;
}
export declare enum Events {
    WindowChanged = "WindowChanged"
}
export declare class TimelineOverviewCalculator implements Calculator {
    private minimumBoundaryInternal;
    private maximumBoundaryInternal;
    private workingArea;
    private navStartTimes?;
    constructor();
    computePosition(time: number): number;
    positionToTime(position: number): number;
    setBounds(minimumBoundary: number, maximumBoundary: number): void;
    setNavStartTimes(navStartTimes: Map<string, SDK.TracingModel.Event>): void;
    setDisplayWidth(clientWidth: number): void;
    reset(): void;
    formatValue(value: number, precision?: number): string;
    maximumBoundary(): number;
    minimumBoundary(): number;
    zeroTime(): number;
    boundarySpan(): number;
}
export interface TimelineOverview {
    show(parentElement: Element, insertBefore?: Element | null): void;
    update(): void;
    dispose(): void;
    reset(): void;
    overviewInfoPromise(x: number): Promise<Element | null>;
    onClick(event: Event): boolean;
    setCalculator(calculator: TimelineOverviewCalculator): void;
}
export declare class TimelineOverviewBase extends UI.Widget.VBox implements TimelineOverview {
    private calculatorInternal;
    private canvas;
    private contextInternal;
    constructor();
    width(): number;
    height(): number;
    context(): CanvasRenderingContext2D;
    calculator(): TimelineOverviewCalculator | null;
    update(): void;
    dispose(): void;
    reset(): void;
    overviewInfoPromise(_x: number): Promise<Element | null>;
    setCalculator(calculator: TimelineOverviewCalculator): void;
    onClick(_event: Event): boolean;
    resetCanvas(): void;
    setCanvasSize(width: number, height: number): void;
}
export declare class OverviewInfo {
    private readonly anchorElement;
    private glassPane;
    private visible;
    private readonly element;
    constructor(anchor: Element);
    setContent(contentPromise: Promise<DocumentFragment>): Promise<void>;
    hide(): void;
}
