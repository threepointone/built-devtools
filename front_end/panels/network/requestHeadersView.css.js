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

.request-headers-view {
  user-select: text;
  overflow: auto;
}

.resource-status-image {
  margin-top: -2px;
  margin-right: 3px;
}

.request-headers-tree {
  flex-grow: 1;
  overflow-y: auto;
  margin: 0;
}

/*# sourceURL=requestHeadersView.css */
`);
export default styles;
