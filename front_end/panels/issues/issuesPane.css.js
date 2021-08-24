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

.issues-pane {
  overflow: hidden;
}

.issues-pane-no-issues {
  align-items: center;
  background-color: var(--color-background);
  display: flex;
  flex: 1 1 auto;
  font-size: 18px;
  justify-content: center;
  padding: 30px;
}

.issues-toolbar-container {
  display: flex;
  flex: none;
}

.issues-toolbar-container > .toolbar {
  background-color: var(--color-background-elevation-1);
  border-bottom: 1px solid var(--color-details-hairline);
}

.issues-toolbar-left {
  flex: 1 1 auto;
}

.issues-toolbar-right {
  padding-right: 6px;
}

/*# sourceURL=issuesPane.css */
`);
export default styles;
