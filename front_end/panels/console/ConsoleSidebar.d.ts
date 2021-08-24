import * as Common from '../../core/common/common.js';
import * as UI from '../../ui/legacy/legacy.js';
import { ConsoleFilter } from './ConsoleFilter.js';
import type { ConsoleViewMessage } from './ConsoleViewMessage.js';
export declare class ConsoleSidebar extends UI.Widget.VBox {
    private readonly tree;
    private selectedTreeElement;
    private readonly treeElements;
    constructor();
    private appendGroup;
    clear(): void;
    onMessageAdded(viewMessage: ConsoleViewMessage): void;
    shouldBeVisible(viewMessage: ConsoleViewMessage): boolean;
    private selectionChanged;
    wasShown(): void;
}
export declare const enum Events {
    FilterSelected = "FilterSelected"
}
declare class ConsoleSidebarTreeElement extends UI.TreeOutline.TreeElement {
    protected filterInternal: ConsoleFilter;
    constructor(title: string | Node, filter: ConsoleFilter);
    filter(): ConsoleFilter;
}
export declare class URLGroupTreeElement extends ConsoleSidebarTreeElement {
    private countElement;
    private messageCount;
    constructor(filter: ConsoleFilter);
    incrementAndUpdateCounter(): void;
}
export declare class FilterTreeElement extends ConsoleSidebarTreeElement {
    private readonly selectedFilterSetting;
    private readonly urlTreeElements;
    private messageCount;
    private uiStringForFilterCount;
    constructor(filter: ConsoleFilter, icon: UI.Icon.Icon, selectedFilterSetting: Common.Settings.Setting<string>);
    clear(): void;
    name(): string;
    onselect(selectedByUser?: boolean): boolean;
    private updateCounter;
    private updateGroupTitle;
    onMessageAdded(viewMessage: ConsoleViewMessage): void;
    private childElement;
}
export {};
