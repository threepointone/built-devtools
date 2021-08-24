import * as UI from '../../ui/legacy/legacy.js';
import type { OverviewController } from './CSSOverviewController.js';
export declare class CSSOverviewProcessingView extends UI.Widget.Widget {
    private readonly formatter;
    private readonly controller;
    fragment?: UI.Fragment.Fragment;
    constructor(controller: OverviewController);
    private render;
    wasShown(): void;
}
