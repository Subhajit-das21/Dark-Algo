import { createFrame, createErrorFrame } from './frameGenerator';

const COMPLEXITY = {
    ACCESS: { time: 'O(N)', space: 'O(1)' },
    HEAD_TAIL: { time: 'O(1)', space: 'O(1)' },
    TRAVERSE: { time: 'O(N)', space: 'O(1)' },
    SEARCH: { time: 'O(N)', space: 'O(1)' }
};

function generateId() {
    return 'node-' + Math.random().toString(36).substr(2, 9);
}

// -----------------------------------------
// REUSABLE TRAVERSAL GENERATOR
// -----------------------------------------
function performTraversalFrames(nodes, head, targetIdx, listType, actionName) {
    const frames = [];
    let currentId = head;
    let currentIdx = 0;
    let ops = 0;

    while (currentId !== null && currentIdx < targetIdx) {
        ops++;
        const node = nodes.find(n => n.id === currentId);
        if (!node) break;

        frames.push(createFrame(nodes, 'compare', `Traversing... at node (${node.value})`, [currentId], { head, currentId, index: currentIdx }, { ...COMPLEXITY.TRAVERSE, operations: ops }));

        currentId = node.next;
        currentIdx++;

        // Safety break for CLL
        if (listType === 'cll' && currentId === head) break;
    }

    return { frames, currentId, ops };
}

// -----------------------------------------
// MASTER INSERT ALGORITHM (SLL, DLL, CLL)
// -----------------------------------------
export function llInsert(nodes, head, tail, length, valueStr, type, indexStr, listType) {
    const value = parseInt(valueStr, 10);
    if (isNaN(value)) return [createErrorFrame(nodes, 'Value must be a valid number', -1, { head, tail, length })];

    const newNode = { id: generateId(), value, next: null, prev: null };
    let newNodes = [...nodes];
    const frames = [];
    let ops = 0;

    // EMPTY LIST CASE (Same for all)
    if (length === 0) {
        if (listType === 'cll') newNode.next = newNode.id; // Circular pointer to itself
        newNodes = [newNode];
        frames.push(createFrame(newNodes, 'insert', `Inserted ${value} into empty list`, [newNode.id], { head: newNode.id, tail: newNode.id, length: 1 }, { ...COMPLEXITY.HEAD_TAIL, operations: 1 }));
        return frames;
    }

    if (type === 'head') {
        const oldHeadIndex = newNodes.findIndex(n => n.id === head);
        const oldHead = newNodes[oldHeadIndex];

        newNode.next = head;

        if (listType === 'dll') {
            newNodes[oldHeadIndex] = { ...oldHead, prev: newNode.id };
        }

        if (listType === 'cll') {
            const tailIndex = newNodes.findIndex(n => n.id === tail);
            if (tailIndex !== -1) {
                newNodes[tailIndex] = { ...newNodes[tailIndex], next: newNode.id };
            }
        }

        newNodes.unshift(newNode);
        frames.push(createFrame(newNodes, 'insert', `Inserted ${value} at Head.`, [newNode.id], { head: newNode.id, tail, length: length + 1 }, { ...COMPLEXITY.HEAD_TAIL, operations: 1 }));
        return frames;
    }

    if (type === 'tail') {
        const oldTailIndex = newNodes.findIndex(n => n.id === tail);
        const oldTail = newNodes[oldTailIndex];

        oldTail.next = newNode.id;
        newNodes[oldTailIndex] = { ...oldTail, next: newNode.id };

        if (listType === 'dll') {
            newNode.prev = tail;
        }

        if (listType === 'cll') {
            newNode.next = head;
        }

        newNodes.push(newNode);
        frames.push(createFrame(newNodes, 'insert', `Inserted ${value} at Tail.`, [newNode.id], { head, tail: newNode.id, length: length + 1 }, { ...COMPLEXITY.HEAD_TAIL, operations: 1 }));
        return frames;
    }

    // POSITION INSERT
    const index = parseInt(indexStr, 10);
    if (isNaN(index) || index < 0 || index > length) return [createErrorFrame(nodes, `Invalid index. Range: 0-${length}`, -1, { head, tail, length })];
    if (index === 0) return llInsert(nodes, head, tail, length, valueStr, 'head', '', listType);
    if (index === length) return llInsert(nodes, head, tail, length, valueStr, 'tail', '', listType);

    const { frames: traverseFrames, currentId, ops: traverseOps } = performTraversalFrames(nodes, head, index - 1, listType, 'insert');
    frames.push(...traverseFrames);
    ops += traverseOps;

    const prevNodeIndex = newNodes.findIndex(n => n.id === currentId);
    const prevNode = newNodes[prevNodeIndex];

    const nextNodeId = prevNode.next;
    const nextNodeIndex = newNodes.findIndex(n => n.id === nextNodeId);
    const nextNode = newNodes[nextNodeIndex];

    newNode.next = nextNodeId;
    newNodes[prevNodeIndex] = { ...prevNode, next: newNode.id };

    if (listType === 'dll') {
        newNode.prev = currentId;
        newNodes[nextNodeIndex] = { ...nextNode, prev: newNode.id };
    }

    newNodes.splice(index, 0, newNode);
    ops++;

    frames.push(createFrame(newNodes, 'insert', `Inserted ${value} at index ${index}`, [newNode.id], { head, tail, length: length + 1 }, { ...COMPLEXITY.ACCESS, operations: ops }));
    return frames;
}

// -----------------------------------------
// MASTER DELETE ALGORITHM (SLL, DLL, CLL)
// -----------------------------------------
export function llDelete(nodes, head, tail, length, type, indexStr, listType) {
    if (length === 0) return [createErrorFrame(nodes, 'Cannot delete from an empty list', -1, { head, tail, length })];

    let newNodes = [...nodes];
    const frames = [];
    let ops = 0;

    if (length === 1) {
        frames.push(createFrame([], 'delete', `Deleted the only node in the list`, [], { head: null, tail: null, length: 0 }, { ...COMPLEXITY.HEAD_TAIL, operations: 1 }));
        return frames;
    }

    if (type === 'head') {
        const oldHeadIndex = newNodes.findIndex(n => n.id === head);
        const oldHead = newNodes[oldHeadIndex];
        const newHeadId = oldHead.next;

        if (listType === 'dll') {
            const newHeadIndex = newNodes.findIndex(n => n.id === newHeadId);
            if (newHeadIndex !== -1) newNodes[newHeadIndex] = { ...newNodes[newHeadIndex], prev: null };
        }

        if (listType === 'cll') {
            const tailIndex = newNodes.findIndex(n => n.id === tail);
            if (tailIndex !== -1) newNodes[tailIndex] = { ...newNodes[tailIndex], next: newHeadId };
        }

        newNodes = newNodes.filter(n => n.id !== head);
        frames.push(createFrame(newNodes, 'delete', `Deleted Head (${oldHead.value})`, [], { head: newHeadId, tail, length: length - 1 }, { ...COMPLEXITY.HEAD_TAIL, operations: 1 }));
        return frames;
    }

    if (type === 'tail') {
        const { frames: traverseFrames, currentId: newTailId, ops: traverseOps } = performTraversalFrames(nodes, head, length - 2, listType, 'delete');
        frames.push(...traverseFrames);
        ops += traverseOps;

        const newTailIndex = newNodes.findIndex(n => n.id === newTailId);

        let newNext = null;
        if (listType === 'cll') newNext = head;
        newNodes[newTailIndex] = { ...newNodes[newTailIndex], next: newNext };

        newNodes = newNodes.filter(n => n.id !== tail);
        ops++;

        frames.push(createFrame(newNodes, 'delete', `Deleted Tail`, [newTailId], { head, tail: newTailId, length: length - 1 }, { ...COMPLEXITY.ACCESS, operations: ops }));
        return frames;
    }

    // POSITION DELETE
    const index = parseInt(indexStr, 10);
    if (isNaN(index) || index < 0 || index >= length) return [createErrorFrame(nodes, `Invalid index. Range: 0-${length - 1}`, -1, { head, tail, length })];
    if (index === 0) return llDelete(nodes, head, tail, length, 'head', '', listType);
    if (index === length - 1) return llDelete(nodes, head, tail, length, 'tail', '', listType);

    const { frames: traverseFrames, currentId: prevId, ops: traverseOps } = performTraversalFrames(nodes, head, index - 1, listType, 'delete');
    frames.push(...traverseFrames);
    ops += traverseOps;

    const prevIndex = newNodes.findIndex(n => n.id === prevId);
    if (prevIndex === -1) return [createErrorFrame(nodes, `Corrupted traversal trace`, -1, { head, tail, length })];

    const prevNode = newNodes[prevIndex];
    const nodeToDeleteId = prevNode.next;
    const nodeToDelete = newNodes.find(n => n.id === nodeToDeleteId);
    const nextNodeId = nodeToDelete.next;

    newNodes[prevIndex] = { ...prevNode, next: nextNodeId };

    if (listType === 'dll') {
        const nextIndex = newNodes.findIndex(n => n.id === nextNodeId);
        if (nextIndex !== -1) newNodes[nextIndex] = { ...newNodes[nextIndex], prev: prevId };
    }

    newNodes = newNodes.filter(n => n.id !== nodeToDeleteId);
    ops++;

    frames.push(createFrame(newNodes, 'delete', `Deleted node at index ${index}`, [prevId], { head, tail, length: length - 1 }, { ...COMPLEXITY.ACCESS, operations: ops }));
    return frames;
}

// -----------------------------------------
// MASTER SEARCH ALGORITHM
// -----------------------------------------
export function llSearch(nodes, head, tail, length, valueStr, listType) {
    if (!head || nodes.length === 0) return [createErrorFrame(nodes, 'List is empty', -1, { head, tail, length })];

    const valueNum = parseInt(valueStr, 10);
    if (isNaN(valueNum)) return [createErrorFrame(nodes, 'Search value must be a number', -1, { head, tail, length })];

    const frames = [];
    let currentId = head;
    let ops = 0;

    while (currentId !== null) {
        ops++;
        const node = nodes.find(n => n.id === currentId);
        if (!node) break;

        frames.push(createFrame(nodes, 'compare', `Comparing ${node.value} with target ${valueNum}`, [currentId], { head, tail, length, currentId }, { ...COMPLEXITY.SEARCH, operations: ops }));

        if (node.value === valueNum) {
            frames.push(createFrame(nodes, 'found', `Target ${valueNum} found!`, [currentId], { head, tail, length, currentId }, { ...COMPLEXITY.SEARCH, operations: ops }));
            return frames;
        }

        currentId = node.next;
        if (listType === 'cll' && currentId === head) break; // Finished circle
    }

    frames.push(createFrame(nodes, 'idle', `Target ${valueNum} not found`, [], { head, tail, length }, { ...COMPLEXITY.SEARCH, operations: ops }));
    return frames;
}
