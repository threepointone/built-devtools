// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as i18n from '../../core/i18n/i18n.js';
import * as Platform from '../../core/platform/platform.js';
import * as DataGrid from '../../ui/legacy/components/data_grid/data_grid.js';
import * as UI from '../../ui/legacy/legacy.js';
import { CHECKING, DOWNLOADING, IDLE, OBSOLETE, UNCACHED, UPDATEREADY } from './ApplicationCacheModel.js';
const UIStrings = {
    /**
    *@description Text in Application Cache Items View of the Application panel
    */
    appcache: 'AppCache',
    /**
    *@description Text to delete something
    */
    deleteString: 'Delete',
    /**
    *@description Text in Application Cache Items View of the Application panel
    */
    noApplicationCacheInformation: 'No Application Cache information available.',
    /**
    *@description Text to indicate the network connectivity is online
    */
    online: 'Online',
    /**
    *@description Text to indicate the network connectivity is offline
    */
    offline: 'Offline',
    /**
    *@description Text that refers to the resources of the web page
    */
    resource: 'Resource',
    /**
    *@description Text that refers to some types
    */
    typeString: 'Type',
    /**
    *@description Text for the size of something
    */
    sizeString: 'Size',
    /**
    *@description Text in Application Panel Sidebar of the Application panel
    */
    applicationCache: 'Application Cache',
};
const str_ = i18n.i18n.registerUIStrings('panels/application/ApplicationCacheItemsView.ts', UIStrings);
const i18nString = i18n.i18n.getLocalizedString.bind(undefined, str_);
export class ApplicationCacheItemsView extends UI.View.SimpleView {
    model;
    deleteButton;
    connectivityIcon;
    statusIcon;
    frameId;
    emptyWidget;
    nodeResources;
    viewDirty;
    status;
    manifest;
    creationTime;
    updateTime;
    size;
    resources;
    dataGrid;
    constructor(model, frameId) {
        super(i18nString(UIStrings.appcache));
        this.model = model;
        this.element.classList.add('storage-view', 'table');
        this.deleteButton = new UI.Toolbar.ToolbarButton(i18nString(UIStrings.deleteString), 'largeicon-delete');
        this.deleteButton.setVisible(false);
        this.deleteButton.addEventListener(UI.Toolbar.ToolbarButton.Events.Click, this.deleteButtonClicked, this);
        this.connectivityIcon = document.createElement('span', { is: 'dt-icon-label' });
        this.connectivityIcon.style.margin = '0 2px 0 5px';
        this.statusIcon = document.createElement('span', { is: 'dt-icon-label' });
        this.statusIcon.style.margin = '0 2px 0 5px';
        this.frameId = frameId;
        this.emptyWidget = new UI.EmptyWidget.EmptyWidget(i18nString(UIStrings.noApplicationCacheInformation));
        this.emptyWidget.show(this.element);
        this.markDirty();
        const status = this.model.frameManifestStatus(frameId);
        this.updateStatus(status);
        this.updateNetworkState(this.model.onLine);
        this.deleteButton.element.style.display = 'none';
        this.nodeResources = new WeakMap();
    }
    async toolbarItems() {
        return [
            this.deleteButton,
            new UI.Toolbar.ToolbarItem(this.connectivityIcon),
            new UI.Toolbar.ToolbarSeparator(),
            new UI.Toolbar.ToolbarItem(this.statusIcon),
        ];
    }
    wasShown() {
        this.maybeUpdate();
    }
    willHide() {
        this.deleteButton.setVisible(false);
    }
    maybeUpdate() {
        if (!this.isShowing() || !this.viewDirty) {
            return;
        }
        this.update();
        this.viewDirty = false;
    }
    markDirty() {
        this.viewDirty = true;
    }
    updateStatus(status) {
        const oldStatus = this.status;
        this.status = status;
        const statusInformation = new Map([
            // We should never have UNCACHED status, since we remove frames with UNCACHED application cache status from the tree.
            [UNCACHED, { type: 'smallicon-red-ball', text: 'UNCACHED' }],
            [IDLE, { type: 'smallicon-green-ball', text: 'IDLE' }],
            [CHECKING, { type: 'smallicon-orange-ball', text: 'CHECKING' }],
            [DOWNLOADING, { type: 'smallicon-orange-ball', text: 'DOWNLOADING' }],
            [UPDATEREADY, { type: 'smallicon-green-ball', text: 'UPDATEREADY' }],
            [OBSOLETE, { type: 'smallicon-red-ball', text: 'OBSOLETE' }],
        ]);
        const info = statusInformation.get(status) || statusInformation.get(UNCACHED);
        if (info) {
            this.statusIcon.type = info.type;
            this.statusIcon.textContent = info.text;
        }
        if (this.isShowing() && this.status === IDLE && (oldStatus === UPDATEREADY || !this.resources)) {
            this.markDirty();
        }
        this.maybeUpdate();
    }
    updateNetworkState(isNowOnline) {
        if (isNowOnline) {
            this.connectivityIcon.type = 'smallicon-green-ball';
            this.connectivityIcon.textContent = i18nString(UIStrings.online);
        }
        else {
            this.connectivityIcon.type = 'smallicon-red-ball';
            this.connectivityIcon.textContent = i18nString(UIStrings.offline);
        }
    }
    async update() {
        const applicationCache = await this.model.requestApplicationCache(this.frameId);
        if (!applicationCache || !applicationCache.manifestURL) {
            delete this.manifest;
            delete this.creationTime;
            delete this.updateTime;
            delete this.size;
            delete this.resources;
            this.emptyWidget.show(this.element);
            this.deleteButton.setVisible(false);
            if (this.dataGrid) {
                this.dataGrid.element.classList.add('hidden');
            }
            return;
        }
        // FIXME: are these variables needed anywhere else?
        this.manifest = applicationCache.manifestURL;
        this.creationTime = applicationCache.creationTime;
        this.updateTime = applicationCache.updateTime;
        this.size = applicationCache.size;
        this.resources = applicationCache.resources;
        if (!this.dataGrid) {
            this.createDataGrid();
        }
        this.populateDataGrid();
        if (this.dataGrid) {
            this.dataGrid.autoSizeColumns(20, 80);
            this.dataGrid.element.classList.remove('hidden');
        }
        this.emptyWidget.detach();
        this.deleteButton.setVisible(true);
        // FIXME: For Chrome, put creationTime and updateTime somewhere.
        // NOTE: localizedString has not yet been added.
        // i18nString("(%s) Created: %s Updated: %s", this.size, this.creationTime, this.updateTime);
    }
    createDataGrid() {
        const columns = [
            { id: 'resource', title: i18nString(UIStrings.resource), sort: DataGrid.DataGrid.Order.Ascending, sortable: true },
            { id: 'type', title: i18nString(UIStrings.typeString), sortable: true },
            { id: 'size', title: i18nString(UIStrings.sizeString), align: DataGrid.DataGrid.Align.Right, sortable: true },
        ];
        const parameters = {
            displayName: i18nString(UIStrings.applicationCache),
            columns,
            editCallback: undefined,
            deleteCallback: undefined,
            refreshCallback: undefined,
        };
        this.dataGrid = new DataGrid.DataGrid.DataGridImpl(parameters);
        this.dataGrid.setStriped(true);
        this.dataGrid.asWidget().show(this.element);
        this.dataGrid.addEventListener(DataGrid.DataGrid.Events.SortingChanged, this.populateDataGrid, this);
    }
    populateDataGrid() {
        if (!this.dataGrid) {
            return;
        }
        const selectedResource = (this.dataGrid.selectedNode ? this.nodeResources.get(this.dataGrid.selectedNode) : null) || null;
        const sortDirection = this.dataGrid.isSortOrderAscending() ? 1 : -1;
        function numberCompare(field, resource1, resource2) {
            return sortDirection * (resource1[field] - resource2[field]);
        }
        function localeCompare(field, resource1, resource2) {
            return sortDirection * resource1[field].localeCompare(resource2[field]);
        }
        let comparator = null;
        switch (this.dataGrid.sortColumnId()) {
            case 'resource':
                comparator = localeCompare.bind(null, 'url');
                break;
            case 'type':
                comparator = localeCompare.bind(null, 'type');
                break;
            case 'size':
                comparator = numberCompare.bind(null, 'size');
                break;
        }
        this.dataGrid.rootNode().removeChildren();
        if (!this.resources) {
            return;
        }
        if (comparator) {
            this.resources.sort(comparator);
        }
        let nodeToSelect;
        for (let i = 0; i < this.resources.length; ++i) {
            const resource = this.resources[i];
            const data = {
                resource: resource.url,
                type: resource.type,
                size: Platform.NumberUtilities.bytesToString(resource.size),
            };
            const node = new DataGrid.DataGrid.DataGridNode(data);
            this.nodeResources.set(node, resource);
            node.selectable = true;
            this.dataGrid.rootNode().appendChild(node);
            if (resource === selectedResource) {
                nodeToSelect = node;
                nodeToSelect.selected = true;
            }
        }
        if (!nodeToSelect && this.dataGrid.rootNode().children.length) {
            this.dataGrid.rootNode().children[0].selected = true;
        }
    }
    deleteButtonClicked(_event) {
        if (!this.dataGrid || !this.dataGrid.selectedNode) {
            return;
        }
        // FIXME: Delete Button semantics are not yet defined. (Delete a single, or all?)
        this.deleteCallback(this.dataGrid.selectedNode);
    }
    deleteCallback(_node) {
        // FIXME: Should we delete a single (selected) resource or all resources?
        // ProtocolClient.inspectorBackend.deleteCachedResource(...)
        // this.update();
    }
}
//# sourceMappingURL=ApplicationCacheItemsView.js.map