// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const styles = new CSSStyleSheet();
styles.replaceSync(
`/*
 * Copyright (c) 2020 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

.csp-violations-pane {
  overflow: hidden;
}

.csp-violations-toolbar {
  border-bottom: var(--color-details-hairline);
}

/*# sourceURL=cspViolationsView.css */
`);
export default styles;
