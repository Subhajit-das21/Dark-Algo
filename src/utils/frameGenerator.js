/**
 * Standardizes the shape of execution frames.
 * Ensures UI gets deterministic semantic context for every step.
 */
export function createFrame(data, action, description, activeIndices = [], variables = {}, stats = {}) {
    return {
        data: [...data], // Clone to avoid mutation refs
        action,          // 'idle', 'compare', 'swap', 'insert', 'delete', 'error', 'found', 'target'
        description,
        activeIndices,   // e.g. [0, 1] for current pointers
        variables,       // e.g. { i: 0, j: 1, mid: 5 }
        stats,           // { time: 'O(N)', space: 'O(1)', operations: currentCount }
    };
}

export function createErrorFrame(data, description, errorIndex = -1, variables = {}) {
    return createFrame(data, 'error', description, [errorIndex], variables, { time: '-', space: '-', operations: 0 });
}
