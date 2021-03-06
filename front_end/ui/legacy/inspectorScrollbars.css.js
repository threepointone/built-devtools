// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const styles = new CSSStyleSheet();
styles.replaceSync(
`/*
 * Copyright 2020 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/* Dark mode scrollbar styling overrides */

:not(.platform-mac).-theme-with-dark-background ::-webkit-scrollbar {
  width: 14px;
  height: 14px;
}

:not(.platform-mac).-theme-with-dark-background ::-webkit-scrollbar-track {
  box-shadow: inset 0 0 1px rgb(255 255 255 / 30%); /* stylelint-disable-line plugin/use_theme_colors */
  /* See: crbug.com/1152736 for color variable migration. */
  background: rgb(36 36 36); /* stylelint-disable-line plugin/use_theme_colors */
  /* See: crbug.com/1152736 for color variable migration. */
}

:not(.platform-mac).-theme-with-dark-background ::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background-color: var(--color-scrollbar-mac);
  box-shadow: inset 0 0 1px rgb(255 255 255 / 50%); /* stylelint-disable-line plugin/use_theme_colors */
  /* See: crbug.com/1152736 for color variable migration. */
}

:not(.platform-mac).-theme-with-dark-background ::-webkit-scrollbar-corner {
  background-color: #242424; /* stylelint-disable-line plugin/use_theme_colors */
  /* See: crbug.com/1152736 for color variable migration. */
}

:host-context(:not(.platform-mac).-theme-with-dark-background) ::-webkit-scrollbar {
  width: 14px;
  height: 14px;
}

:host-context(:not(.platform-mac).-theme-with-dark-background) ::-webkit-scrollbar-track {
  box-shadow: inset 0 0 1px rgb(255 255 255 / 30%); /* stylelint-disable-line plugin/use_theme_colors */
  /* See: crbug.com/1152736 for color variable migration. */
  background: rgb(36 36 36); /* stylelint-disable-line plugin/use_theme_colors */
  /* See: crbug.com/1152736 for color variable migration. */
}

:host-context(:not(.platform-mac).-theme-with-dark-background) ::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background-color: var(--color-scrollbar-mac);
  box-shadow: inset 0 0 1px rgb(255 255 255 / 50%); /* stylelint-disable-line plugin/use_theme_colors */
  /* See: crbug.com/1152736 for color variable migration. */
}

:host-context(:not(.platform-mac).-theme-with-dark-background) ::-webkit-scrollbar-corner {
  background-color: #242424; /* stylelint-disable-line plugin/use_theme_colors */
  /* See: crbug.com/1152736 for color variable migration. */
}

/*# sourceURL=inspectorScrollbars.css */
`);
export default styles;
