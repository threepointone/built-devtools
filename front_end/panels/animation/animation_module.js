import*as RootModule from'../../core/root/root.js';RootModule.Runtime.cachedResources.set("panels/animation/animationScreenshotPopover.css","/*\n * Copyright (c) 2015 The Chromium Authors. All rights reserved.\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\nimg {\n  max-height: 300px;\n  border-radius: 2px;\n}\n\n.animation-progress {\n  position: absolute;\n  height: 2px;\n  bottom: 0;\n  left: 0;\n  background: var(--legacy-selection-bg-color);\n}\n\n/*# sourceURL=panels/animation/animationScreenshotPopover.css */");RootModule.Runtime.cachedResources.set("panels/animation/animationTimeline.css","/*\n * Copyright (c) 2015 The Chromium Authors. All rights reserved.\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n:host {\n  overflow: hidden;\n}\n\n.animation-node-row {\n  width: 100%;\n  display: flex;\n  border-bottom: 1px dashed var(--color-details-hairline);\n}\n\n.animation-node-description {\n  width: 150px;\n  padding-left: 8px;\n  overflow: hidden;\n  position: relative;\n  transform-style: preserve-3d;\n  border-bottom: 1px solid var(--color-details-hairline);\n  margin-bottom: -1px;\n  background-color: var(--color-background-elevation-1);\n  display: flex;\n  align-items: center;\n  flex: 0 0 150px;\n}\n\n.animation-node-description > * {\n  flex: 0 0 auto;\n}\n\n.animation-timeline-row {\n  height: 32px;\n  position: relative;\n}\n\npath.animation-keyframe {\n  fill-opacity: 0.2;\n}\n\n.animation-node-selected path.animation-keyframe,\nsvg.animation-ui g:first-child:hover path.animation-keyframe {\n  fill-opacity: 0.4;\n}\n\nline.animation-line {\n  stroke-width: 2px;\n  stroke-linecap: round;\n  fill: none;\n}\n\nline.animation-delay-line {\n  stroke-width: 2px;\n  stroke-dasharray: 6, 4;\n}\n\nline.animation-delay-line.animation-fill {\n  stroke-dasharray: none;\n}\n\ncircle.animation-keyframe-point {\n  fill: var(--color-background);\n}\n\ncircle.animation-endpoint,\ncircle.animation-keyframe-point {\n  stroke-width: 2px;\n  transition: transform 100ms cubic-bezier(0, 0, 0.2, 1);\n  transform: scale(1);\n  transform-box: fill-box;\n  transform-origin: 50% 50%;\n}\n\ncircle.animation-endpoint:active,\ncircle.animation-keyframe-point:active {\n  transform: scale(1);\n}\n\n.animation-ui circle.animation-endpoint:hover,\n.animation-ui circle.animation-keyframe-point:hover {\n  transform: scale(1.2);\n}\n\n.animation-name {\n  position: absolute;\n  top: 8px;\n  color: var(--color-text-primary);\n  text-align: center;\n  margin-left: -8px;\n  white-space: nowrap;\n}\n\n.animation-timeline-toolbar-container {\n  display: flex;\n  background-color: var(--color-background-elevation-1);\n  border-bottom: var(--legacy-divider-border);\n  flex: 0 0 auto;\n}\n\n.animation-timeline-toolbar {\n  display: inline-block;\n}\n\n.animation-timeline-header {\n  height: 28px;\n  border-bottom: 1px solid var(--color-details-hairline);\n  flex-shrink: 0;\n  display: flex;\n}\n\n.animation-timeline-header::after {\n  content: '';\n  height: calc(100% - 48px - 28px);\n  position: absolute;\n  width: 150px;\n  left: 0;\n  margin-top: 28px;\n  background-color: var(--color-background-elevation-1);\n  z-index: 0;\n  border-right: 1px solid var(--color-details-hairline);\n}\n\n.animation-controls {\n  flex: 0 0 150px;\n  position: relative;\n  display: flex;\n  justify-content: flex-end;\n  padding-right: 8px;\n}\n\n.animation-timeline-current-time {\n  flex: 0 0 auto;\n  line-height: 28px;\n  margin-right: 5px;\n}\n\n.animation-grid-header {\n  flex: 1 0 auto;\n  cursor: text;\n}\n\n.animation-timeline-buffer,\n.animation-timeline-buffer-hint {\n  height: 48px;\n  flex: 0 0 auto;\n  border-bottom: 1px solid var(--color-details-hairline);\n  display: flex;\n  padding: 0 2px;\n}\n\n.animation-timeline-buffer:empty,\n.animation-timeline-buffer-hint {\n  display: none;\n}\n\n.animation-timeline-buffer:empty ~ .animation-timeline-buffer-hint {\n  align-items: center;\n  justify-content: center;\n  font-size: 14px;\n  z-index: 101;\n  display: flex;\n}\n\n.animation-time-overlay {\n  background-color: var(--color-text-primary);\n  opacity: 5%;\n  position: absolute;\n  height: 100%;\n  width: 100%;\n  z-index: -1;\n}\n\n.animation-timeline-end > .animation-time-overlay {\n  visibility: hidden;\n}\n\n.animation-scrubber {\n  opacity: 100%;\n  position: absolute;\n  left: 10px;\n  height: 100%;\n  width: 100%;\n  top: 28px;\n  border-left: 1px solid var(--color-syntax-1);\n  z-index: 2;\n  cursor: col-resize;\n}\n\n.animation-scrubber-line {\n  width: 11px;\n  background: linear-gradient(to right, transparent 5px, var(--color-syntax-1) 5px, var(--color-syntax-1) 6px, transparent 6px);\n  position: absolute;\n  top: -28px;\n  height: 28px;\n  left: -6px;\n  padding: 0 5px;\n  z-index: 3;\n}\n\n.animation-scrubber-head {\n  width: 7px;\n  height: 7px;\n  transform: rotate(45deg);\n  background: var(--color-syntax-1);\n  position: absolute;\n  left: 2px;\n  top: 1px;\n  z-index: 4;\n}\n\n.grid-overflow-wrapper {\n  position: absolute;\n  left: 140px;\n  top: 76px;\n  z-index: 1;\n  overflow: hidden;\n}\n\nsvg.animation-timeline-grid {\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n}\n\nrect.animation-timeline-grid-line {\n  fill: var(--color-background-elevation-2);\n}\n\n.animation-timeline-row > svg.animation-ui {\n  position: absolute;\n}\n\n.animation-node-timeline {\n  flex-grow: 1;\n}\n\n.animation-node-description > div {\n  position: absolute;\n  top: 50%;\n  transform: translateY(-50%);\n  max-height: 100%;\n}\n\n.animation-node-removed {\n  filter: saturate(0);\n  cursor: not-allowed;\n}\n\nsvg.animation-ui g:first-child {\n  opacity: 100%;\n}\n\nsvg.animation-ui circle:focus-visible,\nsvg.animation-ui path:focus-visible {\n  outline: 2px solid -webkit-focus-ring-color;\n}\n\n.animation-tail-iterations {\n  opacity: 50%;\n}\n\n.animation-keyframe-step line {\n  stroke-width: 2;\n  stroke-opacity: 0.3;\n}\n\ntext.animation-timeline-grid-label {\n  font-size: 10px;\n  fill: var(--color-text-secondary);\n  text-anchor: middle;\n}\n\n.animation-timeline-rows,\n.animation-timeline-rows-hint {\n  flex-grow: 1;\n  overflow-y: auto;\n  z-index: 1;\n  overflow-x: hidden;\n}\n\n.animation-timeline-rows-hint {\n  display: none;\n}\n\n.animation-timeline-buffer:not(:empty) ~ .animation-timeline-rows:empty {\n  flex-grow: 0;\n}\n\n.animation-timeline-buffer:not(:empty) ~ .animation-timeline-rows:empty ~ .animation-timeline-rows-hint {\n  font-size: 14px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-left: 150px;\n  padding: 10px;\n}\n\n.toolbar.animation-controls-toolbar {\n  flex: 0 0 auto;\n}\n\n.animation-node-row.animation-node-selected {\n  background-color: var(--color-background-hover-overlay);\n}\n\n.animation-node-selected > .animation-node-description {\n  background-color: var(--color-background-elevation-2);\n}\n\n.animation-buffer-preview {\n  height: 40px;\n  margin: 4px 2px;\n  background-color: var(--color-background-elevation-1);\n  border: 1px solid transparent;\n  border-radius: 2px;\n  flex: 1 1;\n  padding: 4px;\n  max-width: 100px;\n  animation: newGroupAnim 200ms;\n  position: relative;\n}\n\n.animation-buffer-preview-animation {\n  width: 100%;\n  height: 100%;\n  border-radius: 2px 0 0 2px;\n  position: absolute;\n  top: 0;\n  left: 0;\n  background: var(--color-background-elevation-2);\n  opacity: 0%;\n  border-right: 1px solid var(--color-details-hairline);\n  cursor: pointer;\n}\n\n.animation-buffer-preview:focus-visible {\n  outline: -webkit-focus-ring-color auto 5px;\n}\n\n.animation-buffer-preview:not(.selected):focus-visible,\n.animation-buffer-preview:not(.selected):hover {\n  background-color: var(--color-background-elevation-2);\n}\n\n.animation-buffer-preview.selected {\n  background-color: var(--legacy-selection-bg-color);\n}\n\n.animation-paused {\n  align-items: center;\n  justify-content: center;\n  background-color: hsl(0deg 0% 70% / 50%); /* stylelint-disable-line plugin/use_theme_colors */\n  /* See: crbug.com/1152736 for color variable migration. */\n  display: none;\n}\n\n.animation-paused::before,\n.animation-paused::after {\n  content: '';\n  background: var(--color-background);\n  width: 7px;\n  height: 20px;\n  border-radius: 2px;\n  margin: 2px;\n  border: 1px solid var(--color-details-hairline);\n}\n\n.animation-buffer-preview.paused .animation-paused {\n  display: flex;\n}\n\n.animation-buffer-preview > svg > line {\n  stroke-width: 1px;\n}\n\n.animation-buffer-preview.selected > svg > line {\n  stroke: var(--color-background) !important; /* stylelint-disable-line declaration-no-important */\n}\n\n@keyframes newGroupAnim {\n  from {\n    clip-path: polygon(0% 0%, 0% 100%, 0% 100%, 0% 0%);\n  }\n\n  to {\n    clip-path: polygon(0% 0%, 0% 100%, 100% 100%, 100% 0%);\n  }\n}\n\n.animation-playback-rate-control {\n  margin: 4px 0 4px 2px;\n  display: flex;\n  width: 120px;\n}\n\n.animation-playback-rate-button {\n  border: 1px solid var(--color-details-hairline);\n  color: var(--color-text-primary);\n  display: inline-block;\n  margin-right: -1px;\n  padding: 1px 4px;\n  background: var(--color-background);\n  flex: 1 0 auto;\n  text-align: center;\n  cursor: pointer;\n}\n\n.animation-playback-rate-button:first-child {\n  border-radius: 4px 0 0 4px;\n}\n\n.animation-playback-rate-button:last-child {\n  border-radius: 0 4px 4px 0;\n}\n\n.animation-playback-rate-button.selected {\n  color: var(--legacy-selection-fg-color);\n  background-color: var(--legacy-selection-bg-color);\n  border-color: var(--legacy-selection-bg-color);\n  z-index: 1;\n}\n\n.animation-playback-rate-button.selected:focus-visible {\n  color: var(--color-text-primary);\n}\n\n.animation-playback-rate-button:focus-visible {\n  background-color: var(--legacy-focus-bg-color);\n}\n\n.animation-playback-rate-button:not(.selected):hover {\n  background: var(--color-background-elevation-2);\n}\n\n.animation-remove-button {\n  position: absolute;\n  top: -3px;\n  right: -3px;\n  background: var(--color-text-secondary);\n  border-radius: 12px;\n  height: 16px;\n  width: 16px;\n  align-items: center;\n  font-size: 10px;\n  justify-content: center;\n  box-shadow: 0 1px 4px 0 var(--color-background-highlight);\n  z-index: 100;\n  display: none;\n  cursor: pointer;\n  font-weight: 700;\n  color: var(--color-background);\n}\n\n.animation-remove-button:hover {\n  background: var(--color-text-primary);\n}\n\n.animation-buffer-preview:hover .animation-remove-button {\n  display: flex;\n}\n\n@media (forced-colors: active) {\n  .animation-playback-rate-button.selected,\n  .animation-playback-rate-button.selected:first-child,\n  .animation-playback-rate-button.selected:first-child:focus-visible,\n  .animation-playback-rate-button:focus-visible {\n    forced-color-adjust: none;\n    color: HighlightText;\n    background-color: Highlight;\n  }\n\n  .animation-node-description:focus-visible {\n    background-color: var(--color-background);\n    forced-color-adjust: none;\n  }\n\n  .monospace {\n    forced-color-adjust: auto;\n  }\n}\n\n/*# sourceURL=panels/animation/animationTimeline.css */");