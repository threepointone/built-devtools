// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Common from '../../core/common/common.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Diff from '../../third_party/diff/diff.js';
import * as UI from '../../ui/legacy/legacy.js';
import changesViewStyles from './changesView.css.js';
import * as WorkspaceDiff from '../../models/workspace_diff/workspace_diff.js';
import { ChangesSidebar } from './ChangesSidebar.js';
import { ChangesTextEditor } from './ChangesTextEditor.js';
const UIStrings = {
    /**
    *@description Screen-reader accessible name for the code editor in the Changes tool showing the user's changes.
    */
    changesDiffViewer: 'Changes diff viewer',
    /**
    *@description Screen reader/tooltip label for a button in the Changes tool that reverts all changes to the currently open file.
    */
    revertAllChangesToCurrentFile: 'Revert all changes to current file',
    /**
    *@description Text in Changes View of the Changes tab
    */
    noChanges: 'No changes',
    /**
    *@description Text in Changes View of the Changes tab
    */
    binaryData: 'Binary data',
    /**
    * @description Text in the Changes tab that indicates how many lines of code have changed in the
    * selected file. An insertion refers to an added line of code. The (+) is a visual cue to indicate
    * lines were added (not translatable).
    */
    sInsertions: '{n, plural, =1 {# insertion (+)} other {# insertions (+)}}',
    /**
    * @description Text in the Changes tab that indicates how many lines of code have changed in the
    * selected file. A deletion refers to a removed line of code. The (-) is a visual cue to indicate
    * lines were removed (not translatable).
    */
    sDeletions: '{n, plural, =1 {# deletion (-)} other {# deletions (-)}}',
    /**
    *@description Text in Changes View of the Changes tab
    *@example {2} PH1
    */
    SkippingDMatchingLines: '( … Skipping {PH1} matching lines … )',
};
const str_ = i18n.i18n.registerUIStrings('panels/changes/ChangesView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
let changesViewInstance;
export class ChangesView extends UI.Widget.VBox {
    emptyWidget;
    workspaceDiff;
    changesSidebar;
    selectedUISourceCode;
    diffRows;
    maxLineDigits;
    editor;
    toolbar;
    diffStats;
    constructor() {
        super(true);
        const splitWidget = new UI.SplitWidget.SplitWidget(true /* vertical */, false /* sidebar on left */);
        const mainWidget = new UI.Widget.Widget();
        splitWidget.setMainWidget(mainWidget);
        splitWidget.show(this.contentElement);
        this.emptyWidget = new UI.EmptyWidget.EmptyWidget('');
        this.emptyWidget.show(mainWidget.element);
        this.workspaceDiff = WorkspaceDiff.WorkspaceDiff.workspaceDiff();
        this.changesSidebar = new ChangesSidebar(this.workspaceDiff);
        this.changesSidebar.addEventListener("SelectedUISourceCodeChanged" /* SelectedUISourceCodeChanged */, this.selectedUISourceCodeChanged, this);
        splitWidget.setSidebarWidget(this.changesSidebar);
        this.selectedUISourceCode = null;
        this.diffRows = [];
        this.maxLineDigits = 1;
        this.editor = new ChangesTextEditor({
            bracketMatchingSetting: undefined,
            devtoolsAccessibleName: i18nString(UIStrings.changesDiffViewer),
            lineNumbers: true,
            lineWrapping: false,
            mimeType: undefined,
            autoHeight: undefined,
            padBottom: undefined,
            maxHighlightLength: Infinity,
            placeholder: undefined,
            lineWiseCopyCut: undefined,
            inputStyle: undefined,
        });
        this.editor.setReadOnly(true);
        const editorContainer = mainWidget.element.createChild('div', 'editor-container');
        UI.ARIAUtils.markAsTabpanel(editorContainer);
        this.editor.show(editorContainer);
        this.editor.hideWidget();
        self.onInvokeElement(this.editor.element, this.click.bind(this));
        this.toolbar = new UI.Toolbar.Toolbar('changes-toolbar', mainWidget.element);
        const revertButton = new UI.Toolbar.ToolbarButton(i18nString(UIStrings.revertAllChangesToCurrentFile), 'largeicon-undo');
        revertButton.addEventListener(UI.Toolbar.ToolbarButton.Events.Click, this.revert.bind(this));
        this.toolbar.appendToolbarItem(revertButton);
        this.diffStats = new UI.Toolbar.ToolbarText('');
        this.toolbar.appendToolbarItem(this.diffStats);
        this.toolbar.setEnabled(false);
        this.hideDiff(i18nString(UIStrings.noChanges));
        this.selectedUISourceCodeChanged();
    }
    static instance(opts = { forceNew: null }) {
        const { forceNew } = opts;
        if (!changesViewInstance || forceNew) {
            changesViewInstance = new ChangesView();
        }
        return changesViewInstance;
    }
    selectedUISourceCodeChanged() {
        this.revealUISourceCode(this.changesSidebar.selectedUISourceCode());
    }
    revert() {
        const uiSourceCode = this.selectedUISourceCode;
        if (!uiSourceCode) {
            return;
        }
        this.workspaceDiff.revertToOriginal(uiSourceCode);
    }
    click(event) {
        const selection = this.editor.selection();
        if (!selection.isEmpty() || !this.selectedUISourceCode) {
            return;
        }
        const row = this.diffRows[selection.startLine];
        Common.Revealer.reveal(this.selectedUISourceCode.uiLocation(row.currentLineNumber - 1, selection.startColumn), false);
        event.consume(true);
    }
    revealUISourceCode(uiSourceCode) {
        if (this.selectedUISourceCode === uiSourceCode) {
            return;
        }
        if (this.selectedUISourceCode) {
            this.workspaceDiff.unsubscribeFromDiffChange(this.selectedUISourceCode, this.refreshDiff, this);
        }
        if (uiSourceCode && this.isShowing()) {
            this.workspaceDiff.subscribeToDiffChange(uiSourceCode, this.refreshDiff, this);
        }
        this.selectedUISourceCode = uiSourceCode;
        this.refreshDiff();
    }
    wasShown() {
        this.refreshDiff();
        this.registerCSSFiles([changesViewStyles]);
    }
    refreshDiff() {
        if (!this.isShowing()) {
            return;
        }
        if (!this.selectedUISourceCode) {
            this.renderDiffRows(null);
            return;
        }
        const uiSourceCode = this.selectedUISourceCode;
        if (!uiSourceCode.contentType().isTextType()) {
            this.hideDiff(i18nString(UIStrings.binaryData));
            return;
        }
        this.workspaceDiff.requestDiff(uiSourceCode).then((diff) => {
            if (this.selectedUISourceCode !== uiSourceCode) {
                return;
            }
            this.renderDiffRows(diff);
        });
    }
    hideDiff(message) {
        this.diffStats.setText('');
        this.toolbar.setEnabled(false);
        this.editor.hideWidget();
        this.emptyWidget.text = message;
        this.emptyWidget.showWidget();
    }
    renderDiffRows(diff) {
        this.diffRows = [];
        if (!diff || (diff.length === 1 && diff[0][0] === Diff.Diff.Operation.Equal)) {
            this.hideDiff(i18nString(UIStrings.noChanges));
            return;
        }
        let insertions = 0;
        let deletions = 0;
        let currentLineNumber = 0;
        let baselineLineNumber = 0;
        const paddingLines = 3;
        const originalLines = [];
        const currentLines = [];
        for (let i = 0; i < diff.length; ++i) {
            const token = diff[i];
            switch (token[0]) {
                case Diff.Diff.Operation.Equal:
                    this.diffRows.push(...createEqualRows(token[1], i === 0, i === diff.length - 1));
                    originalLines.push(...token[1]);
                    currentLines.push(...token[1]);
                    break;
                case Diff.Diff.Operation.Insert:
                    for (const line of token[1]) {
                        this.diffRows.push(createRow(line, "addition" /* Addition */));
                    }
                    insertions += token[1].length;
                    currentLines.push(...token[1]);
                    break;
                case Diff.Diff.Operation.Delete:
                    deletions += token[1].length;
                    originalLines.push(...token[1]);
                    if (diff[i + 1] && diff[i + 1][0] === Diff.Diff.Operation.Insert) {
                        i++;
                        this.diffRows.push(...createModifyRows(token[1].join('\n'), diff[i][1].join('\n')));
                        insertions += diff[i][1].length;
                        currentLines.push(...diff[i][1]);
                    }
                    else {
                        for (const line of token[1]) {
                            this.diffRows.push(createRow(line, "deletion" /* Deletion */));
                        }
                    }
                    break;
            }
        }
        this.maxLineDigits = Math.ceil(Math.log10(Math.max(currentLineNumber, baselineLineNumber)));
        const insertionText = i18nString(UIStrings.sInsertions, { n: insertions });
        const deletionText = i18nString(UIStrings.sDeletions, { n: deletions });
        this.diffStats.setText(`${insertionText}, ${deletionText}`);
        this.toolbar.setEnabled(true);
        this.emptyWidget.hideWidget();
        this.editor.operation(() => {
            this.editor.showWidget();
            this.editor.setHighlightMode({
                name: 'devtools-diff',
                diffRows: this.diffRows,
                mimeType: /** @type {!Workspace.UISourceCode.UISourceCode} */ this.selectedUISourceCode
                    .mimeType(),
                baselineLines: originalLines,
                currentLines: currentLines,
            });
            this.editor.setText(this.diffRows
                .map((row) => row.tokens.map((t) => t.text).join(''))
                .join('\n'));
            this.editor.setLineNumberFormatter(this.lineFormatter.bind(this));
            this.editor.updateDiffGutter(this.diffRows);
        });
        function createEqualRows(lines, atStart, atEnd) {
            const equalRows = [];
            if (!atStart) {
                for (let i = 0; i < paddingLines && i < lines.length; i++) {
                    equalRows.push(createRow(lines[i], "equal" /* Equal */));
                }
                if (lines.length > paddingLines * 2 + 1 && !atEnd) {
                    equalRows.push(createRow(i18nString(UIStrings.SkippingDMatchingLines, { PH1: (lines.length - paddingLines * 2) }), "spacer" /* Spacer */));
                }
            }
            if (!atEnd) {
                const start = Math.max(lines.length - paddingLines - 1, atStart ? 0 : paddingLines);
                let skip = lines.length - paddingLines - 1;
                if (!atStart) {
                    skip -= paddingLines;
                }
                if (skip > 0) {
                    baselineLineNumber += skip;
                    currentLineNumber += skip;
                }
                for (let i = start; i < lines.length; i++) {
                    equalRows.push(createRow(lines[i], "equal" /* Equal */));
                }
            }
            return equalRows;
        }
        function createModifyRows(before, after) {
            const internalDiff = Diff.Diff.DiffWrapper.charDiff(before, after, true /* cleanup diff */);
            const deletionRows = [createRow('', "deletion" /* Deletion */)];
            const insertionRows = [createRow('', "addition" /* Addition */)];
            for (const token of internalDiff) {
                const text = token[1];
                const type = token[0];
                const className = type === Diff.Diff.Operation.Equal ? '' : 'inner-diff';
                const lines = text.split('\n');
                for (let i = 0; i < lines.length; i++) {
                    if (i > 0 && type !== Diff.Diff.Operation.Insert) {
                        deletionRows.push(createRow('', "deletion" /* Deletion */));
                    }
                    if (i > 0 && type !== Diff.Diff.Operation.Delete) {
                        insertionRows.push(createRow('', "addition" /* Addition */));
                    }
                    if (!lines[i]) {
                        continue;
                    }
                    if (type !== Diff.Diff.Operation.Insert) {
                        deletionRows[deletionRows.length - 1].tokens.push({ text: lines[i], className });
                    }
                    if (type !== Diff.Diff.Operation.Delete) {
                        insertionRows[insertionRows.length - 1].tokens.push({ text: lines[i], className });
                    }
                }
            }
            return deletionRows.concat(insertionRows);
        }
        function createRow(text, type) {
            if (type === "addition" /* Addition */) {
                currentLineNumber++;
            }
            if (type === "deletion" /* Deletion */) {
                baselineLineNumber++;
            }
            if (type === "equal" /* Equal */) {
                baselineLineNumber++;
                currentLineNumber++;
            }
            return { baselineLineNumber, currentLineNumber, tokens: text ? [{ text, className: 'inner-diff' }] : [], type };
        }
    }
    lineFormatter(lineNumber) {
        const row = this.diffRows[lineNumber - 1];
        let showBaseNumber = row.type === "deletion" /* Deletion */;
        let showCurrentNumber = row.type === "addition" /* Addition */;
        if (row.type === "equal" /* Equal */) {
            showBaseNumber = true;
            showCurrentNumber = true;
        }
        const baseText = showBaseNumber ? String(row.baselineLineNumber) : '';
        const base = baseText.padStart(this.maxLineDigits, '\xA0');
        const currentText = showCurrentNumber ? String(row.currentLineNumber) : '';
        const current = currentText.padStart(this.maxLineDigits, '\xA0');
        return base + '\xA0' + current;
    }
}
let diffUILocationRevealerInstance;
export class DiffUILocationRevealer {
    static instance(opts = { forceNew: false }) {
        const { forceNew } = opts;
        if (!diffUILocationRevealerInstance || forceNew) {
            diffUILocationRevealerInstance = new DiffUILocationRevealer();
        }
        return diffUILocationRevealerInstance;
    }
    async reveal(diffUILocation, omitFocus) {
        if (!(diffUILocation instanceof WorkspaceDiff.WorkspaceDiff.DiffUILocation)) {
            throw new Error('Internal error: not a diff ui location');
        }
        await UI.ViewManager.ViewManager.instance().showView('changes.changes');
        ChangesView.instance().changesSidebar.selectUISourceCode(diffUILocation.uiSourceCode, omitFocus);
    }
}
//# sourceMappingURL=ChangesView.js.map