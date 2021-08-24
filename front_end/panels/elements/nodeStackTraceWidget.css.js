// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const styles = new CSSStyleSheet();
styles.replaceSync(
`/*
 * Copyright 2019 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

.stack-trace {
  font-size: 11px !important; /* stylelint-disable-line declaration-no-important */
  font-family: Menlo, monospace;
}

/*# sourceURL=nodeStackTraceWidget.css */
`);
export default styles;
