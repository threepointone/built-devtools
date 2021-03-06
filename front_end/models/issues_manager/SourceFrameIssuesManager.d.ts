import * as SDK from '../../core/sdk/sdk.js';
import * as Bindings from '../../models/bindings/bindings.js';
import * as Workspace from '../../models/workspace/workspace.js';
import type { IssueKind } from './Issue.js';
import type { IssuesManager } from './IssuesManager.js';
export declare class SourceFrameIssuesManager {
    private readonly issuesManager;
    private locationPool;
    private issueMessages;
    constructor(issuesManager: IssuesManager);
    private onIssueAdded;
    private addIssue;
    private onFullUpdateRequired;
    private addIssueMessageToScript;
    private isTrustedTypeIssue;
    private resetMessages;
}
export declare class IssueMessage extends Workspace.UISourceCode.Message {
    private uiSourceCode?;
    private kind;
    constructor(title: string, kind: IssueKind, rawLocation: SDK.DebuggerModel.Location, locationPool: Bindings.LiveLocation.LiveLocationPool, clickHandler: () => void);
    private updateLocation;
    getIssueKind(): IssueKind;
    dispose(): void;
}
