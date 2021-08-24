/**
 * Copyright (C) 2014 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
import * as Common from '../../core/common/common.js';
import * as PerfUI from '../../ui/legacy/components/perf_ui/perf_ui.js';
import type * as SDK from '../../core/sdk/sdk.js';
import * as UI from '../../ui/legacy/legacy.js';
export declare class ProfileFlameChartDataProvider implements PerfUI.FlameChart.FlameChartDataProvider {
    readonly colorGeneratorInternal: Common.Color.Generator;
    maxStackDepthInternal: number;
    timelineData_: PerfUI.FlameChart.TimelineData | null;
    entryNodes: SDK.ProfileTreeModel.ProfileNode[];
    font?: string;
    boldFont?: string;
    constructor();
    static colorGenerator(): Common.Color.Generator;
    minimumBoundary(): number;
    totalTime(): number;
    formatValue(value: number, precision?: number): string;
    maxStackDepth(): number;
    timelineData(): PerfUI.FlameChart.TimelineData | null;
    calculateTimelineData(): PerfUI.FlameChart.TimelineData;
    prepareHighlightedEntryInfo(_entryIndex: number): Element | null;
    canJumpToEntry(entryIndex: number): boolean;
    entryTitle(entryIndex: number): string;
    entryFont(entryIndex: number): string | null;
    entryHasDeoptReason(_entryIndex: number): boolean;
    entryColor(entryIndex: number): string;
    decorateEntry(_entryIndex: number, _context: CanvasRenderingContext2D, _text: string | null, _barX: number, _barY: number, _barWidth: number, _barHeight: number): boolean;
    forceDecoration(_entryIndex: number): boolean;
    textColor(_entryIndex: number): string;
    navStartTimes(): Map<string, SDK.TracingModel.Event>;
    entryNodesLength(): number;
}
export declare class CPUProfileFlameChart extends UI.Widget.VBox implements UI.SearchableView.Searchable {
    readonly searchableView: UI.SearchableView.SearchableView;
    readonly overviewPane: OverviewPane;
    readonly mainPane: PerfUI.FlameChart.FlameChart;
    entrySelected: boolean;
    readonly dataProvider: ProfileFlameChartDataProvider;
    searchResults: number[];
    searchResultIndex: number;
    constructor(searchableView: UI.SearchableView.SearchableView, dataProvider: ProfileFlameChartDataProvider);
    focus(): void;
    onWindowChanged(event: Common.EventTarget.EventTargetEvent): void;
    selectRange(timeLeft: number, timeRight: number): void;
    onEntrySelected(event: Common.EventTarget.EventTargetEvent): void;
    onEntryInvoked(event: Common.EventTarget.EventTargetEvent): void;
    update(): void;
    performSearch(searchConfig: UI.SearchableView.SearchConfig, _shouldJump: boolean, jumpBackwards?: boolean): void;
    searchCanceled(): void;
    jumpToNextSearchResult(): void;
    jumpToPreviousSearchResult(): void;
    supportsCaseSensitiveSearch(): boolean;
    supportsRegexSearch(): boolean;
}
export declare class OverviewCalculator implements PerfUI.TimelineGrid.Calculator {
    readonly formatter: (arg0: number, arg1?: number | undefined) => string;
    minimumBoundaries: number;
    maximumBoundaries: number;
    xScaleFactor: number;
    constructor(formatter: (arg0: number, arg1?: number | undefined) => string);
    updateBoundaries(overviewPane: OverviewPane): void;
    computePosition(time: number): number;
    formatValue(value: number, precision?: number): string;
    maximumBoundary(): number;
    minimumBoundary(): number;
    zeroTime(): number;
    boundarySpan(): number;
}
export declare class OverviewPane extends UI.Widget.VBox implements PerfUI.FlameChart.FlameChartDelegate {
    overviewContainer: HTMLElement;
    readonly overviewCalculator: OverviewCalculator;
    readonly overviewGrid: PerfUI.OverviewGrid.OverviewGrid;
    overviewCanvas: HTMLCanvasElement;
    dataProvider: PerfUI.FlameChart.FlameChartDataProvider;
    windowTimeLeft?: number;
    windowTimeRight?: number;
    updateTimerId?: number;
    constructor(dataProvider: PerfUI.FlameChart.FlameChartDataProvider);
    windowChanged(windowStartTime: number, windowEndTime: number): void;
    updateRangeSelection(_startTime: number, _endTime: number): void;
    updateSelectedGroup(_flameChart: PerfUI.FlameChart.FlameChart, _group: PerfUI.FlameChart.Group | null): void;
    selectRange(timeLeft: number, timeRight: number): void;
    onWindowChanged(event: Common.EventTarget.EventTargetEvent): void;
    timelineData(): PerfUI.FlameChart.TimelineData | null;
    onResize(): void;
    scheduleUpdate(): void;
    update(): void;
    drawOverviewCanvas(): void;
    calculateDrawData(width: number): Uint8Array;
    resetCanvas(width: number, height: number): void;
}
