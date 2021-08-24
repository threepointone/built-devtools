import * as Common from '../../core/common/common.js';
import type { Suggestions } from './SuggestBox.js';
import type { ToolbarButton } from './Toolbar.js';
import { HBox } from './Widget.js';
export declare class FilterBar extends HBox {
    private enabled;
    private readonly stateSetting;
    private readonly filterButtonInternal;
    private filters;
    private alwaysShowFilters?;
    private showingWidget?;
    constructor(name: string, visibleByDefault?: boolean);
    filterButton(): ToolbarButton;
    addFilter(filter: FilterUI): void;
    setEnabled(enabled: boolean): void;
    forceShowFilterBar(): void;
    showOnce(): void;
    private filterChanged;
    wasShown(): void;
    private updateFilterBar;
    focus(): void;
    private updateFilterButton;
    clear(): void;
    setting(): Common.Settings.Setting<boolean>;
    visible(): boolean;
}
export declare const enum FilterBarEvents {
    Changed = "Changed"
}
export interface FilterUI extends Common.EventTarget.EventTarget {
    isActive(): boolean;
    element(): Element;
}
export declare const enum FilterUIEvents {
    FilterChanged = "FilterChanged"
}
export declare class TextFilterUI extends Common.ObjectWrapper.ObjectWrapper implements FilterUI {
    private readonly filterElement;
    private readonly filterInputElement;
    private prompt;
    private readonly proxyElement;
    private suggestionProvider;
    constructor();
    private completions;
    isActive(): boolean;
    element(): Element;
    value(): string;
    setValue(value: string): void;
    focus(): void;
    setSuggestionProvider(suggestionProvider: (arg0: string, arg1: string, arg2?: boolean | undefined) => Promise<Suggestions>): void;
    private valueChanged;
    private updateEmptyStyles;
    clear(): void;
}
export declare class NamedBitSetFilterUI extends Common.ObjectWrapper.ObjectWrapper implements FilterUI {
    private readonly filtersElement;
    private readonly typeFilterElementTypeNames;
    private allowedTypes;
    private readonly typeFilterElements;
    private readonly setting;
    constructor(items: Item[], setting?: Common.Settings.Setting<{
        [key: string]: boolean;
    }>);
    reset(): void;
    isActive(): boolean;
    element(): Element;
    accept(typeName: string): boolean;
    private settingChanged;
    private update;
    private addBit;
    private onTypeFilterClicked;
    private onTypeFilterKeydown;
    private keyFocusNextBit;
    private toggleTypeFilter;
    static readonly ALL_TYPES = "all";
}
export declare class CheckboxFilterUI extends Common.ObjectWrapper.ObjectWrapper implements FilterUI {
    private readonly filterElement;
    private readonly activeWhenChecked;
    private label;
    private checkboxElement;
    constructor(className: string, title: string, activeWhenChecked?: boolean, setting?: Common.Settings.Setting<boolean>);
    isActive(): boolean;
    checked(): boolean;
    setChecked(checked: boolean): void;
    element(): HTMLDivElement;
    labelElement(): Element;
    private fireUpdated;
    setColor(backgroundColor: string, borderColor: string): void;
}
export interface Item {
    name: string;
    label: () => string;
    title?: string;
}
