import { createFrame, createErrorFrame } from './frameGenerator';

const COMPLEXITY = {
    ACCESS: { time: 'O(log N)', space: 'O(1)' }, // average for BST
    SEARCH: { time: 'O(log N)', space: 'O(1)' },
    TRAVERSE: { time: 'O(N)', space: 'O(N)' } // O(N) space for implicit call stack
};

function generateId() {
    return 'node-' + Math.random().toString(36).substr(2, 9);
}

// -----------------------------------------
// REUSABLE CALCULATOR FOR TREE LEVELS (X,Y bounds mapping for SVG layout)
// -----------------------------------------
// Left children go -X, right children go +X based on their depth to prevent overlap
function recalculatePositions(nodes, rootId) {
    if (!rootId) return [];

    const newNodes = JSON.parse(JSON.stringify(nodes));
    // Determine tree height and map positions using a BFS/Level-order approach
    const maxLevel = getMaxLevel(newNodes, rootId);

    // We assume an abstract rendering box. 
    // X goes from -100 to 100 based on relative splits.
    const placeNode = (id, level, x, y) => {
        if (!id) return;
        const index = newNodes.findIndex(n => n.id === id);
        if (index === -1) return;

        newNodes[index].level = level;
        newNodes[index].x = x;
        newNodes[index].y = y;

        // Depth level dictates X-spread to avoid overlapping paths
        // Higher level (closer to leaves) -> smaller spread
        const horizontalSpread = 100 / Math.pow(2, level);

        placeNode(newNodes[index].left, level + 1, x - horizontalSpread, y + 60);
        placeNode(newNodes[index].right, level + 1, x + horizontalSpread, y + 60);
    };

    placeNode(rootId, 1, 0, 0);
    return newNodes;
}

function getMaxLevel(nodes, id, currentLevel = 1) {
    if (!id) return currentLevel - 1;
    const node = nodes.find(n => n.id === id);
    if (!node) return currentLevel - 1;

    const leftLevel = getMaxLevel(nodes, node.left, currentLevel + 1);
    const rightLevel = getMaxLevel(nodes, node.right, currentLevel + 1);

    return Math.max(leftLevel, rightLevel);
}


// -----------------------------------------
// INSERT ALGORITHM (BST)
// -----------------------------------------
export function bstInsert(nodes, root, valueStr) {
    const value = parseInt(valueStr, 10);
    if (isNaN(value)) return [createErrorFrame(nodes, 'Value must be a valid number', -1, { root })];

    let newNodes = JSON.parse(JSON.stringify(nodes));
    const newNode = { id: generateId(), value, left: null, right: null, x: 0, y: 0, level: 1 };
    const frames = [];
    let ops = 0;

    // EMPTY TREE
    if (!root) {
        newNodes = [newNode];
        frames.push(createFrame(newNodes, 'insert', `Inserted root node ${value}`, [newNode.id], { root: newNode.id, current: newNode.id, level: 1 }, { ...COMPLEXITY.ACCESS, operations: 1 }));
        return frames;
    }

    let currentId = root;
    let level = 1;

    while (currentId !== null) {
        ops++;
        const currentIndex = newNodes.findIndex(n => n.id === currentId);
        const current = newNodes[currentIndex];

        frames.push(createFrame(recalculatePositions(newNodes, root), 'compare', `Comparing ${value} with ${current.value}`, [currentId], { root, current: currentId, level }, { ...COMPLEXITY.ACCESS, operations: ops }));

        if (value === current.value) {
            return [createErrorFrame(recalculatePositions(newNodes, root), `Value ${value} already exists in BST`, currentId, { root })];
        }

        if (value < current.value) {
            frames.push(createFrame(recalculatePositions(newNodes, root), 'compare', `${value} < ${current.value}, going Left.`, [currentId], { root, current: currentId, level }, { ...COMPLEXITY.ACCESS, operations: ops }));
            if (current.left === null) {
                current.left = newNode.id;
                newNodes.push(newNode);
                newNodes = recalculatePositions(newNodes, root);
                ops++;
                frames.push(createFrame(newNodes, 'insert', `Inserted ${value} as Left Child of ${current.value}`, [newNode.id], { root, current: newNode.id, level: level + 1 }, { ...COMPLEXITY.ACCESS, operations: ops }));
                return frames;
            } else {
                currentId = current.left;
            }
        } else {
            frames.push(createFrame(recalculatePositions(newNodes, root), 'compare', `${value} > ${current.value}, going Right.`, [currentId], { root, current: currentId, level }, { ...COMPLEXITY.ACCESS, operations: ops }));
            if (current.right === null) {
                current.right = newNode.id;
                newNodes.push(newNode);
                newNodes = recalculatePositions(newNodes, root);
                ops++;
                frames.push(createFrame(newNodes, 'insert', `Inserted ${value} as Right Child of ${current.value}`, [newNode.id], { root, current: newNode.id, level: level + 1 }, { ...COMPLEXITY.ACCESS, operations: ops }));
                return frames;
            } else {
                currentId = current.right;
            }
        }
        level++;
    }

    return frames;
}

// -----------------------------------------
// SEARCH ALGORITHM (BST)
// -----------------------------------------
export function bstSearch(nodes, root, valueStr) {
    if (!root) return [createErrorFrame(nodes, 'Tree is empty', -1, { root })];

    const value = parseInt(valueStr, 10);
    if (isNaN(value)) return [createErrorFrame(nodes, 'Search value must be a valid number', -1, { root })];

    const positionedNodes = recalculatePositions(nodes, root);
    const frames = [];
    let currentId = root;
    let ops = 0;
    let level = 1;

    while (currentId !== null) {
        ops++;
        const current = positionedNodes.find(n => n.id === currentId);
        if (!current) break;

        frames.push(createFrame(positionedNodes, 'compare', `Comparing ${value} with ${current.value}`, [currentId], { root, current: currentId, level }, { ...COMPLEXITY.SEARCH, operations: ops }));

        if (value === current.value) {
            frames.push(createFrame(positionedNodes, 'found', `Target ${value} found in BST!`, [currentId], { root, current: currentId, level }, { ...COMPLEXITY.SEARCH, operations: ops }));
            return frames;
        }

        if (value < current.value) {
            frames.push(createFrame(positionedNodes, 'compare', `${value} < ${current.value}, searching Left.`, [currentId], { root, current: currentId, level }, { ...COMPLEXITY.SEARCH, operations: ops }));
            currentId = current.left;
        } else {
            frames.push(createFrame(positionedNodes, 'compare', `${value} > ${current.value}, searching Right.`, [currentId], { root, current: currentId, level }, { ...COMPLEXITY.SEARCH, operations: ops }));
            currentId = current.right;
        }
        level++;
    }

    frames.push(createFrame(positionedNodes, 'idle', `Target ${value} not found`, [], { root, current: null, level: -1 }, { ...COMPLEXITY.SEARCH, operations: ops }));
    return frames;
}

// -----------------------------------------
// TRAVERSALS (Inorder, Preorder, Postorder)
// -----------------------------------------
export function bstTraverse(nodes, root, type = 'inorder') {
    if (!root) return [createErrorFrame(nodes, 'Tree is empty', -1, { root })];

    const positionedNodes = recalculatePositions(nodes, root);
    const frames = [];
    let ops = 0;
    const visited = [];

    function traverse(nodeId) {
        if (!nodeId) return;
        const current = positionedNodes.find(n => n.id === nodeId);
        if (!current) return;

        ops++;
        frames.push(createFrame(positionedNodes, 'compare', `Visiting Node ${current.value}`, [nodeId, ...visited], { root, current: nodeId, traversal: type }, { ...COMPLEXITY.TRAVERSE, operations: ops }));

        if (type === 'preorder') {
            visited.push(nodeId);
            frames.push(createFrame(positionedNodes, 'target', `Processed Node ${current.value} (Pre-order)`, [...visited], { root, current: nodeId, traversal: type }, { ...COMPLEXITY.TRAVERSE, operations: ops }));
        }

        traverse(current.left);

        if (type === 'inorder') {
            visited.push(nodeId);
            frames.push(createFrame(positionedNodes, 'target', `Processed Node ${current.value} (In-order)`, [...visited], { root, current: nodeId, traversal: type }, { ...COMPLEXITY.TRAVERSE, operations: ops }));
        }

        traverse(current.right);

        if (type === 'postorder') {
            visited.push(nodeId);
            frames.push(createFrame(positionedNodes, 'target', `Processed Node ${current.value} (Post-order)`, [...visited], { root, current: nodeId, traversal: type }, { ...COMPLEXITY.TRAVERSE, operations: ops }));
        }
    }

    traverse(root);
    frames.push(createFrame(positionedNodes, 'idle', `Completed ${type} traversal`, visited, { root, current: null, traversal: type }, { ...COMPLEXITY.TRAVERSE, operations: ops }));
    return frames;
}
