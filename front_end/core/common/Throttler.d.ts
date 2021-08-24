export declare type FinishCallback = (err: Error) => void;
export declare class Throttler {
    private readonly timeout;
    private isRunningProcess;
    private asSoonAsPossible;
    private process;
    private lastCompleteTime;
    private schedulePromise;
    private scheduleResolve;
    private processTimeout?;
    constructor(timeout: number);
    private processCompleted;
    private processCompletedForTests;
    private onTimeout;
    schedule(process: () => (Promise<unknown>), asSoonAsPossible?: boolean): Promise<void>;
    private innerSchedule;
    private clearTimeout;
    private setTimeout;
    private getTime;
}
