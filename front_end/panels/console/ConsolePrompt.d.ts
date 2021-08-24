import * as UI from '../../ui/legacy/legacy.js';
export declare class ConsolePrompt extends UI.Widget.Widget {
    private addCompletionsFromHistory;
    private historyInternal;
    private initialText;
    private editor;
    private readonly eagerPreviewElement;
    private textChangeThrottler;
    private readonly formatter;
    private requestPreviewBound;
    private readonly innerPreviewElement;
    private readonly promptIcon;
    private readonly iconThrottler;
    private readonly eagerEvalSetting;
    private previewRequestForTest;
    private defaultAutocompleteConfig;
    private highlightingNode;
    constructor();
    private eagerSettingChanged;
    belowEditorElement(): Element;
    private onTextChanged;
    private requestPreview;
    wasShown(): void;
    willHide(): void;
    history(): ConsoleHistoryManager;
    clearAutocomplete(): void;
    private isCaretAtEndOfPrompt;
    moveCaretToEndOfPrompt(): void;
    setText(text: string): void;
    text(): string;
    setAddCompletionsFromHistory(value: boolean): void;
    private editorKeyDown;
    private enterWillEvaluate;
    private updatePromptIcon;
    private enterKeyPressed;
    private appendCommand;
    private enterProcessedForTest;
    private historyCompletions;
    focus(): void;
    private wordsWithQuery;
    private editorSetForTest;
}
export declare class ConsoleHistoryManager {
    private data;
    private historyOffset;
    private uncommittedIsTop?;
    constructor();
    historyData(): string[];
    setHistoryData(data: string[]): void;
    /**
     * Pushes a committed text into the history.
     */
    pushHistoryItem(text: string): void;
    /**
     * Pushes the current (uncommitted) text into the history.
     */
    private pushCurrentText;
    previous(currentText: string): string | undefined;
    next(): string | undefined;
    private currentHistoryItem;
}
export declare const enum Events {
    TextChanged = "TextChanged"
}
