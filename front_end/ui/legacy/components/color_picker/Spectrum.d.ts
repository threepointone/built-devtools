import * as Common from '../../../../core/common/common.js';
import * as UI from '../../legacy.js';
import type { ContrastInfo } from './ContrastInfo.js';
export declare class Spectrum extends UI.Widget.VBox {
    private colorElement;
    private colorDragElement;
    private dragX;
    private dragY;
    private colorPickerButton;
    private readonly swatch;
    private hueElement;
    private hueSlider;
    private readonly alphaElement;
    private alphaElementBackground;
    private alphaSlider;
    private displayContainer;
    private textValues;
    private textLabels;
    private hexContainer;
    private hexValue;
    private readonly contrastInfo;
    private contrastOverlay;
    private contrastDetails;
    private readonly contrastDetailsBackgroundColorPickedToggledBound;
    private readonly palettes;
    private readonly palettePanel;
    private palettePanelShowing;
    private readonly paletteSectionContainer;
    private paletteContainer;
    private shadesContainer;
    private readonly deleteIconToolbar;
    private readonly deleteButton;
    private readonly addColorToolbar;
    private readonly colorPickedBound;
    private hsv;
    private hueAlphaWidth;
    dragWidth: number;
    dragHeight: number;
    private colorDragElementHeight;
    slideHelperWidth: number;
    private numPaletteRowsShown;
    private selectedColorPalette;
    private customPaletteSetting;
    private colorOffset?;
    private closeButton?;
    private paletteContainerMutable?;
    private shadesCloseHandler?;
    private dragElement?;
    private dragHotSpotX?;
    private dragHotSpotY?;
    private originalFormat?;
    private colorNameInternal?;
    private colorStringInternal?;
    private colorFormat?;
    constructor(contrastInfo?: ContrastInfo | null);
    private dragStart;
    private contrastDetailsBackgroundColorPickedToggled;
    private contrastPanelExpanded;
    private updatePalettePanel;
    private togglePalettePanel;
    private onCloseBtnKeydown;
    private onSliderKeydown;
    /**
     * (Suppress warning about preventScroll)
     */
    private focusInternal;
    private createPaletteColor;
    private showPalette;
    private showLightnessShades;
    private slotIndexForEvent;
    private isDraggingToBin;
    private paletteDragStart;
    private paletteDrag;
    private paletteDragEnd;
    private loadPalettes;
    addPalette(palette: Palette): void;
    private createPreviewPaletteElement;
    private paletteSelected;
    private resizeForSelectedPalette;
    private paletteColorSelected;
    private onPaletteColorKeydown;
    private onShadeColorKeydown;
    private onAddColorMousedown;
    private onAddColorKeydown;
    private addColorToCustomPalette;
    private showPaletteColorContextMenu;
    private deletePaletteColors;
    setColor(color: Common.Color.Color, colorFormat: string): void;
    colorSelected(color: Common.Color.Color): void;
    private innerSetColor;
    private color;
    colorName(): string | undefined;
    colorString(): string;
    private updateHelperLocations;
    private updateInput;
    private updateUI;
    private formatViewSwitch;
    /**
     * If the pasted input is parsable as a color, applies it converting to the current user format
     */
    private pasted;
    private inputChanged;
    wasShown(): void;
    willHide(): void;
    private toggleColorPicker;
    private colorPicked;
}
export declare const ChangeSource: {
    Input: string;
    Model: string;
    Other: string;
};
export declare enum Events {
    ColorChanged = "ColorChanged",
    SizeChanged = "SizeChanged"
}
export declare class PaletteGenerator {
    private readonly callback;
    private readonly frequencyMap;
    constructor(callback: (arg0: Palette) => void);
    private frequencyComparator;
    private finish;
    private processStylesheet;
}
export declare const MaterialPalette: {
    title: string;
    mutable: boolean;
    matchUserFormat: boolean;
    colors: string[];
    colorNames: never[];
};
export declare class Swatch {
    private colorString;
    private swatchInnerElement;
    private swatchOverlayElement;
    private readonly swatchCopyIcon;
    constructor(parentElement: HTMLElement);
    setColor(color: Common.Color.Color, colorString?: string): void;
    private onCopyText;
    private onCopyIconMouseout;
}
export interface Palette {
    title: string;
    colors: string[];
    colorNames: string[];
    mutable: boolean;
    matchUserFormat?: boolean;
}
