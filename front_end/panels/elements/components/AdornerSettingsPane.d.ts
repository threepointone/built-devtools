import type { AdornerSettingsMap } from './AdornerManager.js';
export declare class AdornerSettingUpdatedEvent extends Event {
    data: {
        adornerName: string;
        isEnabledNow: boolean;
        newSettings: AdornerSettingsMap;
    };
    constructor(adornerName: string, isEnabledNow: boolean, newSettings: AdornerSettingsMap);
}
export interface AdornerSettingsPaneData {
    settings: Readonly<AdornerSettingsMap>;
}
export declare class AdornerSettingsPane extends HTMLElement {
    static readonly litTagName: import("../../../ui/lit-html/static.js").Static;
    private readonly shadow;
    private settings;
    connectedCallback(): void;
    set data(data: AdornerSettingsPaneData);
    show(): void;
    hide(): void;
    private onChange;
    private render;
}
declare global {
    interface HTMLElementTagNameMap {
        'devtools-adorner-settings-pane': AdornerSettingsPane;
    }
}
