import * as UI from '../../ui/legacy/legacy.js';
import type { Database } from './DatabaseModel.js';
export declare class DatabaseQueryView extends UI.Widget.VBox {
    database: Database;
    private queryWrapper;
    private readonly promptContainer;
    private readonly promptElement;
    private prompt;
    private readonly proxyElement;
    private queryResults;
    private virtualSelectedIndex;
    private lastSelectedElement;
    private selectionTimeout;
    constructor(database: Database);
    private messagesClicked;
    private onKeyDown;
    private onFocusIn;
    private onFocusOut;
    private isOutsideViewport;
    private updateFocusedItem;
    completions(_expression: string, prefix: string, _force?: boolean): Promise<UI.SuggestBox.Suggestions>;
    private selectStart;
    private promptKeyDown;
    private enterKeyPressed;
    private queryFinished;
    private appendViewQueryResult;
    private appendErrorQueryResult;
    private scrollResultIntoView;
    private appendQueryResult;
}
export declare enum Events {
    SchemaUpdated = "SchemaUpdated"
}
export declare const SQL_BUILT_INS: string[];
