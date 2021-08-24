import * as UI from '../../ui/legacy/legacy.js';
export declare class InspectedPagePlaceholder extends UI.Widget.Widget {
    private updateId?;
    constructor();
    static instance(opts?: {
        forceNew: null;
    }): InspectedPagePlaceholder;
    onResize(): void;
    restoreMinimumSize(): void;
    clearMinimumSize(): void;
    private dipPageRect;
    update(force?: boolean): void;
}
export declare const enum Events {
    Update = "Update"
}
