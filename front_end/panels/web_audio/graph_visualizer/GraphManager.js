// Copyright 2019 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Common from '../../../core/common/common.js';
import { GraphView } from './GraphView.js';
// A class that maps each context to its corresponding graph.
// It controls which graph to render when the context is switched or updated.
export class GraphManager extends Common.ObjectWrapper.ObjectWrapper {
    graphMapByContextId;
    constructor() {
        super();
        this.graphMapByContextId = new Map();
    }
    createContext(contextId) {
        const graph = new GraphView(contextId);
        // When a graph has any update, request redraw.
        graph.addEventListener("ShouldRedraw" /* ShouldRedraw */, this.notifyShouldRedraw, this);
        this.graphMapByContextId.set(contextId, graph);
    }
    destroyContext(contextId) {
        if (!this.graphMapByContextId.has(contextId)) {
            return;
        }
        const graph = this.graphMapByContextId.get(contextId);
        if (!graph) {
            return;
        }
        graph.removeEventListener("ShouldRedraw" /* ShouldRedraw */, this.notifyShouldRedraw, this);
        this.graphMapByContextId.delete(contextId);
    }
    hasContext(contextId) {
        return this.graphMapByContextId.has(contextId);
    }
    clearGraphs() {
        this.graphMapByContextId.clear();
    }
    /**
     * Get graph by contextId.
     * If the user starts listening for WebAudio events after the page has been running a context for awhile,
     * the graph might be undefined.
     */
    getGraph(contextId) {
        return this.graphMapByContextId.get(contextId) || null;
    }
    notifyShouldRedraw(event) {
        this.dispatchEventToListeners("ShouldRedraw" /* ShouldRedraw */, event.data);
    }
}
//# sourceMappingURL=GraphManager.js.map