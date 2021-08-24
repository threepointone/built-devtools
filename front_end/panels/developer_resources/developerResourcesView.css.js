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

:host {
  overflow: hidden;
}

.developer-resource-view-toolbar-container {
  display: flex;
  border-bottom: 1px solid var(--color-details-hairline);
  flex: 0 0 auto;
}

.developer-resource-view-toolbar {
  display: inline-block;
  width: 100%;
}

.developer-resource-view-toolbar-summary {
  background-color: var(--color-background-elevation-2);
  border-top: 1px solid var(--color-details-hairline);
  padding-left: 5px;
  flex: 0 0 19px;
  display: flex;
  padding-right: 5px;
}

.developer-resource-view-toolbar-summary .developer-resource-view-message {
  padding-top: 2px;
  padding-left: 1ex;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.developer-resource-view-results {
  overflow-y: auto;
  display: flex;
  flex: auto;
}

/*# sourceURL=developerResourcesView.css */
`);
export default styles;