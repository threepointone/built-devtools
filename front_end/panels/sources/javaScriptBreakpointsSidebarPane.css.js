// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const styles = new CSSStyleSheet();
styles.replaceSync(
`/*
 * Copyright 2017 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

.breakpoint-entry {
  padding: 3px 8px 3px 8px;
  min-height: 18px;
  line-height: 15px;
  border-top: 1px solid var(--color-details-hairline-light);
}

.breakpoint-entry:focus {
  background-color: var(--legacy-focus-bg-color);
}

.breakpoint-entry [is=dt-checkbox] {
  max-width: 100%;
  white-space: nowrap;
}

:not(.breakpoints-list-deactivated) > .breakpoint-entry:hover {
  background-color: var(--color-background-elevation-1);
}

.breakpoint-entry > .source-text {
  cursor: pointer;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-left: 22px;
}

.breakpoints-list-deactivated {
  background-color: var(--color-background-elevation-1);
  opacity: 30%;
}

.breakpoint-hit {
  --override-breakpoint-hit-background: rgb(255 255 194);
  --override-breakpoint-hit-border-color: rgb(107 97 48);

  background-color: var(--override-breakpoint-hit-background);
  border-right: 3px solid var(--override-breakpoint-hit-border-color);
}

:host-context(.-theme-with-dark-background) .breakpoint-hit {
  background-color: hsl(46deg 98% 22%);
  color: var(--color-text-primary);
}

@media (forced-colors: active) {
  .breakpoint-entry:focus,
  :not(.breakpoints-list-deactivated) > .breakpoint-entry:hover {
    forced-color-adjust: none;
    background-color: Highlight;
  }

  .breakpoint-entry:focus > *,
  :not(.breakpoints-list-deactivated) > .breakpoint-entry:hover > * {
    color: HighlightText;
  }
}

/*# sourceURL=javaScriptBreakpointsSidebarPane.css */
`);
export default styles;
