import type * as ProtocolProxyApi from '../../generated/protocol-proxy-api.js';
import * as Protocol from '../../generated/protocol.js';
import type { Location } from './DebuggerModel.js';
import type { DOMNode } from './DOMModel.js';
import { RemoteObject } from './RemoteObject.js';
import { RuntimeModel } from './RuntimeModel.js';
import type { Target } from './Target.js';
import { SDKModel } from './SDKModel.js';
import type { SDKModelObserver } from './TargetManager.js';
export declare class DOMDebuggerModel extends SDKModel<EventTypes> {
    readonly agent: ProtocolProxyApi.DOMDebuggerApi;
    private readonly runtimeModelInternal;
    private domModel;
    private domBreakpointsInternal;
    private readonly domBreakpointsSetting;
    suspended: boolean;
    constructor(target: Target);
    runtimeModel(): RuntimeModel;
    suspendModel(): Promise<void>;
    resumeModel(): Promise<void>;
    eventListeners(remoteObject: RemoteObject): Promise<EventListener[]>;
    retrieveDOMBreakpoints(): void;
    domBreakpoints(): DOMBreakpoint[];
    hasDOMBreakpoint(node: DOMNode, type: Protocol.DOMDebugger.DOMBreakpointType): boolean;
    setDOMBreakpoint(node: DOMNode, type: Protocol.DOMDebugger.DOMBreakpointType): DOMBreakpoint;
    removeDOMBreakpoint(node: DOMNode, type: Protocol.DOMDebugger.DOMBreakpointType): void;
    removeAllDOMBreakpoints(): void;
    toggleDOMBreakpoint(breakpoint: DOMBreakpoint, enabled: boolean): void;
    private enableDOMBreakpoint;
    private disableDOMBreakpoint;
    private nodeHasBreakpoints;
    resolveDOMBreakpointData(auxData: {
        type: Protocol.DOMDebugger.DOMBreakpointType;
        nodeId: Protocol.DOM.NodeId;
        targetNodeId: Protocol.DOM.NodeId;
        insertion: boolean;
    }): {
        type: Protocol.DOMDebugger.DOMBreakpointType;
        node: DOMNode;
        targetNode: DOMNode | null;
        insertion: boolean;
    } | null;
    private currentURL;
    private documentUpdated;
    private removeDOMBreakpoints;
    private nodeRemoved;
    private saveDOMBreakpoints;
}
export declare enum Events {
    DOMBreakpointAdded = "DOMBreakpointAdded",
    DOMBreakpointToggled = "DOMBreakpointToggled",
    DOMBreakpointsRemoved = "DOMBreakpointsRemoved"
}
export declare type EventTypes = {
    [Events.DOMBreakpointAdded]: DOMBreakpoint;
    [Events.DOMBreakpointToggled]: DOMBreakpoint;
    [Events.DOMBreakpointsRemoved]: DOMBreakpoint[];
};
export declare class DOMBreakpoint {
    domDebuggerModel: DOMDebuggerModel;
    node: DOMNode;
    type: Protocol.DOMDebugger.DOMBreakpointType;
    enabled: boolean;
    constructor(domDebuggerModel: DOMDebuggerModel, node: DOMNode, type: Protocol.DOMDebugger.DOMBreakpointType, enabled: boolean);
}
export declare class EventListener {
    private readonly domDebuggerModelInternal;
    private readonly eventTarget;
    private readonly typeInternal;
    private readonly useCaptureInternal;
    private readonly passiveInternal;
    private readonly onceInternal;
    private readonly handlerInternal;
    private readonly originalHandlerInternal;
    private readonly locationInternal;
    private readonly sourceURLInternal;
    private readonly customRemoveFunction;
    private originInternal;
    constructor(domDebuggerModel: DOMDebuggerModel, eventTarget: RemoteObject, type: string, useCapture: boolean, passive: boolean, once: boolean, handler: RemoteObject | null, originalHandler: RemoteObject | null, location: Location, customRemoveFunction: RemoteObject | null, origin?: string);
    domDebuggerModel(): DOMDebuggerModel;
    type(): string;
    useCapture(): boolean;
    passive(): boolean;
    once(): boolean;
    handler(): RemoteObject | null;
    location(): Location;
    sourceURL(): string;
    originalHandler(): RemoteObject | null;
    canRemove(): boolean;
    remove(): Promise<void>;
    canTogglePassive(): boolean;
    togglePassive(): Promise<undefined>;
    origin(): string;
    markAsFramework(): void;
    isScrollBlockingType(): boolean;
}
export declare namespace EventListener {
    enum Origin {
        Raw = "Raw",
        Framework = "Framework",
        FrameworkUser = "FrameworkUser"
    }
}
export declare class CategorizedBreakpoint {
    private readonly categoryInternal;
    titleInternal: string;
    enabledInternal: boolean;
    constructor(category: string, title: string);
    category(): string;
    enabled(): boolean;
    setEnabled(enabled: boolean): void;
    title(): string;
    setTitle(title: string): void;
}
export declare class CSPViolationBreakpoint extends CategorizedBreakpoint {
    private readonly typeInternal;
    constructor(category: string, title: string, type: Protocol.DOMDebugger.CSPViolationType);
    type(): Protocol.DOMDebugger.CSPViolationType;
}
export declare class EventListenerBreakpoint extends CategorizedBreakpoint {
    readonly instrumentationName: string;
    readonly eventName: string;
    readonly eventTargetNames: string[];
    constructor(instrumentationName: string, eventName: string, eventTargetNames: string[], category: string, title: string);
    setEnabled(enabled: boolean): void;
    updateOnModel(model: DOMDebuggerModel): void;
    static readonly listener = "listener:";
    static readonly instrumentation = "instrumentation:";
}
export declare class DOMDebuggerManager implements SDKModelObserver<DOMDebuggerModel> {
    private readonly xhrBreakpointsSetting;
    private readonly xhrBreakpointsInternal;
    private readonly cspViolationsToBreakOn;
    private readonly eventListenerBreakpointsInternal;
    constructor();
    static instance(opts?: {
        forceNew: boolean | null;
    }): DOMDebuggerManager;
    cspViolationBreakpoints(): CSPViolationBreakpoint[];
    private createInstrumentationBreakpoints;
    private createEventListenerBreakpoints;
    private resolveEventListenerBreakpointInternal;
    eventListenerBreakpoints(): EventListenerBreakpoint[];
    resolveEventListenerBreakpointTitle(auxData: {
        eventName: string;
        webglErrorName: string;
        directiveText: string;
        targetName: string;
    }): string;
    resolveEventListenerBreakpoint(auxData: {
        eventName: string;
        targetName: string;
    }): EventListenerBreakpoint | null;
    updateCSPViolationBreakpoints(): void;
    private updateCSPViolationBreakpointsForModel;
    xhrBreakpoints(): Map<string, boolean>;
    private saveXHRBreakpoints;
    addXHRBreakpoint(url: string, enabled: boolean): void;
    removeXHRBreakpoint(url: string): void;
    toggleXHRBreakpoint(url: string, enabled: boolean): void;
    modelAdded(domDebuggerModel: DOMDebuggerModel): void;
    modelRemoved(_domDebuggerModel: DOMDebuggerModel): void;
}
