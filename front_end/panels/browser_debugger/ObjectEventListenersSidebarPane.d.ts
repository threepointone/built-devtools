import * as UI from '../../ui/legacy/legacy.js';
export declare class ObjectEventListenersSidebarPane extends UI.Widget.VBox implements UI.Toolbar.ItemsProvider {
    private readonly refreshButton;
    private readonly eventListenersView;
    private lastRequestedContext?;
    private constructor();
    static instance(): ObjectEventListenersSidebarPane;
    toolbarItems(): UI.Toolbar.ToolbarItem[];
    update(): void;
    wasShown(): void;
    willHide(): void;
    private windowObjectInContext;
    private refreshClick;
}
export declare const objectGroupName = "object-event-listeners-sidebar-pane";
