import type * as SDK from '../../../../core/sdk/sdk.js';
import * as UI from '../../legacy.js';
export declare class FilmStripView extends UI.Widget.HBox {
    private statusLabel;
    private zeroTime;
    private spanTime;
    private model;
    private mode?;
    constructor();
    static setImageData(imageElement: HTMLImageElement, data: string | null): void;
    setMode(mode: string): void;
    setModel(filmStripModel: SDK.FilmStripModel.FilmStripModel, zeroTime: number, spanTime: number): void;
    createFrameElement(frame: SDK.FilmStripModel.Frame): Promise<Element>;
    frameByTime(time: number): SDK.FilmStripModel.Frame;
    update(): void;
    onResize(): void;
    private onMouseEvent;
    private onDoubleClick;
    reset(): void;
    setStatusText(text: string): void;
}
export declare enum Events {
    FrameSelected = "FrameSelected",
    FrameEnter = "FrameEnter",
    FrameExit = "FrameExit"
}
export declare const Modes: {
    TimeBased: string;
    FrameBased: string;
};
export declare class Dialog {
    private fragment;
    private readonly widget;
    private frames;
    private index;
    private zeroTime;
    private dialog;
    constructor(filmStripFrame: SDK.FilmStripModel.Frame, zeroTime?: number);
    private resize;
    private keyDown;
    private onPrevFrame;
    private onNextFrame;
    private onFirstFrame;
    private onLastFrame;
    private render;
}
