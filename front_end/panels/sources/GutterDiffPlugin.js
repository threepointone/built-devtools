// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Common from '../../core/common/common.js';
import * as i18n from '../../core/i18n/i18n.js';
import * as Persistence from '../../models/persistence/persistence.js';
import * as Workspace from '../../models/workspace/workspace.js';
import * as WorkspaceDiff from '../../models/workspace_diff/workspace_diff.js';
import * as SourceFrame from '../../ui/legacy/components/source_frame/source_frame.js';
import { Plugin } from './Plugin.js';
const UIStrings = {
    /**
    *@description A context menu item in the Gutter Diff Plugin of the Sources panel
    */
    localModifications: 'Local Modifications...',
};
const str_ = i18n.i18n.registerUIStrings('panels/sources/GutterDiffPlugin.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class GutterDiffPlugin extends Plugin {
    textEditor;
    uiSourceCode;
    decorations;
    workspaceDiff;
    constructor(textEditor, uiSourceCode) {
        super();
        this.textEditor = textEditor;
        this.uiSourceCode = uiSourceCode;
        this.decorations = [];
        this.textEditor.installGutter(DiffGutterType, true);
        this.workspaceDiff = WorkspaceDiff.WorkspaceDiff.workspaceDiff();
        this.workspaceDiff.subscribeToDiffChange(this.uiSourceCode, this.update, this);
        this.update();
    }
    static accepts(uiSourceCode) {
        return uiSourceCode.project().type() === Workspace.Workspace.projectTypes.Network;
    }
    updateDecorations(removed, added) {
        this.textEditor.operation(operation);
        function operation() {
            for (const decoration of removed) {
                decoration.remove();
            }
            for (const decoration of added) {
                decoration.install();
            }
        }
    }
    update() {
        if (this.uiSourceCode) {
            this.workspaceDiff.requestDiff(this.uiSourceCode).then(this.innerUpdate.bind(this));
        }
        else {
            this.innerUpdate(null);
        }
    }
    innerUpdate(lineDiff) {
        if (!lineDiff) {
            this.updateDecorations(this.decorations, []);
            this.decorations = [];
            return;
        }
        const diff = SourceFrame.SourceCodeDiff.SourceCodeDiff.computeDiff(lineDiff);
        const newDecorations = new Map();
        for (let i = 0; i < diff.length; ++i) {
            const diffEntry = diff[i];
            for (let lineNumber = diffEntry.from; lineNumber < diffEntry.to; ++lineNumber) {
                newDecorations.set(lineNumber, { lineNumber: lineNumber, type: diffEntry.type });
            }
        }
        const decorationDiff = this.calculateDecorationsDiff(newDecorations);
        const addedDecorations = decorationDiff.added.map(entry => new GutterDecoration(this.textEditor, entry.lineNumber, entry.type));
        this.decorations = decorationDiff.equal.concat(addedDecorations);
        this.updateDecorations(decorationDiff.removed, addedDecorations);
        this.decorationsSetForTest(newDecorations);
    }
    decorationsByLine() {
        const decorations = new Map();
        for (const decoration of this.decorations) {
            const lineNumber = decoration.lineNumber();
            if (lineNumber !== -1) {
                decorations.set(lineNumber, decoration);
            }
        }
        return decorations;
    }
    calculateDecorationsDiff(decorations) {
        const oldDecorations = this.decorationsByLine();
        const leftKeys = [...oldDecorations.keys()];
        const rightKeys = [...decorations.keys()];
        leftKeys.sort((a, b) => a - b);
        rightKeys.sort((a, b) => a - b);
        const removed = [];
        const added = [];
        const equal = [];
        let leftIndex = 0;
        let rightIndex = 0;
        while (leftIndex < leftKeys.length && rightIndex < rightKeys.length) {
            const leftKey = leftKeys[leftIndex];
            const rightKey = rightKeys[rightIndex];
            const left = oldDecorations.get(leftKey);
            const right = decorations.get(rightKey);
            if (!left) {
                throw new Error(`No decoration with key ${leftKey}`);
            }
            if (!right) {
                throw new Error(`No decoration with key ${rightKey}`);
            }
            if (leftKey === rightKey && left.type === right.type) {
                equal.push(left);
                ++leftIndex;
                ++rightIndex;
            }
            else if (leftKey <= rightKey) {
                removed.push(left);
                ++leftIndex;
            }
            else {
                added.push(right);
                ++rightIndex;
            }
        }
        while (leftIndex < leftKeys.length) {
            const leftKey = leftKeys[leftIndex++];
            const left = oldDecorations.get(leftKey);
            if (!left) {
                throw new Error(`No decoration with key ${leftKey}`);
            }
            removed.push(left);
        }
        while (rightIndex < rightKeys.length) {
            const rightKey = rightKeys[rightIndex++];
            const right = decorations.get(rightKey);
            if (!right) {
                throw new Error(`No decoration with key ${rightKey}`);
            }
            added.push(right);
        }
        return { added: added, removed: removed, equal: equal };
    }
    decorationsSetForTest(_decorations) {
    }
    async populateLineGutterContextMenu(contextMenu, _lineNumber) {
        GutterDiffPlugin.appendRevealDiffContextMenu(contextMenu, this.uiSourceCode);
    }
    async populateTextAreaContextMenu(contextMenu, _lineNumber, _columnNumber) {
        GutterDiffPlugin.appendRevealDiffContextMenu(contextMenu, this.uiSourceCode);
    }
    static appendRevealDiffContextMenu(contextMenu, uiSourceCode) {
        if (!WorkspaceDiff.WorkspaceDiff.workspaceDiff().isUISourceCodeModified(uiSourceCode)) {
            return;
        }
        contextMenu.revealSection().appendItem(i18nString(UIStrings.localModifications), () => {
            Common.Revealer.reveal(new WorkspaceDiff.WorkspaceDiff.DiffUILocation(uiSourceCode));
        });
    }
    dispose() {
        for (const decoration of this.decorations) {
            decoration.remove();
        }
        WorkspaceDiff.WorkspaceDiff.workspaceDiff().unsubscribeFromDiffChange(this.uiSourceCode, this.update, this);
    }
}
export class GutterDecoration {
    textEditor;
    position;
    className;
    type;
    constructor(textEditor, lineNumber, type) {
        this.textEditor = textEditor;
        this.position = this.textEditor.textEditorPositionHandle(lineNumber, 0);
        this.className = '';
        if (type === SourceFrame.SourceCodeDiff.EditType.Insert) {
            this.className = 'diff-entry-insert';
        }
        else if (type === SourceFrame.SourceCodeDiff.EditType.Delete) {
            this.className = 'diff-entry-delete';
        }
        else if (type === SourceFrame.SourceCodeDiff.EditType.Modify) {
            this.className = 'diff-entry-modify';
        }
        this.type = type;
    }
    lineNumber() {
        const location = this.position.resolve();
        if (!location) {
            return -1;
        }
        return location.lineNumber;
    }
    install() {
        const location = this.position.resolve();
        if (!location) {
            return;
        }
        const element = document.createElement('div');
        element.classList.add('diff-marker');
        element.textContent = '\xA0';
        this.textEditor.setGutterDecoration(location.lineNumber, DiffGutterType, element);
        this.textEditor.toggleLineClass(location.lineNumber, this.className, true);
    }
    remove() {
        const location = this.position.resolve();
        if (!location) {
            return;
        }
        this.textEditor.setGutterDecoration(location.lineNumber, DiffGutterType, null);
        this.textEditor.toggleLineClass(location.lineNumber, this.className, false);
    }
}
export const DiffGutterType = 'CodeMirror-gutter-diff';
let contextMenuProviderInstance;
export class ContextMenuProvider {
    static instance(opts = { forceNew: null }) {
        const { forceNew } = opts;
        if (!contextMenuProviderInstance || forceNew) {
            contextMenuProviderInstance = new ContextMenuProvider();
        }
        return contextMenuProviderInstance;
    }
    appendApplicableItems(_event, contextMenu, target) {
        let uiSourceCode = target;
        const binding = Persistence.Persistence.PersistenceImpl.instance().binding(uiSourceCode);
        if (binding) {
            uiSourceCode = binding.network;
        }
        GutterDiffPlugin.appendRevealDiffContextMenu(contextMenu, uiSourceCode);
    }
}
//# sourceMappingURL=GutterDiffPlugin.js.map