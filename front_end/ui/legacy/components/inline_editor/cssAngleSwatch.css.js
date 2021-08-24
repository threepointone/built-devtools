// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const styles = new CSSStyleSheet();
styles.replaceSync(
`/*
 * Copyright 2021 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

.swatch {
  position: relative;
  display: inline-block;
  margin-bottom: -2px;
  width: 1em;
  height: 1em;
  border: 1px solid var(--legacy-selection-inactive-fg-color);
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  background-color: var(--color-background-elevation-1);
}

.mini-hand {
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 55%;
  width: 2px;
  background-color: var(--legacy-accent-fg-color);
  border-radius: 5px;
}

/*# sourceURL=cssAngleSwatch.css */
`);
export default styles;
