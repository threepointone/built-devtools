import * as QuickOpen from '../../ui/legacy/components/quick_open/quick_open.js';
export declare class GoToLineQuickOpen extends QuickOpen.FilteredListWidget.Provider {
    static instance(opts?: {
        forceNew: boolean | null;
    }): GoToLineQuickOpen;
    selectItem(itemIndex: number | null, promptValue: string): void;
    notFoundText(query: string): string;
    private parsePosition;
    private currentUISourceCode;
    private currentSourceFrame;
}
