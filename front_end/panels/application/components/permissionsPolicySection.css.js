// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const styles = new CSSStyleSheet();
styles.replaceSync(
`/*
 * Copyright (c) 2021 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

:host {
  display: contents;
}

.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link,
.devtools-link {
  color: var(--color-link);
  text-decoration: underline;
  cursor: pointer;
  padding: 2px 0; /* adjust focus ring size */
}

button.link {
  border: none;
  background: none;
  font-family: inherit;
  font-size: inherit;
}

.policies-list {
  padding-top: 3px;
}

.permissions-row {
  display: flex;
  line-height: 22px;
}

.permissions-row div {
  padding-right: 5px;
}

.feature-name {
  width: 135px;
}

.allowed-icon {
  padding: 2.5px 0;
}

.block-reason {
  width: 215px;
}

/*# sourceURL=permissionsPolicySection.css */
`);
export default styles;
