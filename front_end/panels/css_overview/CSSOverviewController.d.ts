import * as Common from '../../core/common/common.js';
export declare class OverviewController extends Common.ObjectWrapper.ObjectWrapper {
    currentUrl: string;
    constructor();
    private checkUrlAndResetIfChanged;
}
export declare const Events: {
    RequestOverviewStart: symbol;
    RequestNodeHighlight: symbol;
    PopulateNodes: symbol;
    RequestOverviewCancel: symbol;
    OverviewCompleted: symbol;
    Reset: symbol;
};
