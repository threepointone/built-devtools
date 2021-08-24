// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const styles = new CSSStyleSheet();
styles.replaceSync(
`/*
 * Copyright 2016 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

.layers-3d-view {
  overflow: hidden;
  user-select: none;
}

.toolbar {
  background-color: var(--color-background-elevation-1);
  border-bottom: var(--legacy-divider-border);
}

canvas {
  flex: 1 1;
}

.layers-3d-view > canvas:focus-visible {
  outline: auto 5px -webkit-focus-ring-color;
}

/*# sourceURL=layers3DView.css */
`);
export default styles;
