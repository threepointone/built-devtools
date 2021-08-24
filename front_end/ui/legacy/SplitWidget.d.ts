import * as Common from '../../core/common/common.js';
import { Constraints } from './Geometry.js';
import { ToolbarButton } from './Toolbar.js';
import { Widget } from './Widget.js';
export declare class SplitWidget extends Widget {
    private sidebarElementInternal;
    private mainElement;
    private resizerElementInternal;
    private resizerElementSize;
    private readonly resizerWidget;
    private defaultSidebarWidth;
    private defaultSidebarHeight;
    private readonly constraintsInDip;
    private resizeStartSizeDIP;
    private setting;
    private totalSizeCSS;
    private totalSizeOtherDimensionCSS;
    private mainWidgetInternal;
    private sidebarWidgetInternal;
    private animationFrameHandle;
    private animationCallback;
    private showSidebarButtonTitle;
    private hideSidebarButtonTitle;
    private showHideSidebarButton;
    private isVerticalInternal;
    private sidebarMinimized;
    private detaching;
    private sidebarSizeDIP;
    private savedSidebarSizeDIP;
    private secondIsSidebar;
    private shouldSaveShowMode;
    private savedVerticalMainSize;
    private savedHorizontalMainSize;
    private showModeInternal;
    private savedShowMode;
    constructor(isVertical: boolean, secondIsSidebar: boolean, settingName?: string, defaultSidebarWidth?: number, defaultSidebarHeight?: number, constraintsInDip?: boolean);
    isVertical(): boolean;
    setVertical(isVertical: boolean): void;
    private innerSetVertical;
    private updateLayout;
    setMainWidget(widget: Widget): void;
    setSidebarWidget(widget: Widget): void;
    mainWidget(): Widget | null;
    sidebarWidget(): Widget | null;
    sidebarElement(): HTMLElement;
    childWasDetached(widget: Widget): void;
    isSidebarSecond(): boolean;
    enableShowModeSaving(): void;
    showMode(): string;
    setSecondIsSidebar(secondIsSidebar: boolean): void;
    sidebarSide(): string | null;
    resizerElement(): Element;
    hideMain(animate?: boolean): void;
    hideSidebar(animate?: boolean): void;
    setSidebarMinimized(minimized: boolean): void;
    isSidebarMinimized(): boolean;
    private showOnly;
    private showFinishedForTest;
    private removeAllLayoutProperties;
    showBoth(animate?: boolean): void;
    setResizable(resizable: boolean): void;
    isResizable(): boolean;
    setSidebarSize(size: number): void;
    sidebarSize(): number;
    /**
     * Returns total size in DIP.
     */
    private totalSizeDIP;
    private updateShowMode;
    private innerSetSidebarSizeDIP;
    private animate;
    private cancelAnimation;
    private applyConstraints;
    wasShown(): void;
    willHide(): void;
    onResize(): void;
    onLayout(): void;
    calculateConstraints(): Constraints;
    private onResizeStart;
    private onResizeUpdate;
    private onResizeEnd;
    hideDefaultResizer(noSplitter?: boolean): void;
    installResizer(resizerElement: Element): void;
    uninstallResizer(resizerElement: Element): void;
    hasCustomResizer(): boolean;
    toggleResizer(resizer: Element, on: boolean): void;
    private settingForOrientation;
    private preferredSidebarSizeDIP;
    private restoreSidebarSizeFromSettings;
    private restoreAndApplyShowModeFromSettings;
    private saveShowModeToSettings;
    private saveSetting;
    private forceUpdateLayout;
    private onZoomChanged;
    createShowHideSidebarButton(showTitle: Common.UIString.LocalizedString, hideTitle: Common.UIString.LocalizedString): ToolbarButton;
    private updateShowHideSidebarButton;
}
export declare enum ShowMode {
    Both = "Both",
    OnlyMain = "OnlyMain",
    OnlySidebar = "OnlySidebar"
}
export declare enum Events {
    SidebarSizeChanged = "SidebarSizeChanged",
    ShowModeChanged = "ShowModeChanged"
}
export interface SettingForOrientation {
    showMode: string;
    size: number;
}
