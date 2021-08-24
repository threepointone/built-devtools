import * as TextUtils from '../../models/text_utils/text_utils.js';
import * as Workspace from '../../models/workspace/workspace.js';
import * as SourceFrame from '../../ui/legacy/components/source_frame/source_frame.js';
import * as UI from '../../ui/legacy/legacy.js';
export declare class UISourceCodeFrame extends SourceFrame.SourceFrame.SourceFrameImpl {
    private uiSourceCodeInternal;
    private readonly diff;
    private muteSourceCodeEvents;
    private isSettingContent;
    private persistenceBinding;
    private readonly rowMessageBuckets;
    private readonly typeDecorationsPending;
    private uiSourceCodeEventListeners;
    private messageAndDecorationListeners;
    private readonly boundOnBindingChanged;
    private readonly errorPopoverHelper;
    private plugins;
    constructor(uiSourceCode: Workspace.UISourceCode.UISourceCode);
    private installMessageAndDecorationListeners;
    uiSourceCode(): Workspace.UISourceCode.UISourceCode;
    setUISourceCode(uiSourceCode: Workspace.UISourceCode.UISourceCode): void;
    private unloadUISourceCode;
    private initializeUISourceCode;
    wasShown(): void;
    willHide(): void;
    private refreshHighlighterType;
    canEditSourceInternal(): boolean;
    private onNetworkPersistenceChanged;
    commitEditing(): void;
    setContent(content: string | null, loadError: string | null): void;
    private allMessages;
    onTextChanged(oldRange: TextUtils.TextRange.TextRange, newRange: TextUtils.TextRange.TextRange): void;
    onWorkingCopyChanged(): void;
    private onWorkingCopyCommitted;
    private ensurePluginsLoaded;
    private disposePlugins;
    private onBindingChanged;
    private updateStyle;
    private innerSetContent;
    populateTextAreaContextMenu(contextMenu: UI.ContextMenu.ContextMenu, editorLineNumber: number, editorColumnNumber: number): Promise<void>;
    dispose(): void;
    private onMessageAdded;
    private getClampedEditorLineNumberForMessage;
    private addMessageToSource;
    private onMessageRemoved;
    private removeMessageFromSource;
    private getErrorPopoverContent;
    private updateBucketDecorations;
    private onLineDecorationAdded;
    private onLineDecorationRemoved;
    private decorateTypeThrottled;
    private decorateAllTypes;
    toolbarItems(): Promise<UI.Toolbar.ToolbarItem[]>;
    populateLineGutterContextMenu(contextMenu: UI.ContextMenu.ContextMenu, lineNumber: number): Promise<void>;
}
export declare class RowMessage {
    private message;
    private repeatCount;
    element: HTMLDivElement;
    private icon;
    private repeatCountElement;
    constructor(message: Workspace.UISourceCode.Message);
    getMessage(): Workspace.UISourceCode.Message;
    callClickHandler(): void;
    getRepeatCount(): number;
    setRepeatCount(repeatCount: number): void;
    private updateMessageRepeatCount;
}
export declare class RowMessageBucket {
    private sourceFrame;
    private textEditor;
    private readonly lineHandle;
    private readonly decoration;
    private readonly wave;
    private errorIcon;
    private issueIcon;
    private decorationStartColumn;
    private readonly messagesDescriptionElement;
    private messages;
    private level;
    private bookmark?;
    private iconsElement;
    constructor(sourceFrame: UISourceCodeFrame, textEditor: SourceFrame.SourcesTextEditor.SourcesTextEditor, editorLineNumber: number);
    private updateWavePosition;
    private messageDescription;
    detachFromEditor(): void;
    uniqueMessagesCount(): number;
    private issueClickHandler;
    addMessage(message: Workspace.UISourceCode.Message): void;
    removeMessage(message: Workspace.UISourceCode.Message): void;
    updateDecoration(): void;
    private getPopoverMessages;
    static getPopover(eventTarget: HTMLElement, mouseEvent: MouseEvent): UI.PopoverHelper.PopoverRequest | null;
}
export declare enum Events {
    ToolbarItemsChanged = "ToolbarItemsChanged"
}
