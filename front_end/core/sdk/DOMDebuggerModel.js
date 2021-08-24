// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Common from '../common/common.js';
import * as i18n from '../i18n/i18n.js';
import { DOMModel, Events as DOMModelEvents } from './DOMModel.js';
import { RemoteObject } from './RemoteObject.js';
import { RuntimeModel } from './RuntimeModel.js';
import { Capability } from './Target.js';
import { SDKModel } from './SDKModel.js';
import { TargetManager } from './TargetManager.js';
const UIStrings = {
    /**
    *@description Title for a category of breakpoints on Trusted Type violations
    */
    trustedTypeViolations: 'Trusted Type Violations',
    /**
     * @description Noun. Title for a checkbox that turns on breakpoints on Trusted Type sink violations.
     * "Trusted Types" is a Web API. A "Sink" (Noun, singular) is a special function, akin to a data sink, that expects
     * to receive data in a specific format. Should the data be in the wrong format, or something else
     * go wrong, its called a "sink violation".
     */
    sinkViolations: 'Sink Violations',
    /**
    *@description Title for a checkbox that turns on breakpoints on Trusted Type policy violations
    */
    policyViolations: 'Policy Violations',
    /**
    *@description Text that refers to the animation of the web page
    */
    animation: 'Animation',
    /**
    *@description Text in DOMDebugger Model
    */
    canvas: 'Canvas',
    /**
    *@description Title for a group of cities
    */
    geolocation: 'Geolocation',
    /**
    *@description Text in DOMDebugger Model
    */
    notification: 'Notification',
    /**
    *@description Text to parse something
    */
    parse: 'Parse',
    /**
    *@description Label for a group of JavaScript files
    */
    script: 'Script',
    /**
    *@description Text in DOMDebugger Model
    */
    timer: 'Timer',
    /**
    *@description Text in DOMDebugger Model
    */
    window: 'Window',
    /**
    *@description Title of the WebAudio tool
    */
    webaudio: 'WebAudio',
    /**
    *@description Text that appears on a button for the media resource type filter.
    */
    media: 'Media',
    /**
    *@description Text in DOMDebugger Model
    */
    pictureinpicture: 'Picture-in-Picture',
    /**
    *@description Text in DOMDebugger Model
    */
    clipboard: 'Clipboard',
    /**
     * @description Noun. Describes a group of DOM events (such as 'select' and 'submit') in this context.
     */
    control: 'Control',
    /**
    *@description Text that refers to device such as a phone
    */
    device: 'Device',
    /**
    *@description Text in DOMDebugger Model
    */
    domMutation: 'DOM Mutation',
    /**
    *@description Text in DOMDebugger Model
    */
    dragDrop: 'Drag / drop',
    /**
    *@description Text in DOMDebugger Model
    */
    keyboard: 'Keyboard',
    /**
    *@description Text to load something
    */
    load: 'Load',
    /**
    *@description Text in DOMDebugger Model
    */
    mouse: 'Mouse',
    /**
    *@description Text in DOMDebugger Model
    */
    pointer: 'Pointer',
    /**
    *@description Text for the touch type to simulate on a device
    */
    touch: 'Touch',
    /**
    *@description Text that appears on a button for the xhr resource type filter.
    */
    xhr: 'XHR',
    /**
    *@description Text in the Event Listener Breakpoints Panel of the JavaScript Debugger in the Sources Panel
    *@example {setTimeout} PH1
    */
    setTimeoutOrIntervalFired: '{PH1} fired',
    /**
    *@description Text in the Event Listener Breakpoints Panel of the JavaScript Debugger in the Sources Panel
    */
    scriptFirstStatement: 'Script First Statement',
    /**
    *@description Text in the Event Listener Breakpoints Panel of the JavaScript Debugger in the Sources Panel
    */
    scriptBlockedByContentSecurity: 'Script Blocked by Content Security Policy',
    /**
    *@description Text for the request animation frame event
    */
    requestAnimationFrame: 'Request Animation Frame',
    /**
    *@description Text to cancel the animation frame
    */
    cancelAnimationFrame: 'Cancel Animation Frame',
    /**
    *@description Text for the event that an animation frame is fired
    */
    animationFrameFired: 'Animation Frame Fired',
    /**
    *@description Text in the Event Listener Breakpoints Panel of the JavaScript Debugger in the Sources Panel
    */
    webglErrorFired: 'WebGL Error Fired',
    /**
    *@description Text in the Event Listener Breakpoints Panel of the JavaScript Debugger in the Sources Panel
    */
    webglWarningFired: 'WebGL Warning Fired',
    /**
    *@description Text in the Event Listener Breakpoints Panel of the JavaScript Debugger in the Sources Panel
    */
    setInnerhtml: 'Set `innerHTML`',
    /**
    *@description Name of a breakpoint type in the Sources Panel.
    */
    createCanvasContext: 'Create canvas context',
    /**
    *@description Name of a breakpoint type in the Sources Panel.
    */
    createAudiocontext: 'Create `AudioContext`',
    /**
    *@description Name of a breakpoint type in the Sources Panel. Close is a verb.
    */
    closeAudiocontext: 'Close `AudioContext`',
    /**
    *@description Name of a breakpoint type in the Sources Panel. Resume is a verb.
    */
    resumeAudiocontext: 'Resume `AudioContext`',
    /**
    *@description Name of a breakpoint type in the Sources Panel.
    */
    suspendAudiocontext: 'Suspend `AudioContext`',
    /**
    *@description Error message text
    *@example {Snag Error} PH1
    */
    webglErrorFiredS: 'WebGL Error Fired ({PH1})',
    /**
    *@description Text in DOMDebugger Model
    *@example {"script-src 'self'"} PH1
    */
    scriptBlockedDueToContent: 'Script blocked due to Content Security Policy directive: {PH1}',
    /**
    *@description Text for the service worker type.
    */
    worker: 'Worker',
};
const str_ = i18n.i18n.registerUIStrings('core/sdk/DOMDebuggerModel.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class DOMDebuggerModel extends SDKModel {
    agent;
    runtimeModelInternal;
    domModel;
    domBreakpointsInternal;
    domBreakpointsSetting;
    suspended = false;
    constructor(target) {
        super(target);
        this.agent = target.domdebuggerAgent();
        this.runtimeModelInternal = target.model(RuntimeModel);
        this.domModel = target.model(DOMModel);
        this.domModel.addEventListener(DOMModelEvents.DocumentUpdated, this.documentUpdated, this);
        this.domModel.addEventListener(DOMModelEvents.NodeRemoved, this.nodeRemoved, this);
        this.domBreakpointsInternal = [];
        this.domBreakpointsSetting = Common.Settings.Settings.instance().createLocalSetting('domBreakpoints', []);
        if (this.domModel.existingDocument()) {
            this.documentUpdated();
        }
    }
    runtimeModel() {
        return this.runtimeModelInternal;
    }
    async suspendModel() {
        this.suspended = true;
    }
    async resumeModel() {
        this.suspended = false;
    }
    async eventListeners(remoteObject) {
        console.assert(remoteObject.runtimeModel() === this.runtimeModelInternal);
        if (!remoteObject.objectId) {
            return [];
        }
        const listeners = await this.agent.invoke_getEventListeners({ objectId: remoteObject.objectId });
        const eventListeners = [];
        for (const payload of listeners.listeners || []) {
            const location = this.runtimeModelInternal.debuggerModel().createRawLocationByScriptId(payload.scriptId, payload.lineNumber, payload.columnNumber);
            if (!location) {
                continue;
            }
            eventListeners.push(new EventListener(this, remoteObject, payload.type, payload.useCapture, payload.passive, payload.once, payload.handler ? this.runtimeModelInternal.createRemoteObject(payload.handler) : null, payload.originalHandler ? this.runtimeModelInternal.createRemoteObject(payload.originalHandler) : null, location, null));
        }
        return eventListeners;
    }
    retrieveDOMBreakpoints() {
        this.domModel.requestDocument();
    }
    domBreakpoints() {
        return this.domBreakpointsInternal.slice();
    }
    hasDOMBreakpoint(node, type) {
        return this.domBreakpointsInternal.some(breakpoint => (breakpoint.node === node && breakpoint.type === type));
    }
    setDOMBreakpoint(node, type) {
        for (const breakpoint of this.domBreakpointsInternal) {
            if (breakpoint.node === node && breakpoint.type === type) {
                this.toggleDOMBreakpoint(breakpoint, true);
                return breakpoint;
            }
        }
        const breakpoint = new DOMBreakpoint(this, node, type, true);
        this.domBreakpointsInternal.push(breakpoint);
        this.saveDOMBreakpoints();
        this.enableDOMBreakpoint(breakpoint);
        this.dispatchEventToListeners(Events.DOMBreakpointAdded, breakpoint);
        return breakpoint;
    }
    removeDOMBreakpoint(node, type) {
        this.removeDOMBreakpoints(breakpoint => breakpoint.node === node && breakpoint.type === type);
    }
    removeAllDOMBreakpoints() {
        this.removeDOMBreakpoints(_breakpoint => true);
    }
    toggleDOMBreakpoint(breakpoint, enabled) {
        if (enabled === breakpoint.enabled) {
            return;
        }
        breakpoint.enabled = enabled;
        if (enabled) {
            this.enableDOMBreakpoint(breakpoint);
        }
        else {
            this.disableDOMBreakpoint(breakpoint);
        }
        this.dispatchEventToListeners(Events.DOMBreakpointToggled, breakpoint);
    }
    enableDOMBreakpoint(breakpoint) {
        if (breakpoint.node.id) {
            this.agent.invoke_setDOMBreakpoint({ nodeId: breakpoint.node.id, type: breakpoint.type });
            breakpoint.node.setMarker(Marker, true);
        }
    }
    disableDOMBreakpoint(breakpoint) {
        if (breakpoint.node.id) {
            this.agent.invoke_removeDOMBreakpoint({ nodeId: breakpoint.node.id, type: breakpoint.type });
            breakpoint.node.setMarker(Marker, this.nodeHasBreakpoints(breakpoint.node) ? true : null);
        }
    }
    nodeHasBreakpoints(node) {
        for (const breakpoint of this.domBreakpointsInternal) {
            if (breakpoint.node === node && breakpoint.enabled) {
                return true;
            }
        }
        return false;
    }
    resolveDOMBreakpointData(auxData) {
        const type = auxData['type'];
        const node = this.domModel.nodeForId(auxData['nodeId']);
        if (!type || !node) {
            return null;
        }
        let targetNode = null;
        let insertion = false;
        if (type === "subtree-modified" /* SubtreeModified */) {
            insertion = auxData['insertion'] || false;
            targetNode = this.domModel.nodeForId(auxData['targetNodeId']);
        }
        return { type: type, node: node, targetNode: targetNode, insertion: insertion };
    }
    currentURL() {
        const domDocument = this.domModel.existingDocument();
        return domDocument ? domDocument.documentURL : '';
    }
    async documentUpdated() {
        if (this.suspended) {
            return;
        }
        const removed = this.domBreakpointsInternal;
        this.domBreakpointsInternal = [];
        this.dispatchEventToListeners(Events.DOMBreakpointsRemoved, removed);
        // this.currentURL() is empty when the page is reloaded because the
        // new document has not been requested yet and the old one has been
        // removed. Therefore, we need to request the document and wait for it.
        // Note that requestDocument() caches the document so that it is requested
        // only once.
        const document = await this.domModel.requestDocument();
        const currentURL = document ? document.documentURL : '';
        for (const breakpoint of this.domBreakpointsSetting.get()) {
            if (breakpoint.url === currentURL) {
                this.domModel.pushNodeByPathToFrontend(breakpoint.path).then(appendBreakpoint.bind(this, breakpoint));
            }
        }
        function appendBreakpoint(breakpoint, nodeId) {
            const node = nodeId ? this.domModel.nodeForId(nodeId) : null;
            if (!node) {
                return;
            }
            const domBreakpoint = new DOMBreakpoint(this, node, breakpoint.type, breakpoint.enabled);
            this.domBreakpointsInternal.push(domBreakpoint);
            if (breakpoint.enabled) {
                this.enableDOMBreakpoint(domBreakpoint);
            }
            this.dispatchEventToListeners(Events.DOMBreakpointAdded, domBreakpoint);
        }
    }
    removeDOMBreakpoints(filter) {
        const removed = [];
        const left = [];
        for (const breakpoint of this.domBreakpointsInternal) {
            if (filter(breakpoint)) {
                removed.push(breakpoint);
                if (breakpoint.enabled) {
                    breakpoint.enabled = false;
                    this.disableDOMBreakpoint(breakpoint);
                }
            }
            else {
                left.push(breakpoint);
            }
        }
        if (!removed.length) {
            return;
        }
        this.domBreakpointsInternal = left;
        this.saveDOMBreakpoints();
        this.dispatchEventToListeners(Events.DOMBreakpointsRemoved, removed);
    }
    nodeRemoved(event) {
        if (this.suspended) {
            return;
        }
        const { node } = event.data;
        const children = node.children() || [];
        this.removeDOMBreakpoints(breakpoint => breakpoint.node === node || children.indexOf(breakpoint.node) !== -1);
    }
    saveDOMBreakpoints() {
        const currentURL = this.currentURL();
        const breakpoints = this.domBreakpointsSetting.get().filter((breakpoint) => breakpoint.url !== currentURL);
        for (const breakpoint of this.domBreakpointsInternal) {
            breakpoints.push({ url: currentURL, path: breakpoint.node.path(), type: breakpoint.type, enabled: breakpoint.enabled });
        }
        this.domBreakpointsSetting.set(breakpoints);
    }
}
// TODO(crbug.com/1167717): Make this a const enum again
// eslint-disable-next-line rulesdir/const_enum
export var Events;
(function (Events) {
    Events["DOMBreakpointAdded"] = "DOMBreakpointAdded";
    Events["DOMBreakpointToggled"] = "DOMBreakpointToggled";
    Events["DOMBreakpointsRemoved"] = "DOMBreakpointsRemoved";
})(Events || (Events = {}));
const Marker = 'breakpoint-marker';
export class DOMBreakpoint {
    domDebuggerModel;
    node;
    type;
    enabled;
    constructor(domDebuggerModel, node, type, enabled) {
        this.domDebuggerModel = domDebuggerModel;
        this.node = node;
        this.type = type;
        this.enabled = enabled;
    }
}
export class EventListener {
    domDebuggerModelInternal;
    eventTarget;
    typeInternal;
    useCaptureInternal;
    passiveInternal;
    onceInternal;
    handlerInternal;
    originalHandlerInternal;
    locationInternal;
    sourceURLInternal;
    customRemoveFunction;
    originInternal;
    constructor(domDebuggerModel, eventTarget, type, useCapture, passive, once, handler, originalHandler, location, customRemoveFunction, origin) {
        this.domDebuggerModelInternal = domDebuggerModel;
        this.eventTarget = eventTarget;
        this.typeInternal = type;
        this.useCaptureInternal = useCapture;
        this.passiveInternal = passive;
        this.onceInternal = once;
        this.handlerInternal = handler;
        this.originalHandlerInternal = originalHandler || handler;
        this.locationInternal = location;
        const script = location.script();
        this.sourceURLInternal = script ? script.contentURL() : '';
        this.customRemoveFunction = customRemoveFunction;
        this.originInternal = origin || EventListener.Origin.Raw;
    }
    domDebuggerModel() {
        return this.domDebuggerModelInternal;
    }
    type() {
        return this.typeInternal;
    }
    useCapture() {
        return this.useCaptureInternal;
    }
    passive() {
        return this.passiveInternal;
    }
    once() {
        return this.onceInternal;
    }
    handler() {
        return this.handlerInternal;
    }
    location() {
        return this.locationInternal;
    }
    sourceURL() {
        return this.sourceURLInternal;
    }
    originalHandler() {
        return this.originalHandlerInternal;
    }
    canRemove() {
        return Boolean(this.customRemoveFunction) || this.originInternal !== EventListener.Origin.FrameworkUser;
    }
    remove() {
        if (!this.canRemove()) {
            return Promise.resolve(undefined);
        }
        if (this.originInternal !== EventListener.Origin.FrameworkUser) {
            function removeListener(type, listener, useCapture) {
                this.removeEventListener(type, listener, useCapture);
                // @ts-ignore:
                if (this['on' + type]) {
                    // @ts-ignore:
                    this['on' + type] = undefined;
                }
            }
            return this.eventTarget
                .callFunction(
            // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
            // @ts-expect-error
            removeListener, [
                RemoteObject.toCallArgument(this.typeInternal),
                RemoteObject.toCallArgument(this.originalHandlerInternal),
                RemoteObject.toCallArgument(this.useCaptureInternal),
            ])
                .then(() => undefined);
        }
        if (this.customRemoveFunction) {
            function callCustomRemove(type, listener, useCapture, passive) {
                this.call(null, type, listener, useCapture, passive);
            }
            return this.customRemoveFunction
                .callFunction(
            // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
            // @ts-expect-error
            callCustomRemove, [
                RemoteObject.toCallArgument(this.typeInternal),
                RemoteObject.toCallArgument(this.originalHandlerInternal),
                RemoteObject.toCallArgument(this.useCaptureInternal),
                RemoteObject.toCallArgument(this.passiveInternal),
            ])
                .then(() => undefined);
        }
        return Promise.resolve(undefined);
    }
    canTogglePassive() {
        return this.originInternal !== EventListener.Origin.FrameworkUser;
    }
    togglePassive() {
        return this.eventTarget
            .callFunction(
        // TODO(crbug.com/1172300) Ignored during the jsdoc to ts migration
        // @ts-expect-error
        callTogglePassive, [
            RemoteObject.toCallArgument(this.typeInternal),
            RemoteObject.toCallArgument(this.originalHandlerInternal),
            RemoteObject.toCallArgument(this.useCaptureInternal),
            RemoteObject.toCallArgument(this.passiveInternal),
        ])
            .then(() => undefined);
        function callTogglePassive(type, listener, useCapture, passive) {
            this.removeEventListener(type, listener, { capture: useCapture });
            this.addEventListener(type, listener, { capture: useCapture, passive: !passive });
        }
    }
    origin() {
        return this.originInternal;
    }
    markAsFramework() {
        this.originInternal = EventListener.Origin.Framework;
    }
    isScrollBlockingType() {
        return this.typeInternal === 'touchstart' || this.typeInternal === 'touchmove' ||
            this.typeInternal === 'mousewheel' || this.typeInternal === 'wheel';
    }
}
(function (EventListener) {
    // TODO(crbug.com/1167717): Make this a const enum again
    // eslint-disable-next-line rulesdir/const_enum
    let Origin;
    (function (Origin) {
        Origin["Raw"] = "Raw";
        Origin["Framework"] = "Framework";
        Origin["FrameworkUser"] = "FrameworkUser";
    })(Origin = EventListener.Origin || (EventListener.Origin = {}));
})(EventListener || (EventListener = {}));
export class CategorizedBreakpoint {
    categoryInternal;
    titleInternal;
    enabledInternal;
    constructor(category, title) {
        this.categoryInternal = category;
        this.titleInternal = title;
        this.enabledInternal = false;
    }
    category() {
        return this.categoryInternal;
    }
    enabled() {
        return this.enabledInternal;
    }
    setEnabled(enabled) {
        this.enabledInternal = enabled;
    }
    title() {
        return this.titleInternal;
    }
    setTitle(title) {
        this.titleInternal = title;
    }
}
export class CSPViolationBreakpoint extends CategorizedBreakpoint {
    typeInternal;
    constructor(category, title, type) {
        super(category, title);
        this.typeInternal = type;
    }
    type() {
        return this.typeInternal;
    }
}
export class EventListenerBreakpoint extends CategorizedBreakpoint {
    instrumentationName;
    eventName;
    eventTargetNames;
    constructor(instrumentationName, eventName, eventTargetNames, category, title) {
        super(category, title);
        this.instrumentationName = instrumentationName;
        this.eventName = eventName;
        this.eventTargetNames = eventTargetNames;
    }
    setEnabled(enabled) {
        if (this.enabled() === enabled) {
            return;
        }
        super.setEnabled(enabled);
        for (const model of TargetManager.instance().models(DOMDebuggerModel)) {
            this.updateOnModel(model);
        }
    }
    updateOnModel(model) {
        if (this.instrumentationName) {
            if (this.enabled()) {
                model.agent.invoke_setInstrumentationBreakpoint({ eventName: this.instrumentationName });
            }
            else {
                model.agent.invoke_removeInstrumentationBreakpoint({ eventName: this.instrumentationName });
            }
        }
        else {
            for (const eventTargetName of this.eventTargetNames) {
                if (this.enabled()) {
                    model.agent.invoke_setEventListenerBreakpoint({ eventName: this.eventName, targetName: eventTargetName });
                }
                else {
                    model.agent.invoke_removeEventListenerBreakpoint({ eventName: this.eventName, targetName: eventTargetName });
                }
            }
        }
    }
    static listener = 'listener:';
    static instrumentation = 'instrumentation:';
}
let domDebuggerManagerInstance;
export class DOMDebuggerManager {
    xhrBreakpointsSetting;
    xhrBreakpointsInternal;
    cspViolationsToBreakOn;
    eventListenerBreakpointsInternal;
    constructor() {
        this.xhrBreakpointsSetting = Common.Settings.Settings.instance().createLocalSetting('xhrBreakpoints', []);
        this.xhrBreakpointsInternal = new Map();
        for (const breakpoint of this.xhrBreakpointsSetting.get()) {
            this.xhrBreakpointsInternal.set(breakpoint.url, breakpoint.enabled);
        }
        this.cspViolationsToBreakOn = [];
        this.cspViolationsToBreakOn.push(new CSPViolationBreakpoint(i18nString(UIStrings.trustedTypeViolations), i18nString(UIStrings.sinkViolations), "trustedtype-sink-violation" /* TrustedtypeSinkViolation */));
        this.cspViolationsToBreakOn.push(new CSPViolationBreakpoint(i18nString(UIStrings.trustedTypeViolations), i18nString(UIStrings.policyViolations), "trustedtype-policy-violation" /* TrustedtypePolicyViolation */));
        this.eventListenerBreakpointsInternal = [];
        this.createInstrumentationBreakpoints(i18nString(UIStrings.animation), ['requestAnimationFrame', 'cancelAnimationFrame', 'requestAnimationFrame.callback']);
        this.createInstrumentationBreakpoints(i18nString(UIStrings.canvas), ['canvasContextCreated', 'webglErrorFired', 'webglWarningFired']);
        this.createInstrumentationBreakpoints(i18nString(UIStrings.geolocation), ['Geolocation.getCurrentPosition', 'Geolocation.watchPosition']);
        this.createInstrumentationBreakpoints(i18nString(UIStrings.notification), ['Notification.requestPermission']);
        this.createInstrumentationBreakpoints(i18nString(UIStrings.parse), ['Element.setInnerHTML', 'Document.write']);
        this.createInstrumentationBreakpoints(i18nString(UIStrings.script), ['scriptFirstStatement', 'scriptBlockedByCSP']);
        this.createInstrumentationBreakpoints(i18nString(UIStrings.timer), ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'setTimeout.callback', 'setInterval.callback']);
        this.createInstrumentationBreakpoints(i18nString(UIStrings.window), ['DOMWindow.close']);
        this.createInstrumentationBreakpoints(i18nString(UIStrings.webaudio), ['audioContextCreated', 'audioContextClosed', 'audioContextResumed', 'audioContextSuspended']);
        this.createEventListenerBreakpoints(i18nString(UIStrings.media), [
            'play', 'pause', 'playing', 'canplay', 'canplaythrough', 'seeking',
            'seeked', 'timeupdate', 'ended', 'ratechange', 'durationchange', 'volumechange',
            'loadstart', 'progress', 'suspend', 'abort', 'error', 'emptied',
            'stalled', 'loadedmetadata', 'loadeddata', 'waiting',
        ], ['audio', 'video']);
        this.createEventListenerBreakpoints(i18nString(UIStrings.pictureinpicture), ['enterpictureinpicture', 'leavepictureinpicture'], ['video']);
        this.createEventListenerBreakpoints(i18nString(UIStrings.pictureinpicture), ['resize'], ['PictureInPictureWindow']);
        this.createEventListenerBreakpoints(i18nString(UIStrings.clipboard), ['copy', 'cut', 'paste', 'beforecopy', 'beforecut', 'beforepaste'], ['*']);
        this.createEventListenerBreakpoints(i18nString(UIStrings.control), ['resize', 'scroll', 'zoom', 'focus', 'blur', 'select', 'change', 'submit', 'reset'], ['*']);
        this.createEventListenerBreakpoints(i18nString(UIStrings.device), ['deviceorientation', 'devicemotion'], ['*']);
        this.createEventListenerBreakpoints(i18nString(UIStrings.domMutation), [
            'DOMActivate',
            'DOMFocusIn',
            'DOMFocusOut',
            'DOMAttrModified',
            'DOMCharacterDataModified',
            'DOMNodeInserted',
            'DOMNodeInsertedIntoDocument',
            'DOMNodeRemoved',
            'DOMNodeRemovedFromDocument',
            'DOMSubtreeModified',
            'DOMContentLoaded',
        ], ['*']);
        this.createEventListenerBreakpoints(i18nString(UIStrings.dragDrop), ['drag', 'dragstart', 'dragend', 'dragenter', 'dragover', 'dragleave', 'drop'], ['*']);
        this.createEventListenerBreakpoints(i18nString(UIStrings.keyboard), ['keydown', 'keyup', 'keypress', 'input'], ['*']);
        this.createEventListenerBreakpoints(i18nString(UIStrings.load), ['load', 'beforeunload', 'unload', 'abort', 'error', 'hashchange', 'popstate'], ['*']);
        this.createEventListenerBreakpoints(i18nString(UIStrings.mouse), [
            'auxclick',
            'click',
            'dblclick',
            'mousedown',
            'mouseup',
            'mouseover',
            'mousemove',
            'mouseout',
            'mouseenter',
            'mouseleave',
            'mousewheel',
            'wheel',
            'contextmenu',
        ], ['*']);
        this.createEventListenerBreakpoints(i18nString(UIStrings.pointer), [
            'pointerover',
            'pointerout',
            'pointerenter',
            'pointerleave',
            'pointerdown',
            'pointerup',
            'pointermove',
            'pointercancel',
            'gotpointercapture',
            'lostpointercapture',
            'pointerrawupdate',
        ], ['*']);
        this.createEventListenerBreakpoints(i18nString(UIStrings.touch), ['touchstart', 'touchmove', 'touchend', 'touchcancel'], ['*']);
        this.createEventListenerBreakpoints(i18nString(UIStrings.worker), ['message', 'messageerror'], ['*']);
        this.createEventListenerBreakpoints(i18nString(UIStrings.xhr), ['readystatechange', 'load', 'loadstart', 'loadend', 'abort', 'error', 'progress', 'timeout'], ['xmlhttprequest', 'xmlhttprequestupload']);
        let breakpoint;
        breakpoint = this.resolveEventListenerBreakpointInternal('instrumentation:setTimeout.callback');
        if (breakpoint) {
            breakpoint.setTitle(i18nString(UIStrings.setTimeoutOrIntervalFired, { PH1: 'setTimeout' }));
        }
        breakpoint = this.resolveEventListenerBreakpointInternal('instrumentation:setInterval.callback');
        if (breakpoint) {
            breakpoint.setTitle(i18nString(UIStrings.setTimeoutOrIntervalFired, { PH1: 'setInterval' }));
        }
        breakpoint = this.resolveEventListenerBreakpointInternal('instrumentation:scriptFirstStatement');
        if (breakpoint) {
            breakpoint.setTitle(i18nString(UIStrings.scriptFirstStatement));
        }
        breakpoint = this.resolveEventListenerBreakpointInternal('instrumentation:scriptBlockedByCSP');
        if (breakpoint) {
            breakpoint.setTitle(i18nString(UIStrings.scriptBlockedByContentSecurity));
        }
        breakpoint = this.resolveEventListenerBreakpointInternal('instrumentation:requestAnimationFrame');
        if (breakpoint) {
            breakpoint.setTitle(i18nString(UIStrings.requestAnimationFrame));
        }
        breakpoint = this.resolveEventListenerBreakpointInternal('instrumentation:cancelAnimationFrame');
        if (breakpoint) {
            breakpoint.setTitle(i18nString(UIStrings.cancelAnimationFrame));
        }
        breakpoint = this.resolveEventListenerBreakpointInternal('instrumentation:requestAnimationFrame.callback');
        if (breakpoint) {
            breakpoint.setTitle(i18nString(UIStrings.animationFrameFired));
        }
        breakpoint = this.resolveEventListenerBreakpointInternal('instrumentation:webglErrorFired');
        if (breakpoint) {
            breakpoint.setTitle(i18nString(UIStrings.webglErrorFired));
        }
        breakpoint = this.resolveEventListenerBreakpointInternal('instrumentation:webglWarningFired');
        if (breakpoint) {
            breakpoint.setTitle(i18nString(UIStrings.webglWarningFired));
        }
        breakpoint = this.resolveEventListenerBreakpointInternal('instrumentation:Element.setInnerHTML');
        if (breakpoint) {
            breakpoint.setTitle(i18nString(UIStrings.setInnerhtml));
        }
        breakpoint = this.resolveEventListenerBreakpointInternal('instrumentation:canvasContextCreated');
        if (breakpoint) {
            breakpoint.setTitle(i18nString(UIStrings.createCanvasContext));
        }
        breakpoint = this.resolveEventListenerBreakpointInternal('instrumentation:Geolocation.getCurrentPosition');
        if (breakpoint) {
            breakpoint.setTitle('getCurrentPosition');
        }
        breakpoint = this.resolveEventListenerBreakpointInternal('instrumentation:Geolocation.watchPosition');
        if (breakpoint) {
            breakpoint.setTitle('watchPosition');
        }
        breakpoint = this.resolveEventListenerBreakpointInternal('instrumentation:Notification.requestPermission');
        if (breakpoint) {
            breakpoint.setTitle('requestPermission');
        }
        breakpoint = this.resolveEventListenerBreakpointInternal('instrumentation:DOMWindow.close');
        if (breakpoint) {
            breakpoint.setTitle('window.close');
        }
        breakpoint = this.resolveEventListenerBreakpointInternal('instrumentation:Document.write');
        if (breakpoint) {
            breakpoint.setTitle('document.write');
        }
        breakpoint = this.resolveEventListenerBreakpointInternal('instrumentation:audioContextCreated');
        if (breakpoint) {
            breakpoint.setTitle(i18nString(UIStrings.createAudiocontext));
        }
        breakpoint = this.resolveEventListenerBreakpointInternal('instrumentation:audioContextClosed');
        if (breakpoint) {
            breakpoint.setTitle(i18nString(UIStrings.closeAudiocontext));
        }
        breakpoint = this.resolveEventListenerBreakpointInternal('instrumentation:audioContextResumed');
        if (breakpoint) {
            breakpoint.setTitle(i18nString(UIStrings.resumeAudiocontext));
        }
        breakpoint = this.resolveEventListenerBreakpointInternal('instrumentation:audioContextSuspended');
        if (breakpoint) {
            breakpoint.setTitle(i18nString(UIStrings.suspendAudiocontext));
        }
        TargetManager.instance().observeModels(DOMDebuggerModel, this);
    }
    static instance(opts = { forceNew: null }) {
        const { forceNew } = opts;
        if (!domDebuggerManagerInstance || forceNew) {
            domDebuggerManagerInstance = new DOMDebuggerManager();
        }
        return domDebuggerManagerInstance;
    }
    cspViolationBreakpoints() {
        return this.cspViolationsToBreakOn.slice();
    }
    createInstrumentationBreakpoints(category, instrumentationNames) {
        for (const instrumentationName of instrumentationNames) {
            this.eventListenerBreakpointsInternal.push(new EventListenerBreakpoint(instrumentationName, '', [], category, instrumentationName));
        }
    }
    createEventListenerBreakpoints(category, eventNames, eventTargetNames) {
        for (const eventName of eventNames) {
            this.eventListenerBreakpointsInternal.push(new EventListenerBreakpoint('', eventName, eventTargetNames, category, eventName));
        }
    }
    resolveEventListenerBreakpointInternal(eventName, eventTargetName) {
        const instrumentationPrefix = 'instrumentation:';
        const listenerPrefix = 'listener:';
        let instrumentationName = '';
        if (eventName.startsWith(instrumentationPrefix)) {
            instrumentationName = eventName.substring(instrumentationPrefix.length);
            eventName = '';
        }
        else if (eventName.startsWith(listenerPrefix)) {
            eventName = eventName.substring(listenerPrefix.length);
        }
        else {
            return null;
        }
        eventTargetName = (eventTargetName || '*').toLowerCase();
        let result = null;
        for (const breakpoint of this.eventListenerBreakpointsInternal) {
            if (instrumentationName && breakpoint.instrumentationName === instrumentationName) {
                result = breakpoint;
            }
            if (eventName && breakpoint.eventName === eventName &&
                breakpoint.eventTargetNames.indexOf(eventTargetName) !== -1) {
                result = breakpoint;
            }
            if (!result && eventName && breakpoint.eventName === eventName &&
                breakpoint.eventTargetNames.indexOf('*') !== -1) {
                result = breakpoint;
            }
        }
        return result;
    }
    eventListenerBreakpoints() {
        return this.eventListenerBreakpointsInternal.slice();
    }
    resolveEventListenerBreakpointTitle(auxData) {
        const id = auxData['eventName'];
        if (id === 'instrumentation:webglErrorFired' && auxData['webglErrorName']) {
            let errorName = auxData['webglErrorName'];
            // If there is a hex code of the error, display only this.
            errorName = errorName.replace(/^.*(0x[0-9a-f]+).*$/i, '$1');
            return i18nString(UIStrings.webglErrorFiredS, { PH1: errorName });
        }
        if (id === 'instrumentation:scriptBlockedByCSP' && auxData['directiveText']) {
            return i18nString(UIStrings.scriptBlockedDueToContent, { PH1: auxData['directiveText'] });
        }
        const breakpoint = this.resolveEventListenerBreakpointInternal(id, auxData['targetName']);
        if (!breakpoint) {
            return '';
        }
        if (auxData['targetName']) {
            return auxData['targetName'] + '.' + breakpoint.title();
        }
        return breakpoint.title();
    }
    resolveEventListenerBreakpoint(auxData) {
        return this.resolveEventListenerBreakpointInternal(auxData['eventName'], auxData['targetName']);
    }
    updateCSPViolationBreakpoints() {
        const violationTypes = this.cspViolationsToBreakOn.filter(v => v.enabled()).map(v => v.type());
        for (const model of TargetManager.instance().models(DOMDebuggerModel)) {
            this.updateCSPViolationBreakpointsForModel(model, violationTypes);
        }
    }
    updateCSPViolationBreakpointsForModel(model, violationTypes) {
        model.agent.invoke_setBreakOnCSPViolation({ violationTypes: violationTypes });
    }
    xhrBreakpoints() {
        return this.xhrBreakpointsInternal;
    }
    saveXHRBreakpoints() {
        const breakpoints = [];
        for (const url of this.xhrBreakpointsInternal.keys()) {
            breakpoints.push({ url: url, enabled: this.xhrBreakpointsInternal.get(url) || false });
        }
        this.xhrBreakpointsSetting.set(breakpoints);
    }
    addXHRBreakpoint(url, enabled) {
        this.xhrBreakpointsInternal.set(url, enabled);
        if (enabled) {
            for (const model of TargetManager.instance().models(DOMDebuggerModel)) {
                model.agent.invoke_setXHRBreakpoint({ url });
            }
        }
        this.saveXHRBreakpoints();
    }
    removeXHRBreakpoint(url) {
        const enabled = this.xhrBreakpointsInternal.get(url);
        this.xhrBreakpointsInternal.delete(url);
        if (enabled) {
            for (const model of TargetManager.instance().models(DOMDebuggerModel)) {
                model.agent.invoke_removeXHRBreakpoint({ url });
            }
        }
        this.saveXHRBreakpoints();
    }
    toggleXHRBreakpoint(url, enabled) {
        this.xhrBreakpointsInternal.set(url, enabled);
        for (const model of TargetManager.instance().models(DOMDebuggerModel)) {
            if (enabled) {
                model.agent.invoke_setXHRBreakpoint({ url });
            }
            else {
                model.agent.invoke_removeXHRBreakpoint({ url });
            }
        }
        this.saveXHRBreakpoints();
    }
    modelAdded(domDebuggerModel) {
        for (const url of this.xhrBreakpointsInternal.keys()) {
            if (this.xhrBreakpointsInternal.get(url)) {
                domDebuggerModel.agent.invoke_setXHRBreakpoint({ url: url });
            }
        }
        for (const breakpoint of this.eventListenerBreakpointsInternal) {
            if (breakpoint.enabled()) {
                breakpoint.updateOnModel(domDebuggerModel);
            }
        }
        const violationTypes = this.cspViolationsToBreakOn.filter(v => v.enabled()).map(v => v.type());
        this.updateCSPViolationBreakpointsForModel(domDebuggerModel, violationTypes);
    }
    modelRemoved(_domDebuggerModel) {
    }
}
SDKModel.register(DOMDebuggerModel, { capabilities: Capability.DOM, autostart: false });
//# sourceMappingURL=DOMDebuggerModel.js.map