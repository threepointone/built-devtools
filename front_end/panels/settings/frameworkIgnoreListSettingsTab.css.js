// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const styles = new CSSStyleSheet();
styles.replaceSync(
`/*
 * Copyright 2015 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

:host {
  overflow: hidden;
}

.header {
  padding: 0 0 6px;
  border-bottom: var(--legacy-divider-border);
  font-size: 18px;
  font-weight: normal;
  flex: none;
}

.intro {
  margin-top: 10px;
}

.ignore-list-content-scripts {
  margin-top: 10px;
  flex: none;
}

.add-button {
  margin: 10px 2px;
  align-self: flex-start;
  flex: none;
}

.ignore-list {
  margin-top: 10px;
  max-width: 500px;
  flex: 0 1 auto;
  min-height: 30px;
}

.ignore-list-empty {
  flex: auto;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ignore-list-item {
  padding: 3px 5px 3px 5px;
  height: 30px;
  display: flex;
  align-items: center;
  position: relative;
  flex: auto 1 1;
}

.ignore-list-pattern {
  flex: auto;
  min-width: 100px;
}

.ignore-list-item .ignore-list-pattern {
  white-space: nowrap;
  text-overflow: ellipsis;
  user-select: none;
  color: var(--color-text-primary);
  overflow: hidden;
}

.ignore-list-item.ignore-list-disabled .ignore-list-pattern {
  text-decoration: line-through;
}

.ignore-list-behavior {
  flex: 0 0 100px;
  padding-left: 10px;
}

.ignore-list-behavior > select {
  margin-left: -10px;
}

.ignore-list-separator {
  flex: 0 0 1px;
  background-color: var(--color-details-hairline);
  height: 30px;
  margin: 0 4px;
}

.ignore-list-separator-invisible {
  visibility: hidden;
  height: 100% !important; /* stylelint-disable-line declaration-no-important */
}

.ignore-list-edit-row {
  flex: none;
  display: flex;
  flex-direction: row;
  margin: 6px 5px;
  align-items: center;
}

.ignore-list-edit-row input,
.ignore-list-edit-row select {
  width: 100%;
  text-align: inherit;
}

/*# sourceURL=frameworkIgnoreListSettingsTab.css */
`);
export default styles;