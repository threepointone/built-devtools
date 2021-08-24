// Copyright 2019 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import cssOverviewStyles from './cssOverview.css.js';
import * as Host from '../../core/host/host.js';
import * as SDK from '../../core/sdk/sdk.js';
import * as UI from '../../ui/legacy/legacy.js';
import { CSSOverviewCompletedView } from './CSSOverviewCompletedView.js';
import { Events, OverviewController } from './CSSOverviewController.js';
import { CSSOverviewModel } from './CSSOverviewModel.js';
import { CSSOverviewProcessingView } from './CSSOverviewProcessingView.js';
import { CSSOverviewStartView } from './CSSOverviewStartView.js';
// eslint-disable-next-line @typescript-eslint/naming-convention
let CSSOverviewPanelInstance;
export class CSSOverviewPanel extends UI.Panel.Panel {
    model;
    controller;
    startView;
    processingView;
    completedView;
    backgroundColors;
    textColors;
    fillColors;
    borderColors;
    fontInfo;
    mediaQueries;
    unusedDeclarations;
    elementCount;
    cancelled;
    globalStyleStats;
    textColorContrastIssues;
    constructor() {
        super('css_overview');
        this.element.classList.add('css-overview-panel');
        const [model] = SDK.TargetManager.TargetManager.instance().models(CSSOverviewModel);
        this.model = model;
        this.controller = new OverviewController();
        this.startView = new CSSOverviewStartView(this.controller);
        this.processingView = new CSSOverviewProcessingView(this.controller);
        this.completedView = new CSSOverviewCompletedView(this.controller, model.target());
        this.controller.addEventListener(Events.RequestOverviewStart, _event => {
            Host.userMetrics.actionTaken(Host.UserMetrics.Action.CaptureCssOverviewClicked);
            this.startOverview();
        }, this);
        this.controller.addEventListener(Events.RequestOverviewCancel, this.cancelOverview, this);
        this.controller.addEventListener(Events.OverviewCompleted, this.overviewCompleted, this);
        this.controller.addEventListener(Events.Reset, this.reset, this);
        this.controller.addEventListener(Events.RequestNodeHighlight, this.requestNodeHighlight, this);
        this.reset();
    }
    static instance() {
        if (!CSSOverviewPanelInstance) {
            CSSOverviewPanelInstance = new CSSOverviewPanel();
        }
        return CSSOverviewPanelInstance;
    }
    reset() {
        this.backgroundColors = new Map();
        this.textColors = new Map();
        this.fillColors = new Map();
        this.borderColors = new Map();
        this.fontInfo = new Map();
        this.mediaQueries = new Map();
        this.unusedDeclarations = new Map();
        this.elementCount = 0;
        this.cancelled = false;
        this.globalStyleStats = {
            styleRules: 0,
            inlineStyles: 0,
            externalSheets: 0,
            stats: {
                // Simple.
                type: 0,
                class: 0,
                id: 0,
                universal: 0,
                attribute: 0,
                // Non-simple.
                nonSimple: 0,
            },
        };
        this.renderInitialView();
    }
    requestNodeHighlight(evt) {
        this.model.highlightNode(evt.data);
    }
    renderInitialView() {
        this.processingView.hideWidget();
        this.completedView.hideWidget();
        this.startView.show(this.contentElement);
    }
    renderOverviewStartedView() {
        this.startView.hideWidget();
        this.completedView.hideWidget();
        this.processingView.show(this.contentElement);
    }
    renderOverviewCompletedView() {
        this.startView.hideWidget();
        this.processingView.hideWidget();
        this.completedView.show(this.contentElement);
        this.completedView.setOverviewData({
            backgroundColors: this.backgroundColors,
            textColors: this.textColors,
            textColorContrastIssues: this.textColorContrastIssues,
            fillColors: this.fillColors,
            borderColors: this.borderColors,
            globalStyleStats: this.globalStyleStats,
            fontInfo: this.fontInfo,
            elementCount: this.elementCount,
            mediaQueries: this.mediaQueries,
            unusedDeclarations: this.unusedDeclarations,
        });
    }
    async startOverview() {
        this.renderOverviewStartedView();
        const [globalStyleStats, { elementCount, backgroundColors, textColors, textColorContrastIssues, fillColors, borderColors, fontInfo, unusedDeclarations }, mediaQueries] = await Promise.all([
            this.model.getGlobalStylesheetStats(),
            this.model.getNodeStyleStats(),
            this.model.getMediaQueries(),
        ]);
        if (elementCount) {
            this.elementCount = elementCount;
        }
        if (globalStyleStats) {
            this.globalStyleStats = globalStyleStats;
        }
        if (mediaQueries) {
            this.mediaQueries = mediaQueries;
        }
        if (backgroundColors) {
            this.backgroundColors = backgroundColors;
        }
        if (textColors) {
            this.textColors = textColors;
        }
        if (textColorContrastIssues) {
            this.textColorContrastIssues = textColorContrastIssues;
        }
        if (fillColors) {
            this.fillColors = fillColors;
        }
        if (borderColors) {
            this.borderColors = borderColors;
        }
        if (fontInfo) {
            this.fontInfo = fontInfo;
        }
        if (unusedDeclarations) {
            this.unusedDeclarations = unusedDeclarations;
        }
        this.controller.dispatchEventToListeners(Events.OverviewCompleted);
    }
    getStyleValue(styles, name) {
        const item = styles.filter(style => style.name === name);
        if (!item.length) {
            return;
        }
        return item[0].value;
    }
    cancelOverview() {
        this.cancelled = true;
    }
    overviewCompleted() {
        this.renderOverviewCompletedView();
    }
    wasShown() {
        super.wasShown();
        this.registerCSSFiles([cssOverviewStyles]);
    }
}
//# sourceMappingURL=CSSOverviewPanel.js.map