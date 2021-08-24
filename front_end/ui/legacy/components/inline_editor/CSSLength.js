// Copyright (c) 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as ComponentHelpers from '../../../components/helpers/helpers.js';
import * as LitHtml from '../../../lit-html/lit-html.js';
import cssLengthStyles from './cssLength.css.js';
import { LENGTH_UNITS, parseText } from './CSSLengthUtils.js';
import { ValueChangedEvent } from './InlineEditorUtils.js';
const { render, html } = LitHtml;
export class DraggingFinishedEvent extends Event {
    constructor() {
        super('draggingfinished', {});
    }
}
const DefaultLength = {
    value: 0,
    unit: "px" /* PIXEL */,
};
export class CSSLength extends HTMLElement {
    static litTagName = LitHtml.literal `devtools-css-length`;
    shadow = this.attachShadow({ mode: 'open' });
    onDraggingValue = this.dragValue.bind(this);
    length = DefaultLength;
    isEditingSlot = false;
    isDraggingValue = false;
    currentMouseClientX = 0;
    set data(data) {
        const parsedResult = parseText(data.lengthText);
        if (!parsedResult) {
            return;
        }
        this.length = parsedResult;
        this.render();
    }
    connectedCallback() {
        this.shadow.adoptedStyleSheets = [cssLengthStyles];
    }
    onUnitChange(event) {
        this.length.unit = event.target.value;
        this.dispatchEvent(new ValueChangedEvent(`${this.length.value}${this.length.unit}`));
        this.render();
    }
    dragValue(event) {
        event.preventDefault();
        event.stopPropagation();
        this.isDraggingValue = true;
        let displacement = event.clientX - this.currentMouseClientX;
        this.currentMouseClientX = event.clientX;
        if (event.shiftKey) {
            displacement *= 10;
        }
        if (event.altKey) {
            displacement *= 0.1;
        }
        this.length.value = this.length.value + displacement;
        this.dispatchEvent(new ValueChangedEvent(`${this.length.value}${this.length.unit}`));
        this.render();
    }
    onValueMousedown(event) {
        this.currentMouseClientX = event.clientX;
        const targetDocument = event.target instanceof Node && event.target.ownerDocument;
        if (targetDocument) {
            targetDocument.addEventListener('mousemove', this.onDraggingValue, { capture: true });
            targetDocument.addEventListener('mouseup', (event) => {
                if (!this.isDraggingValue) {
                    return;
                }
                event.preventDefault();
                event.stopPropagation();
                targetDocument.removeEventListener('mousemove', this.onDraggingValue, { capture: true });
                this.isDraggingValue = false;
                this.dispatchEvent(new ValueChangedEvent(`${this.length.value}${this.length.unit}`));
            }, { once: true, capture: true });
        }
    }
    onValueMouseup() {
        if (!this.isDraggingValue) {
            this.isEditingSlot = true;
            this.render();
        }
    }
    onUnitMouseup(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    render() {
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        render(html `
      <div class="css-length">
        ${this.renderContent()}
      </div>
    `, this.shadow, {
            host: this,
        });
        // clang-format on
    }
    renderContent() {
        if (this.isEditingSlot) {
            return html `<slot></slot>`;
        }
        const options = LENGTH_UNITS.map(unit => {
            return html `
          <option value=${unit} .selected=${this.length.unit === unit}>${unit}</option>
        `;
        });
        // Disabled until https://crbug.com/1079231 is fixed.
        // clang-format off
        return html `
        <span class="value"
          @mousedown=${this.onValueMousedown}
          @mouseup=${this.onValueMouseup}
        >${this.length.value}</span><select class="unit ${this.length.unit}" @mouseup=${this.onUnitMouseup} @change=${this.onUnitChange}>
          ${options}
        </select>
      `;
        // clang-format on
    }
}
ComponentHelpers.CustomElements.defineComponent('devtools-css-length', CSSLength);
//# sourceMappingURL=CSSLength.js.map