import type * as Workspace from '../workspace/workspace.js';
export interface LiveLocation {
    update(): Promise<void>;
    uiLocation(): Promise<Workspace.UISourceCode.UILocation | null>;
    dispose(): void;
    isIgnoreListed(): Promise<boolean>;
}
export declare class LiveLocationWithPool implements LiveLocation {
    private updateDelegate;
    private readonly locationPool;
    private updatePromise;
    constructor(updateDelegate: (arg0: LiveLocation) => Promise<void>, locationPool: LiveLocationPool);
    update(): Promise<void>;
    uiLocation(): Promise<Workspace.UISourceCode.UILocation | null>;
    dispose(): void;
    isIgnoreListed(): Promise<boolean>;
}
export declare class LiveLocationPool {
    private readonly locations;
    constructor();
    add(location: LiveLocation): void;
    delete(location: LiveLocation): void;
    disposeAll(): void;
}
