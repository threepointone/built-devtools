import * as UI from '../../legacy.js';
export declare class BezierEditor extends UI.Widget.VBox {
    private bezierInternal;
    private previewElement;
    private readonly previewOnion;
    private readonly outerContainer;
    private selectedCategory;
    private readonly presetsContainer;
    private readonly presetUI;
    private readonly presetCategories;
    private readonly curveUI;
    private readonly curve;
    private readonly header;
    private label;
    private mouseDownPosition?;
    private controlPosition?;
    private selectedPoint?;
    private previewAnimation?;
    constructor(bezier: UI.Geometry.CubicBezier);
    setBezier(bezier: UI.Geometry.CubicBezier): void;
    bezier(): UI.Geometry.CubicBezier;
    wasShown(): void;
    private onchange;
    private updateUI;
    private dragStart;
    private updateControlPosition;
    private dragMove;
    private dragEnd;
    private createCategory;
    private createPresetModifyIcon;
    private unselectPresets;
    private presetCategorySelected;
    private presetModifyClicked;
    private startPreviewAnimation;
}
export declare enum Events {
    BezierChanged = "BezierChanged"
}
export declare const Presets: {
    name: string;
    value: string;
}[][];
export interface PresetCategory {
    presets: {
        name: string;
        value: string;
    }[];
    icon: Element;
    presetIndex: number;
}
