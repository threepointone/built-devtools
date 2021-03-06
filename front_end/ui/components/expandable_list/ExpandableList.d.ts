import * as LitHtml from '../../lit-html/lit-html.js';
export interface ExpandableListData {
    rows: LitHtml.TemplateResult[];
}
export declare class ExpandableList extends HTMLElement {
    static readonly litTagName: import("../../lit-html/static.js").Static;
    private readonly shadow;
    private expanded;
    private rows;
    set data(data: ExpandableListData);
    private onArrowClick;
    connectedCallback(): void;
    private render;
}
declare global {
    interface HTMLElementTagNameMap {
        'devtools-expandable-list': ExpandableList;
    }
}
