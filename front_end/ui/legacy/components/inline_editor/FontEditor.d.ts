import * as UI from '../../legacy.js';
export declare class FontEditor extends UI.Widget.VBox {
    private readonly selectedNode;
    private readonly propertyMap;
    private readonly fontSelectorSection;
    private fontSelectors;
    private fontsList;
    constructor(propertyMap: Map<string, string>);
    private createFontSelectorSection;
    private createFontsList;
    private splitComputedFontArray;
    private createFontSelector;
    private deleteFontSelector;
    private updateFontSelectorList;
    private getPropertyInfo;
    private createSelector;
    private onFontSelectorChanged;
    private updatePropertyValue;
    private resizePopout;
}
export declare enum Events {
    FontChanged = "FontChanged",
    FontEditorResized = "FontEditorResized"
}
