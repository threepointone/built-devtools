// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const styles = new CSSStyleSheet();
styles.replaceSync(
`/*
 * Copyright (c) 2015 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

:host {
  padding: 12px;
}

[is=dt-checkbox] {
  margin: 0 0 10px 0;
  flex: none;
}

.panel-section-separator {
  height: 1px;
  margin-bottom: 10px;
  background: var(--color-details-hairline);
  flex: none;
}

.panel-section-separator:last-child {
  background: transparent;
}

.chrome-select-label {
  margin-bottom: 16px;
}

/*# sourceURL=renderingOptions.css */
`);
export default styles;
