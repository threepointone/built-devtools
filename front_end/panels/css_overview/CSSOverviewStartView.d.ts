import * as UI from '../../ui/legacy/legacy.js';
import type { OverviewController } from './CSSOverviewController.js';
export declare class CSSOverviewStartView extends UI.Widget.Widget {
    private readonly controller;
    constructor(controller: OverviewController);
    private render;
    wasShown(): void;
}
