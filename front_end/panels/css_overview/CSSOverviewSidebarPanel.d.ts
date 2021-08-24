import * as UI from '../../ui/legacy/legacy.js';
export declare class CSSOverviewSidebarPanel extends UI.Widget.VBox {
    static get ITEM_CLASS_NAME(): string;
    static get SELECTED(): string;
    constructor();
    addItem(name: string, id: string): void;
    private reset;
    private deselectAllItems;
    private onItemClick;
    select(id: string): void;
    wasShown(): void;
}
export declare const enum SidebarEvents {
    ItemSelected = "ItemSelected",
    Reset = "Reset"
}
