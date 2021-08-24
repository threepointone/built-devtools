// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as SDK from '../../core/sdk/sdk.js';
export class ApplicationCacheModel extends SDK.SDKModel.SDKModel {
    agent;
    statuses;
    manifestURLsByFrame;
    onLineInternal;
    constructor(target) {
        super(target);
        target.registerApplicationCacheDispatcher(new ApplicationCacheDispatcher(this));
        this.agent = target.applicationCacheAgent();
        this.agent.invoke_enable();
        const resourceTreeModel = target.model(SDK.ResourceTreeModel.ResourceTreeModel);
        if (!resourceTreeModel) {
            throw new Error('Target must provide an ResourceTreeModel');
        }
        resourceTreeModel.addEventListener(SDK.ResourceTreeModel.Events.FrameNavigated, this.frameNavigatedCallback, this);
        resourceTreeModel.addEventListener(SDK.ResourceTreeModel.Events.FrameDetached, this.frameDetached, this);
        this.statuses = new Map();
        this.manifestURLsByFrame = new Map();
        this.mainFrameNavigated();
        this.onLineInternal = true;
    }
    frameNavigatedCallback(event) {
        this.frameNavigated(event);
    }
    async frameNavigated(event) {
        const frame = event.data;
        if (frame.isMainFrame()) {
            this.mainFrameNavigated();
            return;
        }
        const frameId = frame.id;
        const manifestURL = await this.agent.invoke_getManifestForFrame({ frameId });
        if (manifestURL !== null && !manifestURL) {
            this.frameManifestRemoved(frameId);
        }
    }
    frameDetached(event) {
        this.frameManifestRemoved(event.data.frame.id);
    }
    reset() {
        this.statuses.clear();
        this.manifestURLsByFrame.clear();
        this.dispatchEventToListeners(Events.FrameManifestsReset);
    }
    async mainFrameNavigated() {
        const framesWithManifests = await this.agent.invoke_getFramesWithManifests();
        if (framesWithManifests.getError()) {
            return;
        }
        for (const frame of framesWithManifests.frameIds) {
            this.frameManifestUpdated(frame.frameId, frame.manifestURL, frame.status);
        }
    }
    frameManifestUpdated(frameId, manifestURL, status) {
        if (status === UNCACHED) {
            this.frameManifestRemoved(frameId);
            return;
        }
        if (!manifestURL) {
            return;
        }
        const recordedManifestURL = this.manifestURLsByFrame.get(frameId);
        if (recordedManifestURL && manifestURL !== recordedManifestURL) {
            this.frameManifestRemoved(frameId);
        }
        const statusChanged = this.statuses.get(frameId) !== status;
        this.statuses.set(frameId, status);
        if (!this.manifestURLsByFrame.has(frameId)) {
            this.manifestURLsByFrame.set(frameId, manifestURL);
            this.dispatchEventToListeners(Events.FrameManifestAdded, frameId);
        }
        if (statusChanged) {
            this.dispatchEventToListeners(Events.FrameManifestStatusUpdated, frameId);
        }
    }
    frameManifestRemoved(frameId) {
        const removed = this.manifestURLsByFrame.delete(frameId);
        this.statuses.delete(frameId);
        if (removed) {
            this.dispatchEventToListeners(Events.FrameManifestRemoved, frameId);
        }
    }
    frameManifestURL(frameId) {
        return this.manifestURLsByFrame.get(frameId) || '';
    }
    frameManifestStatus(frameId) {
        return this.statuses.get(frameId) || UNCACHED;
    }
    get onLine() {
        return this.onLineInternal;
    }
    statusUpdated(frameId, manifestURL, status) {
        this.frameManifestUpdated(frameId, manifestURL, status);
    }
    async requestApplicationCache(frameId) {
        const response = await this.agent.invoke_getApplicationCacheForFrame({ frameId });
        if (response.getError()) {
            return null;
        }
        return response.applicationCache;
    }
    networkStateUpdated(isNowOnline) {
        this.onLineInternal = isNowOnline;
        this.dispatchEventToListeners(Events.NetworkStateChanged, isNowOnline);
    }
}
SDK.SDKModel.SDKModel.register(ApplicationCacheModel, { capabilities: SDK.Target.Capability.DOM, autostart: false });
// TODO(crbug.com/1167717): Make this a const enum again
// eslint-disable-next-line rulesdir/const_enum
export var Events;
(function (Events) {
    Events["FrameManifestStatusUpdated"] = "FrameManifestStatusUpdated";
    Events["FrameManifestAdded"] = "FrameManifestAdded";
    Events["FrameManifestRemoved"] = "FrameManifestRemoved";
    Events["FrameManifestsReset"] = "FrameManifestsReset";
    Events["NetworkStateChanged"] = "NetworkStateChanged";
})(Events || (Events = {}));
export class ApplicationCacheDispatcher {
    applicationCacheModel;
    constructor(applicationCacheModel) {
        this.applicationCacheModel = applicationCacheModel;
    }
    applicationCacheStatusUpdated({ frameId, manifestURL, status }) {
        this.applicationCacheModel.statusUpdated(frameId, manifestURL, status);
    }
    networkStateUpdated({ isNowOnline }) {
        this.applicationCacheModel.networkStateUpdated(isNowOnline);
    }
}
export const UNCACHED = 0;
export const IDLE = 1;
export const CHECKING = 2;
export const DOWNLOADING = 3;
export const UPDATEREADY = 4;
export const OBSOLETE = 5;
//# sourceMappingURL=ApplicationCacheModel.js.map