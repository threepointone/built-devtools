import type * as Protocol from '../../generated/protocol.js';
export declare class CSSFontFace {
    private readonly fontFamily;
    private readonly fontVariationAxes;
    private readonly fontVariationAxesByTag;
    constructor(payload: Protocol.CSS.FontFace);
    getFontFamily(): string;
    getVariationAxisByTag(tag: string): Protocol.CSS.FontVariationAxis | undefined;
}
