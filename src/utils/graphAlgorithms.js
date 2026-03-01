import { createFrame, createErrorFrame } from './frameGenerator';

const COMPLEXITY = {
    BFS: { time: 'O(V + E)', space: 'O(V)' },
    DFS: { time: 'O(V + E)', space: 'O(V)' }
};

// -----------------------------------------
// GRAPH BFS
// -----------------------------------------
export function graphBFS(nodes, edges, startNodeId) {
    if (nodes.length === 0) return [createErrorFrame(nodes, 'Graph is empty', -1)];
    const startNode = nodes.find(n => n.id === startNodeId);
    if (!startNode) return [createErrorFrame(nodes, 'Start node not found', -1)];

    const frames = [];
    let ops = 0;

    const visited = new Set([startNodeId]);
    const queue = [startNodeId];
    const traversalOrder = [];
    const activeEdges = []; // Keep track of edges used in traversal

    frames.push(createFrame(nodes, 'compare', `Starting BFS from Node ${startNode.value}`, [startNodeId], { queue: [...queue], visited: Array.from(visited) }, { ...COMPLEXITY.BFS, operations: 1 }));

    while (queue.length > 0) {
        ops++;
        const currentId = queue.shift();
        traversalOrder.push(currentId);
        const current = nodes.find(n => n.id === currentId);

        frames.push(createFrame(nodes, 'target', `Processing Node ${current.value}`, [currentId], { queue: [...queue], visited: Array.from(visited), activeEdges: [...activeEdges] }, { ...COMPLEXITY.BFS, operations: ops }));

        // Find neighbors
        const neighbors = [];
        edges.forEach(e => {
            if (e.source === currentId) neighbors.push({ id: e.target, edgeId: e.id });
            // If undirected, we also check targets
            else if (e.target === currentId && !e.isDirected) neighbors.push({ id: e.source, edgeId: e.id });
        });

        for (const neighbor of neighbors) {
            ops++;
            const neighborNode = nodes.find(n => n.id === neighbor.id);
            frames.push(createFrame(nodes, 'compare', `Checking neighbor Node ${neighborNode.value}`, [currentId, neighbor.id], { queue: [...queue], visited: Array.from(visited), activeEdges: [...activeEdges, neighbor.edgeId] }, { ...COMPLEXITY.BFS, operations: ops }));

            if (!visited.has(neighbor.id)) {
                visited.add(neighbor.id);
                queue.push(neighbor.id);
                activeEdges.push(neighbor.edgeId);
                frames.push(createFrame(nodes, 'insert', `Added Node ${neighborNode.value} to queue`, [neighbor.id], { queue: [...queue], visited: Array.from(visited), activeEdges: [...activeEdges] }, { ...COMPLEXITY.BFS, operations: ops }));
            }
        }
    }

    frames.push(createFrame(nodes, 'idle', `BFS Completed`, traversalOrder, { queue: [], visited: Array.from(visited), activeEdges }, { ...COMPLEXITY.BFS, operations: ops }));
    return frames;
}

// -----------------------------------------
// GRAPH DFS
// -----------------------------------------
export function graphDFS(nodes, edges, startNodeId) {
    if (nodes.length === 0) return [createErrorFrame(nodes, 'Graph is empty', -1)];
    const startNode = nodes.find(n => n.id === startNodeId);
    if (!startNode) return [createErrorFrame(nodes, 'Start node not found', -1)];

    const frames = [];
    let ops = 0;

    const visited = new Set();
    const traversalOrder = [];
    const activeEdges = [];

    function dfs(currentId, incomingEdgeId) {
        visited.add(currentId);
        traversalOrder.push(currentId);
        if (incomingEdgeId) activeEdges.push(incomingEdgeId);

        const current = nodes.find(n => n.id === currentId);
        ops++;

        frames.push(createFrame(nodes, 'target', `Visiting Node ${current.value}`, [currentId], { visited: Array.from(visited), activeEdges: [...activeEdges] }, { ...COMPLEXITY.DFS, operations: ops }));

        const neighbors = [];
        edges.forEach(e => {
            if (e.source === currentId) neighbors.push({ id: e.target, edgeId: e.id });
            else if (e.target === currentId && !e.isDirected) neighbors.push({ id: e.source, edgeId: e.id });
        });

        for (const neighbor of neighbors) {
            ops++;
            const neighborNode = nodes.find(n => n.id === neighbor.id);
            frames.push(createFrame(nodes, 'compare', `Observing neighbor Node ${neighborNode.value}`, [currentId, neighbor.id], { visited: Array.from(visited), activeEdges: [...activeEdges, neighbor.edgeId] }, { ...COMPLEXITY.DFS, operations: ops }));

            if (!visited.has(neighbor.id)) {
                dfs(neighbor.id, neighbor.edgeId);

                ops++;
                frames.push(createFrame(nodes, 'compare', `Backtracking to Node ${current.value}`, [currentId], { visited: Array.from(visited), activeEdges: [...activeEdges] }, { ...COMPLEXITY.DFS, operations: ops }));
            }
        }
    }

    frames.push(createFrame(nodes, 'compare', `Starting DFS from Node ${startNode.value}`, [startNodeId], { visited: [], activeEdges: [] }, { ...COMPLEXITY.DFS, operations: 1 }));
    dfs(startNodeId, null);

    frames.push(createFrame(nodes, 'idle', `DFS Completed`, traversalOrder, { visited: Array.from(visited), activeEdges }, { ...COMPLEXITY.DFS, operations: ops }));
    return frames;
}
