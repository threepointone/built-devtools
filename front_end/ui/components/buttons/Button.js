// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as LitHtml from '../../lit-html/lit-html.js';
import * as ComponentHelpers from '../helpers/helpers.js';
import * as IconButton from '../icon_button/icon_button.js';
import buttonStyles from './button.css.js';
export class Button extends HTMLElement {
    static litTagName = LitHtml.literal `devtools-button`;
    shadow = this.attachShadow({ mode: 'open' });
    boundRender = this.render.bind(this);
    props = {};
    constructor() {
        super();
        this.setAttribute('role', 'button');
    }
    /**
     * Perfer using the .data= setter instead of setting the individual properties
     * for increased type-safety.
     */
    set data(data) {
        this.props.variant = data.variant;
        this.props.iconUrl = data.iconUrl;
        ComponentHelpers.ScheduledRender.scheduleRender(this, this.boundRender);
    }
    set iconUrl(iconUrl) {
        this.props.iconUrl = iconUrl;
        ComponentHelpers.ScheduledRender.scheduleRender(this, this.boundRender);
    }
    set variant(variant) {
        this.props.variant = variant;
        ComponentHelpers.ScheduledRender.scheduleRender(this, this.boundRender);
    }
    connectedCallback() {
        this.shadow.adoptedStyleSheets = [buttonStyles];
        ComponentHelpers.ScheduledRender.scheduleRender(this, this.boundRender);
    }
    render() {
        if (!this.props.variant) {
            throw new Error('Button requires a variant to be defined');
        }
        const classes = {
            primary: this.props.variant === "primary" /* PRIMARY */,
            secondary: this.props.variant === "secondary" /* SECONDARY */,
            'with-icon': Boolean(this.props.iconUrl),
        };
        // clang-format off
        LitHtml.render(LitHtml.html `
        <button class=${LitHtml.Directives.classMap(classes)}>
          ${this.props.iconUrl ? LitHtml.html `<${IconButton.Icon.Icon.litTagName}
            .data=${{
            iconPath: this.props.iconUrl,
            color: 'var(--color-background)',
        }}
          >
          </${IconButton.Icon.Icon.litTagName}>` : ''}
          <slot></slot>
        </button>
      `, this.shadow);
        // clang-format on
    }
}
ComponentHelpers.CustomElements.defineComponent('devtools-button', Button);
//# sourceMappingURL=Button.js.map