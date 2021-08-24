import type { AnimationGroup } from './AnimationModel.js';
export declare class AnimationGroupPreviewUI {
    private model;
    element: HTMLDivElement;
    private readonly removeButtonInternal;
    private readonly replayOverlayElement;
    private readonly svg;
    private readonly viewBoxHeight;
    constructor(model: AnimationGroup);
    private groupDuration;
    removeButton(): Element;
    replay(): void;
    private render;
}
