import * as SDK from '../../core/sdk/sdk.js';
export declare class InputModel extends SDK.SDKModel.SDKModel {
    private readonly inputAgent;
    private activeTouchOffsetTop;
    private activeTouchParams;
    constructor(target: SDK.Target.Target);
    emitKeyEvent(event: Event): void;
    emitTouchFromMouseEvent(event: Event, offsetTop: number, zoom: number): void;
    cancelTouch(): void;
    private modifiersForEvent;
}
