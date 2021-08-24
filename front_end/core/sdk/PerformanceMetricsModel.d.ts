import type { Target } from './Target.js';
import { SDKModel } from './SDKModel.js';
export declare class PerformanceMetricsModel extends SDKModel<void> {
    private readonly agent;
    private readonly metricModes;
    private readonly metricData;
    constructor(target: Target);
    enable(): Promise<Object>;
    disable(): Promise<Object>;
    requestMetrics(): Promise<{
        metrics: Map<string, number>;
        timestamp: number;
    }>;
}
