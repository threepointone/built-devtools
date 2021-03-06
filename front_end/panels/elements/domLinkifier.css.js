// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const styles = new CSSStyleSheet();
styles.replaceSync(
`/*
 * Copyright 2018 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

:host {
  display: inline;
}

.node-link {
  cursor: pointer;
  display: inline;
  pointer-events: auto;
}

.node-link:focus-visible {
  outline-width: unset;
}

.node-label-name {
  color: var(--color-syntax-1);
}

.node-label-class,
.node-label-pseudo {
  color: var(--color-syntax-4);
}

/*# sourceURL=domLinkifier.css */
`);
export default styles;
