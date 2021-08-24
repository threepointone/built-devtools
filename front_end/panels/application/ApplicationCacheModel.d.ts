import * as SDK from '../../core/sdk/sdk.js';
import type * as ProtocolProxyApi from '../../generated/protocol-proxy-api.js';
import type * as Protocol from '../../generated/protocol.js';
export declare class ApplicationCacheModel extends SDK.SDKModel.SDKModel {
    private readonly agent;
    private readonly statuses;
    private manifestURLsByFrame;
    private onLineInternal;
    constructor(target: SDK.Target.Target);
    private frameNavigatedCallback;
    private frameNavigated;
    private frameDetached;
    reset(): void;
    private mainFrameNavigated;
    private frameManifestUpdated;
    private frameManifestRemoved;
    frameManifestURL(frameId: Protocol.Page.FrameId): string;
    frameManifestStatus(frameId: Protocol.Page.FrameId): number;
    get onLine(): boolean;
    statusUpdated(frameId: Protocol.Page.FrameId, manifestURL: string, status: number): void;
    requestApplicationCache(frameId: Protocol.Page.FrameId): Promise<Protocol.ApplicationCache.ApplicationCache | null>;
    networkStateUpdated(isNowOnline: boolean): void;
}
export declare enum Events {
    FrameManifestStatusUpdated = "FrameManifestStatusUpdated",
    FrameManifestAdded = "FrameManifestAdded",
    FrameManifestRemoved = "FrameManifestRemoved",
    FrameManifestsReset = "FrameManifestsReset",
    NetworkStateChanged = "NetworkStateChanged"
}
export declare class ApplicationCacheDispatcher implements ProtocolProxyApi.ApplicationCacheDispatcher {
    private readonly applicationCacheModel;
    constructor(applicationCacheModel: ApplicationCacheModel);
    applicationCacheStatusUpdated({ frameId, manifestURL, status }: Protocol.ApplicationCache.ApplicationCacheStatusUpdatedEvent): void;
    networkStateUpdated({ isNowOnline }: Protocol.ApplicationCache.NetworkStateUpdatedEvent): void;
}
export declare const UNCACHED = 0;
export declare const IDLE = 1;
export declare const CHECKING = 2;
export declare const DOWNLOADING = 3;
export declare const UPDATEREADY = 4;
export declare const OBSOLETE = 5;
