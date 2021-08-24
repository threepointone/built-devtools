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
  padding: 20px;
}

.heading {
  font-size: 15px;
}

devtools-data-grid-controller {
  border: 1px solid var(--color-details-hairline);
  margin-top: 20px;
}

.info-icon {
  vertical-align: text-bottom;
  height: 14px;
}

.no-tt-message {
  margin-top: 20px;
}

/*# sourceURL=trustTokensView.css */
`);
export default styles;
