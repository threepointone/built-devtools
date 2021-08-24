// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const styles = new CSSStyleSheet();
styles.replaceSync(
`/*
 * Copyright 2016 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */
.report-field-name {
  flex-basis: 152px;
}

.manifest-view-header {
  min-width: 600px;
  flex-shrink: 0;
  flex-grow: 0;
}

.manifest-container {
  overflow: auto;
}

/*# sourceURL=appManifestView.css */
`);
export default styles;
