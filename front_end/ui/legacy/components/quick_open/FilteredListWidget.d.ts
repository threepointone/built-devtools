import * as UI from '../../legacy.js';
export declare class FilteredListWidget extends UI.Widget.VBox implements UI.ListControl.ListDelegate<number> {
    private promptHistory;
    private scoringTimer;
    private filterTimer;
    private loadTimeout;
    private refreshListWithCurrentResult;
    private dialog;
    private query;
    private readonly promptElement;
    private readonly prompt;
    private readonly bottomElementsContainer;
    private readonly progressElement;
    private progressBarElement;
    private readonly items;
    private list;
    private readonly itemElementsContainer;
    private notFoundElement;
    private prefix;
    private provider;
    private readonly queryChangedCallback?;
    constructor(provider: Provider | null, promptHistory?: string[], queryChangedCallback?: ((arg0: string) => void));
    static highlightRanges(element: Element, query: string, caseInsensitive?: boolean): boolean;
    setPlaceholder(placeholder: string, ariaPlaceholder?: string): void;
    /**
     * Sets the text prompt's accessible title. By default, it is "Quick open prompt".
     */
    setPromptTitle(title: string): void;
    showAsDialog(dialogTitle?: string): void;
    setPrefix(prefix: string): void;
    setProvider(provider: Provider | null): void;
    setQuerySelectedRange(startIndex: number, endIndex: number): void;
    private attachProvider;
    private value;
    private cleanValue;
    wasShown(): void;
    willHide(): void;
    private clearTimers;
    private onEnter;
    private itemsLoaded;
    private updateAfterItemsLoaded;
    createElementForItem(item: number): Element;
    heightForItem(_item: number): number;
    isItemSelectable(_item: number): boolean;
    selectedItemChanged(_from: number | null, _to: number | null, fromElement: Element | null, toElement: Element | null): void;
    private onClick;
    setQuery(query: string): void;
    private tabKeyPressed;
    private itemsFilteredForTest;
    private filterItems;
    private refreshList;
    private updateNotFoundMessage;
    private onInput;
    private queryChanged;
    updateSelectedItemARIA(_fromElement: Element | null, _toElement: Element | null): boolean;
    private onKeyDown;
    private scheduleFilter;
    private selectItem;
}
export declare class Provider {
    private refreshCallback;
    constructor();
    setRefreshCallback(refreshCallback: () => void): void;
    attach(): void;
    itemCount(): number;
    itemKeyAt(_itemIndex: number): string;
    itemScoreAt(_itemIndex: number, _query: string): number;
    renderItem(_itemIndex: number, _query: string, _titleElement: Element, _subtitleElement: Element): void;
    renderAsTwoRows(): boolean;
    selectItem(_itemIndex: number | null, _promptValue: string): void;
    refresh(): void;
    rewriteQuery(query: string): string;
    queryChanged(_query: string): void;
    notFoundText(_query: string): string;
    detach(): void;
}
export declare function registerProvider(registration: ProviderRegistration): void;
export declare function getRegisteredProviders(): ProviderRegistration[];
export interface ProviderRegistration {
    provider: () => Promise<Provider>;
    title?: (() => string);
    prefix: string;
}
