import { createFrame, createErrorFrame } from './frameGenerator';

const COMPLEXITY = {
    PUSH: { time: 'O(1)', space: 'O(1)' },
    POP: { time: 'O(1)', space: 'O(1)' },
    PEEK: { time: 'O(1)', space: 'O(1)' }
};

export function pushSimpleStack(stackData, value, maxSize = 10) {
    if (stackData.length >= maxSize) {
        return [createErrorFrame(stackData, `Stack Overflow! Maximum size ${maxSize} reached.`)];
    }
    const newStack = [...stackData, value];
    return [createFrame(newStack, 'push', `Pushed ${value} onto the stack`, [newStack.length - 1], { top: newStack.length - 1, value }, { ...COMPLEXITY.PUSH, operations: 1 })];
}

export function popSimpleStack(stackData) {
    if (stackData.length === 0) {
        return [createErrorFrame(stackData, `Stack Underflow! Stack is already empty.`)];
    }
    const newStack = [...stackData];
    const value = newStack.pop();
    return [createFrame(newStack, 'delete', `Popped ${value} from the stack`, [], { top: newStack.length - 1, poppedValue: value }, { ...COMPLEXITY.POP, operations: 1 })];
}

export function peekSimpleStack(stackData) {
    if (stackData.length === 0) {
        return [createErrorFrame(stackData, `Cannot peek an empty stack.`)];
    }
    const value = stackData[stackData.length - 1];
    return [createFrame(stackData, 'target', `Peeked top element: ${value}`, [stackData.length - 1], { top: stackData.length - 1, value }, { ...COMPLEXITY.PEEK, operations: 1 })];
}

// Double Stack Implementation (shared array conceptually)
// In our structureStore: stackData is the flat array. top1 starts at 0, top2 starts at maxSize - 1.
export function pushDoubleStack1(stackData, value, top1, top2, maxSize) {
    if (top1 >= top2 - 1) {
        return [createErrorFrame(stackData, `Stack 1 Overflow! Collision with Stack 2 at indices ${top1} and ${top2}.`, top1)];
    }
    const newStack = [...stackData];
    newStack[top1 + 1] = value;
    return [createFrame(newStack, 'push', `Pushed ${value} to Stack 1`, [top1 + 1], { top1: top1 + 1, top2, value }, { ...COMPLEXITY.PUSH, operations: 1 })];
}

export function pushDoubleStack2(stackData, value, top1, top2, maxSize) {
    if (top2 <= top1 + 1) {
        return [createErrorFrame(stackData, `Stack 2 Overflow! Collision with Stack 1 at indices ${top1} and ${top2}.`, top2)];
    }
    const newStack = [...stackData];
    newStack[top2 - 1] = value;
    return [createFrame(newStack, 'push', `Pushed ${value} to Stack 2`, [top2 - 1], { top1, top2: top2 - 1, value }, { ...COMPLEXITY.PUSH, operations: 1 })];
}

export function popDoubleStack1(stackData, top1, top2) {
    if (top1 < 0) {
        return [createErrorFrame(stackData, `Stack 1 Underflow! Stack 1 is empty.`, -1)];
    }
    const value = stackData[top1];
    const newStack = [...stackData];
    newStack[top1] = null; // clear it conceptually
    return [createFrame(newStack, 'delete', `Popped ${value} from Stack 1`, [], { top1: top1 - 1, top2, value }, { ...COMPLEXITY.POP, operations: 1 })];
}

export function popDoubleStack2(stackData, top1, top2, maxSize) {
    if (top2 >= maxSize) {
        return [createErrorFrame(stackData, `Stack 2 Underflow! Stack 2 is empty.`, maxSize)];
    }
    const value = stackData[top2];
    const newStack = [...stackData];
    newStack[top2] = null; // clear it conceptually
    return [createFrame(newStack, 'delete', `Popped ${value} from Stack 2`, [], { top1, top2: top2 + 1, value }, { ...COMPLEXITY.POP, operations: 1 })];
}
