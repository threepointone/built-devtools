import * as Common from '../../core/common/common.js';
import * as SDK from '../../core/sdk/sdk.js';
import type * as TextUtils from '../text_utils/text_utils.js';
import * as Workspace from '../workspace/workspace.js';
import { ContentProviderBasedProject } from './ContentProviderBasedProject.js';
import type { SourceMapping } from './CSSWorkspaceBinding.js';
export declare class StylesSourceMapping implements SourceMapping {
    private cssModel;
    private project;
    private readonly styleFiles;
    private readonly eventListeners;
    constructor(cssModel: SDK.CSSModel.CSSModel, workspace: Workspace.Workspace.WorkspaceImpl);
    rawLocationToUILocation(rawLocation: SDK.CSSModel.CSSLocation): Workspace.UISourceCode.UILocation | null;
    uiLocationToRawLocations(uiLocation: Workspace.UISourceCode.UILocation): SDK.CSSModel.CSSLocation[];
    private acceptsHeader;
    private styleSheetAdded;
    private styleSheetRemoved;
    private styleSheetChanged;
    dispose(): void;
}
export declare class StyleFile implements TextUtils.ContentProvider.ContentProvider {
    private readonly cssModel;
    private readonly project;
    headers: Set<SDK.CSSStyleSheetHeader.CSSStyleSheetHeader>;
    uiSourceCode: Workspace.UISourceCode.UISourceCode;
    private readonly eventListeners;
    private readonly throttler;
    private terminated;
    private isAddingRevision?;
    private isUpdatingHeaders?;
    constructor(cssModel: SDK.CSSModel.CSSModel, project: ContentProviderBasedProject, header: SDK.CSSStyleSheetHeader.CSSStyleSheetHeader);
    addHeader(header: SDK.CSSStyleSheetHeader.CSSStyleSheetHeader): void;
    removeHeader(header: SDK.CSSStyleSheetHeader.CSSStyleSheetHeader): void;
    styleSheetChanged(header: SDK.CSSStyleSheetHeader.CSSStyleSheetHeader): void;
    private workingCopyCommitted;
    private workingCopyChanged;
    private mirrorContent;
    private styleFileSyncedForTest;
    dispose(): void;
    contentURL(): string;
    contentType(): Common.ResourceType.ResourceType;
    contentEncoded(): Promise<boolean>;
    requestContent(): Promise<TextUtils.ContentProvider.DeferredContent>;
    searchInContent(query: string, caseSensitive: boolean, isRegex: boolean): Promise<TextUtils.ContentProvider.SearchMatch[]>;
    static readonly updateTimeout = 200;
    getHeaders(): Set<SDK.CSSStyleSheetHeader.CSSStyleSheetHeader>;
    getUiSourceCode(): Workspace.UISourceCode.UISourceCode;
}
