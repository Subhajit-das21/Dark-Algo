import { create } from 'zustand';

export const useStructureStore = create((set) => ({
    // Array State
    arrayData: [],

    // Stack State
    stackData: [], // Format: array of values
    top1: -1,      // Standard stack / Double Stack side 1
    top2: -1,      // Double Stack side 2
    maxStackSize: 10,

    // 2D Array State
    matrix: [],
    rows: 3,
    cols: 3,

    // Queue State
    queueData: [],
    queueFront: 0,
    queueRear: -1,
    maxQueueSize: 10,

    // Linked List State
    linkedListData: [], // array of node objects to maintain stable React Keys
    llHead: null,
    llTail: null,
    llLength: 0,

    // Tree State
    treeData: [], // [{ id, value, left: null, right: null, x, y, level }]
    treeRoot: null,

    // Graph State
    graphNodes: [], // [{ id, value, x, y }]
    graphEdges: [], // [{ source, target, weight }]
    isDirected: false,

    // Actions
    setArrayData: (data) => set({ arrayData: data }),
    setStackData: (data) => set({ stackData: data }),
    setTop1: (val) => set({ top1: val }),
    setTop2: (val) => set({ top2: typeof val === 'function' ? val() : val }),

    pushSimple: (value) => set((prev) => {
        if (prev.top1 >= prev.maxStackSize - 1) return prev; // overflow
        const newTop = prev.top1 + 1;
        const newStack = [...prev.stackData];
        newStack[newTop] = value;
        return { stackData: newStack, top1: newTop };
    }),

    popSimple: () => set((prev) => {
        if (prev.top1 === -1) return prev;
        const newStack = [...prev.stackData];
        newStack.pop();
        return { stackData: newStack, top1: prev.top1 - 1 };
    }),

    pushDouble1: (value) => set((prev) => {
        if (prev.top1 + 1 === prev.top2) return prev;
        const newTop1 = prev.top1 + 1;
        const newStack = [...prev.stackData];
        newStack[newTop1] = value;
        return { stackData: newStack, top1: newTop1 };
    }),

    pushDouble2: (value) => set((prev) => {
        if (prev.top2 - 1 === prev.top1) return prev;
        const newTop2 = prev.top2 - 1;
        const newStack = [...prev.stackData];
        newStack[newTop2] = value;
        return { stackData: newStack, top2: newTop2 };
    }),

    popDouble1: () => set((prev) => {
        if (prev.top1 === -1) return prev;
        const newStack = [...prev.stackData];
        newStack[prev.top1] = null;
        return { stackData: newStack, top1: prev.top1 - 1 };
    }),

    popDouble2: () => set((prev) => {
        if (prev.top2 === prev.maxStackSize) return prev;
        const newStack = [...prev.stackData];
        newStack[prev.top2] = null;
        return { stackData: newStack, top2: prev.top2 + 1 };
    }),

    resetStructure: () => set({
        arrayData: [],
        stackData: [],
        top1: -1,
        top2: -1,
        matrix: [],
        rows: 3,
        cols: 3,
        queueData: [],
        queueFront: 0,
        queueRear: -1,
        linkedListData: [],
        llHead: null,
        llTail: null,
        llLength: 0,
        treeData: [],
        treeRoot: null,
        graphNodes: [],
        graphEdges: [],
        isDirected: false
    }),

    resetArray: () => set({ arrayData: [] }),
    resetStack: () => set({ stackData: [], top1: -1, top2: -1 }),
    resetMatrix: () => set({ matrix: [] }),
    resetQueue: () => set({ queueData: [], queueFront: 0, queueRear: -1 }),
    resetLinkedList: () => set({ linkedListData: [], llHead: null, llTail: null, llLength: 0 }),
    resetTree: () => set({ treeData: [], treeRoot: null }),
    resetGraph: () => set({ graphNodes: [], graphEdges: [] }),

    setMaxStackSize: (size) => set({ maxStackSize: size }),
    setMaxQueueSize: (size) => set({ maxQueueSize: size }),

    setMatrix: (matrix) => set({ matrix }),
    setRows: (rows) => set({ rows }),
    setCols: (cols) => set({ cols }),

    // We will still pass data structures natively from algorithms to UI via frames.
    // For manual mutations, we will export atomic functional setters similar to stack.
    setQueueState: (partial) => set(partial),
    setLinkedListState: (partial) => set(partial),
    setTreeState: (partial) => set(partial),
    setGraphState: (partial) => set(partial),
}));
