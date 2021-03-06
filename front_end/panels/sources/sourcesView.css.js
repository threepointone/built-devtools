// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const styles = new CSSStyleSheet();
styles.replaceSync(
`/*
 * Copyright (C) 2013 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

#sources-panel-sources-view {
  --override-highlight-animation-10pc-background-color: rgb(158 54 153);
  --override-highlight-animation-10pc-foreground-color: rgb(255 255 255);

  flex: auto;
  position: relative;
}

#sources-panel-sources-view .sources-toolbar {
  display: flex;
  flex: 0 0 27px;
  background-color: var(--color-background-elevation-1);
  border-top: var(--legacy-divider-border);
  overflow: hidden;
  z-index: 0;
}

.sources-toolbar .toolbar {
  cursor: default;
}

.source-frame-debugger-script {
  --override-debugger-background-tint: rgb(255 255 194 / 50%);

  background-color: var(--override-debugger-background-tint);
}

.-theme-with-dark-background .source-frame-debugger-script {
  --override-debugger-background-tint: rgb(61 61 0 / 50%);
}

@keyframes source-frame-value-update-highlight-animation {
  from {
    background-color: inherit;
    color: inherit;
  }

  10% {
    background-color: var(--override-highlight-animation-10pc-background-color);
    color: var(--override-highlight-animation-10pc-foreground-color);
  }

  to {
    background-color: inherit;
    color: inherit;
  }
}

.source-frame-value-update-highlight {
  animation: source-frame-value-update-highlight-animation 0.8s 1 cubic-bezier(0, 0, 0.2, 1);
  border-radius: 2px;
}

.diff-entry-insert {
  --override-diff-line-number-background-color: hsl(144deg 55% 49% / 20%);
}

.-theme-with-dark-background .diff-entry-insert,
:host-context(.-theme-with-dark-background) .diff-entry-insert {
  --override-diff-line-number-background-color: rgb(61 199 116 / 20%);
}

.diff-entry-insert .diff-marker {
  border-left: 4px solid var(--color-accent-green);
}

.diff-entry-insert .CodeMirror-gutter-background {
  background-color: var(--override-diff-line-number-background-color);
}

.diff-entry-modify {
  --override-diff-line-number-background-color: rgb(186 104 200 / 20%);
  --override-diff-line-number-border-color: #9c27b0;
}

.-theme-with-dark-background .diff-entry-modify,
:host-context(.-theme-with-dark-background) .diff-entry-modify {
  --override-diff-line-number-background-color: rgb(137 55 151 / 20%);
  --override-diff-line-number-border-color: rgb(196 79 216);
}

.diff-entry-modify .diff-marker {
  border-left: 4px solid var(--override-diff-line-number-border-color);
}

.diff-entry-modify .CodeMirror-gutter-background {
  background-color: var(--override-diff-line-number-background-color);
}

.diff-entry-delete {
  --override-diff-deletion-color: #d32f2f;
}

.-theme-with-dark-background .diff-entry-delete,
:host-context(.-theme-with-dark-background) .diff-entry-delete {
  --override-diff-deletion-color: rgb(208 44 44);
}

.diff-entry-delete .diff-marker {
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 6px solid var(--override-diff-deletion-color);
  position: relative;
  top: 6px;
  cursor: pointer;
  left: 0;
}

.diff-entry-delete .CodeMirror-gutter-background {
  border-bottom: 2px solid var(--override-diff-deletion-color);
}

.CodeMirror-gutter-diff {
  width: 4px;
}

.highlight-line-modification {
  --override-modification-background-fadeout-from: rgb(158 54 153 / 50%);
  --override-modification-background-fadeout-90pc: rgb(158 54 153 / 0%);
  --override-modification-foreground-fadeout-from: #fff;

  animation: source-line-modification-background-fadeout 0.4s 0s;
  animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
}

.highlight-line-modification span {
  animation: source-line-modification-foreground-fadeout 0.4s 0s;
  animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
}

@keyframes source-line-modification-background-fadeout {
  from {
    background-color: var(--override-modification-background-fadeout-from);
  }

  50% {
    /* Purposefully uses the \\'from\\' color to delay the animation from 0-50% */
    background-color: var(--override-modification-background-fadeout-from);
  }

  90% {
    background-color: var(--override-modification-background-fadeout-90pc);
  }
  to { background-color: transparent; }
}

@keyframes source-line-modification-foreground-fadeout {
  from {
    color: var(--override-modification-foreground-fadeout-from);
  }

  50% {
    /* Purposefully uses the \\'from\\' color to delay the animation from 0-50% */
    color: var(--override-modification-foreground-fadeout-from);
  }
  90% { color: initial; }
  to { color: initial; }
}

/*# sourceURL=sourcesView.css */
`);
export default styles;
