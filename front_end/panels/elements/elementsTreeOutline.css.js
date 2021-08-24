// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const styles = new CSSStyleSheet();
styles.replaceSync(
`/*
 * Copyright (c) 2014 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

.editing {
  box-shadow: var(--drop-shadow);
  background-color: var(--color-background);
  text-overflow: clip !important; /* stylelint-disable-line declaration-no-important */
  padding-left: 2px;
  margin-left: -2px;
  padding-right: 2px;
  margin-right: -2px;
  margin-bottom: -1px;
  padding-bottom: 1px;
  opacity: 100% !important; /* stylelint-disable-line declaration-no-important */
}

.editing,
.editing * {
  color: var(--color-text-primary) !important; /* stylelint-disable-line declaration-no-important */
  text-decoration: none !important; /* stylelint-disable-line declaration-no-important */
}

.editing br {
  display: none;
}

.elements-disclosure {
  width: 100%;
  display: inline-block;
  line-height: normal;
}

.elements-disclosure li {
  /** Keep margin-left & padding-left in sync with ElementsTreeElements.updateDecorators **/
  padding: 1px 0 0 14px;
  margin-left: -2px;
  word-break: normal;
  position: relative;
  min-height: 15px;
  line-height: 1.36;
  min-width: 200px;
}

.elements-disclosure li.parent {
  /** Keep it in sync with ElementsTreeElements.updateDecorators **/
  margin-left: -13px;
}

.elements-disclosure li .selected-hint::before {
  font-style: italic;
  content: " == $0";
  opacity: 0%;
  position: absolute;
  white-space: pre;
}

.elements-disclosure .elements-tree-outline:not(.hide-selection-when-blurred) li.selected .selected-hint::before {
  position: static;
  opacity: 60%;
}

.elements-disclosure li.parent::before {
  box-sizing: border-box;
  user-select: none;
  -webkit-mask-image: var(--image-file-treeoutlineTriangles);
  -webkit-mask-size: 32px 24px;
  content: '\\A0\\A0';
  color: transparent;
  text-shadow: none;
  margin-right: -3px;
  -webkit-mask-position: 0 0;
  background-color: var(--color-text-secondary);
}

.elements-disclosure li.parent.expanded::before {
  -webkit-mask-position: -16px 0;
}

.elements-disclosure li.always-parent::before {
  visibility: hidden;
}

.elements-disclosure li .selection {
  display: none;
  z-index: -1;
}

.elements-disclosure li.selected .selection {
  display: block;
}

.elements-disclosure li.elements-drag-over .selection {
  display: block;
  margin-top: -2px;
  border-top: 2px solid var(--legacy-selection-bg-color);
}

.elements-disclosure .elements-tree-outline:not(.hide-selection-when-blurred) .selection {
  background-color: var(--legacy-item-selection-inactive-bg-color);
}

.elements-disclosure li.hovered:not(.selected) .selection {
  display: block;
  left: 3px;
  right: 3px;
  background-color: var(--item-hover-color);
  border-radius: 5px;
}

.elements-disclosure li .webkit-html-tag.close {
  margin-left: -12px;
}

.elements-disclosure .elements-tree-outline.hide-selection-when-blurred .selected:focus-visible .highlight > * {
  background: var(--legacy-focus-bg-color);
  border-radius: 2px;
  box-shadow: 0 0 0 2px var(--legacy-focus-bg-color);
}

.elements-disclosure .elements-tree-outline:not(.hide-selection-when-blurred) li.selected:focus .selection {
  background-color: var(--legacy-item-selection-bg-color);
}

.elements-disclosure ol {
  list-style-type: none;
  /** Keep it in sync with ElementsTreeElements.updateDecorators **/
  padding-inline-start: 12px;
  margin: 0;
}

.elements-disclosure ol.children {
  display: none;
  min-width: 100%;
}

.elements-disclosure ol.children.expanded {
  display: inline-block;
}

.elements-disclosure > ol {
  position: relative;
  margin: 0;
  cursor: default;
  min-width: 100%;
  min-height: 100%;
  padding-left: 2px;
}

.elements-disclosure li.in-clipboard .highlight {
  outline: 1px dotted var(--color-details-hairline);
}

.elements-tree-outline ol.shadow-root-depth-4 {
  --override-shadow-root-background-color: rgb(0 0 0 / 4%);

  background-color: var(--override-shadow-root-background-color);
}

.elements-tree-outline ol.shadow-root-depth-3 {
  --override-shadow-root-background-color: rgb(0 0 0 / 3%);

  background-color: var(--override-shadow-root-background-color);
}

.elements-tree-outline ol.shadow-root-depth-2 {
  --override-shadow-root-background-color: rgb(0 0 0 / 2%);

  background-color: var(--override-shadow-root-background-color);
}

.elements-tree-outline ol.shadow-root-depth-1 {
  --override-shadow-root-background-color: rgb(0 0 0 / 1%);

  background-color: var(--override-shadow-root-background-color);
}

.elements-tree-outline ol.shadow-root-deep {
  background-color: transparent;
}

.elements-tree-editor {
  box-shadow: var(--drop-shadow);
  margin-right: 4px;
}

.CodeMirror {
  background-color: var(--color-background);
  height: 300px !important; /* stylelint-disable-line declaration-no-important */
}

.CodeMirror-lines {
  padding: 0;
}

.CodeMirror pre {
  padding: 0;
}

button,
input,
select {
  font-family: inherit;
  font-size: inherit;
}

.elements-gutter-decoration {
  position: absolute;
  top: 3px;
  left: 2px;
  height: 9px;
  width: 9px;
  border-radius: 5px;
  border: 1px solid var(--issue-color-yellow);
  background-color: var(--issue-color-yellow);
  cursor: pointer;
}

.elements-gutter-decoration.elements-has-decorated-children {
  opacity: 50%;
}

.add-attribute {
  margin-left: 1px;
  margin-right: 1px;
  white-space: nowrap;
}

.elements-tree-nowrap,
.elements-tree-nowrap .li {
  white-space: pre !important; /* stylelint-disable-line declaration-no-important */
}

.elements-disclosure .elements-tree-nowrap li {
  word-wrap: normal;
}
/* DOM update highlight */
@keyframes dom-update-highlight-animation {
  from {
    background-color: var(--color-syntax-2);
    color: var(--color-background);
  }

  80% {
    background-color: var(--color-syntax-8);
  }

  to {
    background-color: inherit;
  }
}

@keyframes dom-update-highlight-animation-dark {
  from {
    background-color: var(--color-syntax-2);
    color: var(--color-background);
  }

  80% {
    background-color: var(--color-background);
    color: inherit;
  }

  to {
    background-color: inherit;
  }
}

.dom-update-highlight {
  animation: dom-update-highlight-animation 1.4s 1 cubic-bezier(0, 0, 0.2, 1);
  border-radius: 2px;
}

:host-context(.-theme-with-dark-background) .dom-update-highlight {
  animation: dom-update-highlight-animation-dark 1.4s 1 cubic-bezier(0, 0, 0.2, 1);
}

.elements-disclosure.single-node li {
  padding-left: 2px;
}

.elements-tree-shortcut-title,
.elements-tree-shortcut-link {
  color: var(--color-text-secondary);
}

.elements-disclosure .gutter-container {
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
  width: 15px;
  height: 15px;
}

.elements-hide-gutter .gutter-container {
  display: none;
}

.gutter-menu-icon {
  display: block;
  visibility: hidden;
  transform: rotate(-90deg) scale(0.8);
  background-color: var(--color-background);
  position: relative;
  left: -7px;
  top: -3px;
}

.elements-disclosure li.selected .gutter-container:not(.has-decorations) .gutter-menu-icon {
  visibility: visible;
}
/** Guide line */

li.selected {
  z-index: 0;
}

li.hovered:not(.always-parent) + ol.children,
.elements-tree-outline ol.shadow-root,
li.selected:not(.always-parent) + ol.children {
  background: linear-gradient(to right, var(--override-indentation-level-border-color), var(--override-indentation-level-border-color) 0.5px, transparent 0);
  background-position-x: 5px;
}

li.selected:not(.always-parent) + ol.children {
  --override-indentation-level-border-color: hsl(216deg 68% 80% / 100%) !important; /* stylelint-disable-line declaration-no-important */
}

li.hovered:not(.always-parent) + ol.children:not(.shadow-root) {
  --override-indentation-level-border-color: hsl(0deg 0% 0% / 10%);
}

.elements-tree-outline ol.shadow-root {
  --override-indentation-level-border-color: hsl(0deg 0% 80% / 100%);
}

@media (forced-colors: active) {
  .elements-disclosure li.parent::before {
    forced-color-adjust: none;
    background-color: ButtonText !important; /* stylelint-disable-line declaration-no-important */
  }

  .elements-disclosure .elements-tree-outline:not(.hide-selection-when-blurred) li.selected .selected-hint::before {
    opacity: unset;
  }

  .elements-disclosure .elements-tree-outline:not(.hide-selection-when-blurred) .selection,
  .elements-disclosure li.hovered:not(.selected) .selection,
  .elements-disclosure .elements-tree-outline:not(.hide-selection-when-blurred) li.selected:focus .selection {
    forced-color-adjust: none;
    background: canvas !important; /* stylelint-disable-line declaration-no-important */
    border: 1px solid Highlight !important; /* stylelint-disable-line declaration-no-important */
  }

  .gutter-menu-icon {
    forced-color-adjust: none;
  }
}

/*# sourceURL=elementsTreeOutline.css */
`);
export default styles;
