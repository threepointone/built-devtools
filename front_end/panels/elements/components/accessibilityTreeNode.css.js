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

span {
  color: var(--color-syntax-8);
  font-family: var(--monospace-font-family);
  font-size: var(--monospace-font-size);
}

.role-value {
  color: var(--color-syntax-2);
}

.attribute-name {
  color: var(--color-syntax-4);
}

.attribute-value {
  color: var(--color-syntax-3);
}

/*# sourceURL=accessibilityTreeNode.css */
`);
export default styles;
