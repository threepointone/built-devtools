declare global {
    interface HTMLElementTagNameMap {
        'devtools-button': Button;
    }
}
export declare const enum Variant {
    PRIMARY = "primary",
    SECONDARY = "secondary"
}
export interface ButtonData {
    iconUrl?: string;
    variant?: Variant;
}
export interface ButtonDataWithVariant extends ButtonData {
    variant: Variant;
}
export declare class Button extends HTMLElement {
    static readonly litTagName: import("../../lit-html/static.js").Static;
    private readonly shadow;
    private readonly boundRender;
    private readonly props;
    constructor();
    /**
     * Perfer using the .data= setter instead of setting the individual properties
     * for increased type-safety.
     */
    set data(data: ButtonDataWithVariant);
    set iconUrl(iconUrl: string | undefined);
    set variant(variant: Variant);
    connectedCallback(): void;
    private render;
}
