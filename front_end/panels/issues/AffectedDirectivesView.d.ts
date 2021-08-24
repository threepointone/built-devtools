import type * as Platform from '../../core/platform/platform.js';
import { AffectedResourcesView } from './AffectedResourcesView.js';
import type { AggregatedIssue } from './IssueAggregator.js';
import type { IssueView } from './IssueView.js';
export declare class AffectedDirectivesView extends AffectedResourcesView {
    private readonly issue;
    constructor(parent: IssueView, issue: AggregatedIssue);
    private appendStatus;
    protected getResourceNameWithCount(count: number): Platform.UIString.LocalizedString;
    private appendViolatedDirective;
    private appendBlockedURL;
    private appendBlockedElement;
    private appendAffectedContentSecurityPolicyDetails;
    private appendAffectedContentSecurityPolicyDetail;
    update(): void;
}
