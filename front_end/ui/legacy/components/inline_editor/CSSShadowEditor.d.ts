import * as UI from '../../legacy.js';
import type { CSSShadowModel } from './CSSShadowModel.js';
export declare class CSSShadowEditor extends UI.Widget.VBox {
    private readonly typeField;
    private readonly outsetButton;
    private readonly insetButton;
    private xInput;
    private yInput;
    private xySlider;
    private halfCanvasSize;
    private readonly innerCanvasSize;
    private blurInput;
    private blurSlider;
    private readonly spreadField;
    private spreadInput;
    private spreadSlider;
    private model;
    private canvasOrigin;
    private changedElement?;
    constructor();
    private createTextInput;
    private createSlider;
    wasShown(): void;
    setModel(model: CSSShadowModel): void;
    private updateUI;
    private updateButtons;
    private updateCanvas;
    private onButtonClick;
    private handleValueModification;
    private onTextInput;
    private onTextBlur;
    private onSliderInput;
    private dragStart;
    private dragMove;
    private onCanvasBlur;
    private onCanvasArrowKey;
    private constrainPoint;
    private snapToClosestDirection;
    private sliderThumbPosition;
}
export declare enum Events {
    ShadowChanged = "ShadowChanged"
}
