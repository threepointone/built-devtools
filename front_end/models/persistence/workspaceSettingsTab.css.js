// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const styles = new CSSStyleSheet();
styles.replaceSync(
`/*
 * Copyright 2017 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

header {
  padding: 0 0 6px;
}

header > h1 {
  font-size: 18px;
  font-weight: normal;
  margin: 0;
  padding-bottom: 3px;
}

.settings-content {
  overflow-y: auto;
  overflow-x: hidden;
  margin: 8px 8px 8px 0;
  padding: 0 4px;
  flex: auto;
}

.settings-container {
  width: 100%;
  column-width: 288px;
}

.settings-tab.settings-container {
  column-width: 308px;
}

.settings-tab label {
  padding-right: 4px;
  display: inline-flex;
}

.settings-container-wrapper {
  position: absolute;
  top: 31px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  padding-top: 9px;
}

.settings-tab.settings-content {
  margin: 0;
  padding: 0;
}

.settings-tab p {
  margin: 12px 0;
}

p.folder-exclude-pattern {
  display: flex;
  align-items: center;
}

p.folder-exclude-pattern > input {
  flex: auto;
}

.settings-tab .file-system-container {
  border-top: 1px solid var(--color-background-elevation-2);
  padding: 19px 0 10px;
  margin: 20px 0;
}

.settings-tab .file-system-header {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.settings-tab .file-system-name {
  font-weight: bold;
  flex: none;
  margin-right: 10px;
  font-size: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
}

.settings-tab .file-system-path {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: auto;
}

.settings-info-message {
  background-color: var(--color-background-elevation-1);
  padding: 10px;
  margin: 20px 0;
}

.settings-tab.settings-content.settings-container {
  column-width: initial;
  overflow: hidden;
  padding-right: 10px;
}
/*
 * Always show an outline. Needed because we have a white background here.
 */

.harmony-input[type=text]:not(.error-input):not(:invalid) {
  box-shadow: var(--legacy-focus-ring-inactive-shadow);
}

/*# sourceURL=workspaceSettingsTab.css */
`);
export default styles;
