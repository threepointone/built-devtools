// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as EmulationModel from '../../../models/emulation/emulation.js';
import * as ComponentHelpers from '../../../ui/components/helpers/helpers.js';
import * as LitHtml from '../../../ui/lit-html/lit-html.js';
class SizeChangedEvent extends Event {
    size;
    constructor(size) {
        super('sizechanged');
        this.size = size;
    }
}
export class SizeInputElement extends HTMLElement {
    #root = this.attachShadow({ mode: 'open' });
    #disabled = false;
    #size = '0';
    #placeholder = '';
    #title;
    static litTagName = LitHtml.literal `device-mode-emulation-size-input`;
    constructor(title) {
        super();
        this.#title = title;
    }
    connectedCallback() {
        this.render();
    }
    set disabled(disabled) {
        this.#disabled = disabled;
        this.render();
    }
    set size(size) {
        this.#size = size;
        this.render();
    }
    set placeholder(placeholder) {
        this.#placeholder = placeholder;
        this.render();
    }
    render() {
        LitHtml.render(
        // Since the emulation code runs in a different frame, we can't
        // use constructed stylesheets (they are disallowed cross-frame).
        // For now, use an inline style tag and later we can refactor this
        // to use proper constructed stylesheets, when the code runs
        // in the correct frame context.
        // eslint-disable-next-line rulesdir/ban_style_tags_in_lit_html
        LitHtml.html `
      <style>
        input {
          /*
           * 4 characters for the maximum size of the value,
           * 2 characters for the width of the step-buttons,
           * 2 pixels padding between the characters and the
           * step-buttons.
           */
          width: calc(4ch + 2ch + 2px);
          max-height: 18px;
          margin: 0 2px;
          text-align: center;
        }

        input:disabled {
          background: transparent;
          user-select: none;
          opacity: 60%;
        }

        input:focus::-webkit-input-placeholder {
          color: transparent;
        }
      </style>
      <input type="number"
             max=${EmulationModel.DeviceModeModel.MaxDeviceSize}
             min=${EmulationModel.DeviceModeModel.MinDeviceSize}
             maxlength="4"
             title=${this.#title}
             placeholder=${this.#placeholder}
             ?disabled=${this.#disabled}
             .value=${this.#size}
             @change=${this.fireSizeChange} />
    `, this.#root, { host: this });
    }
    fireSizeChange(event) {
        this.dispatchEvent(new SizeChangedEvent(Number(event.target.value)));
    }
}
ComponentHelpers.CustomElements.defineComponent('device-mode-emulation-size-input', SizeInputElement);
//# sourceMappingURL=DeviceSizeInputElement.js.map