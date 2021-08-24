import { GlassPane } from './GlassPane.js';
export declare class Dialog extends GlassPane {
    private tabIndexBehavior;
    private tabIndexMap;
    private focusRestorer;
    private closeOnEscape;
    private targetDocument;
    private readonly targetDocumentKeyDownHandler;
    private escapeKeyCallback;
    constructor();
    static hasInstance(): boolean;
    show(where?: Document | Element): void;
    hide(): void;
    setCloseOnEscape(close: boolean): void;
    setEscapeKeyCallback(callback: (arg0: Event) => void): void;
    addCloseButton(): void;
    setOutsideTabIndexBehavior(tabIndexBehavior: OutsideTabIndexBehavior): void;
    private disableTabIndexOnElements;
    private getMainWidgetTabIndexElements;
    private restoreTabIndexOnElements;
    private onKeyDown;
    private static instance;
}
export declare enum OutsideTabIndexBehavior {
    DisableAllOutsideTabIndex = "DisableAllTabIndex",
    PreserveMainViewTabIndex = "PreserveMainViewTabIndex",
    PreserveTabIndex = "PreserveTabIndex"
}
