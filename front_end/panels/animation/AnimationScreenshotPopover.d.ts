import * as UI from '../../ui/legacy/legacy.js';
export declare class AnimationScreenshotPopover extends UI.Widget.VBox {
    private frames;
    private rafId;
    private currentFrame;
    private progressBar;
    private showFrame?;
    private endDelay?;
    constructor(images: HTMLImageElement[]);
    wasShown(): void;
    willHide(): void;
    private changeFrame;
}
