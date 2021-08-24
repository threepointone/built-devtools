import * as UI from '../../legacy/legacy.js';
import type { LazyUint8Array } from './LinearMemoryInspectorController.js';
export declare class Wrapper extends UI.Widget.VBox {
    view: LinearMemoryInspectorPaneImpl;
    private constructor();
    static instance(opts?: {
        forceNew: boolean | null;
    }): Wrapper;
    wasShown(): void;
}
export declare class LinearMemoryInspectorPaneImpl extends UI.Widget.VBox {
    private readonly tabbedPane;
    private readonly tabIdToInspectorView;
    constructor();
    static instance(): LinearMemoryInspectorPaneImpl;
    create(tabId: string, title: string, arrayWrapper: LazyUint8Array, address?: number): void;
    close(tabId: string): void;
    reveal(tabId: string, address?: number): void;
    refreshView(tabId: string): void;
    private tabClosed;
}
