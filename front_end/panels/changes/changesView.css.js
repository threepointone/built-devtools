// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const styles = new CSSStyleSheet();
styles.replaceSync(
`/*
 * Copyright (c) 2017 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

[slot=insertion-point-main] {
  flex-direction: column;
  display: flex;
}

[slot=insertion-point-sidebar] {
  overflow: auto;
}

.editor-container {
  flex: 1;
}

:focus.selected {
  --override-selected-color: #fff;

  background-color: var(--legacy-selection-bg-color);
  color: var(--override-selected-color);
}

.-theme-with-dark-background :focus.selected,
:host-context(.-theme-with-dark-background) :focus.selected {
  --override-selected-color: rgb(0 0 0);
}

.CodeMirror-lines:not(:active) {
  cursor: default !important; /* stylelint-disable-line declaration-no-important */
}

.CodeMirror-line:hover {
  --override-line-hover-background-color: rgb(0 0 255 / 5%);

  cursor: default !important; /* stylelint-disable-line declaration-no-important */
  background-color: var(--override-line-hover-background-color) !important; /* stylelint-disable-line declaration-no-important */
}

.CodeMirror .CodeMirror-linebackground.spacer {
  --override-spacer-color: rgb(0 0 0 / 50%);
  --override-spacer-background-color: rgb(0 0 255 / 10%);

  text-align: center;
  color: var(--override-spacer-color);
  background-color: var(--override-spacer-background-color);
}

.-theme-with-dark-background .CodeMirror .CodeMirror-linebackground.spacer,
:host-context(.-theme-with-dark-background) .CodeMirror .CodeMirror-linebackground.spacer {
  --override-spacer-color: rgb(230 230 230 / 50%);
}

.CodeMirror .equal > span > span {
  opacity: 50%;
}

.CodeMirror .CodeMirror-selectedtext:not(.CodeMirror-persist-highlight) {
  opacity: 100%;
}

.CodeMirror .CodeMirror-linebackground.addition,
.changes-diff-gutter-marker.addition {
  --override-addition-background-color: hsl(144deg 55% 49% / 20%);

  background-color: var(--override-addition-background-color);
}

.CodeMirror .CodeMirror-linebackground.deletion,
.changes-diff-gutter-marker.deletion {
  --override-deletion-background-color: rgb(255 0 0 / 20%);

  background-color: var(--override-deletion-background-color);
}

.CodeMirror .addition .cm-inner-diff:not(.CodeMirror-selectedtext) {
  --override-addition-inner-diff-background-color: hsl(144deg 55% 49% / 30%);

  background-color: var(--override-addition-inner-diff-background-color);
}

.CodeMirror .deletion .cm-inner-diff:not(.CodeMirror-selectedtext),
.-theme-preserve {
  --override-deletion-inner-diff-background-color: rgb(255 0 0 / 30%);

  background-color: var(--override-deletion-inner-diff-background-color);
}

.changes-toolbar {
  background-color: var(--color-background-elevation-1);
  border-top: var(--legacy-divider-border);
}

.changes-diff-gutter {
  width: 20px;
}

.changes-diff-gutter-marker {
  text-align: center;
}

/*# sourceURL=changesView.css */
`);
export default styles;
