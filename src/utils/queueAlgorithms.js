import { createFrame, createErrorFrame } from './frameGenerator';

const COMPLEXITY = {
    QUEUE_OP: { time: 'O(1)', space: 'O(1)' }
};

export function enqueue(queueData, front, rear, maxSize, value) {
    if (rear >= maxSize - 1) {
        return [createErrorFrame(queueData, `Queue Overflow! Cannot enqueue ${value}.`, rear, { front, rear, maxSize })];
    }

    const newQueue = [...queueData];
    const newRear = rear + 1;
    newQueue[newRear] = value;

    const newFront = front;

    return [
        createFrame(newQueue, 'push', `Enqueued ${value} at rear (${newRear})`, [newRear], { front: newFront, rear: newRear, maxSize }, { ...COMPLEXITY.QUEUE_OP, operations: 1 })
    ];
}

export function dequeue(queueData, front, rear, maxSize) {
    // If front passed rear, queue is empty.
    if (front > rear || rear === -1) {
        return [createErrorFrame(queueData, `Queue Underflow! Cannot dequeue.`, front, { front, rear, maxSize })];
    }

    const newQueue = [...queueData];
    const dequeuedValue = newQueue[front];
    newQueue[front] = null;

    const newFront = front + 1;

    return [
        createFrame(newQueue, 'pop', `Dequeued ${dequeuedValue} from front (${front})`, [front], { front: newFront, rear, maxSize }, { ...COMPLEXITY.QUEUE_OP, operations: 1 })
    ];
}

export function cqEnqueue(queueData, front, rear, maxSize, value) {
    let isEmpty = rear === -1;
    let isFull = !isEmpty && (rear + 1) % maxSize === front;

    if (isFull) {
        return [createErrorFrame(queueData, `Circular Queue Overflow! Cannot enqueue ${value}.`, rear, { front, rear, maxSize })];
    }

    const newQueue = [...queueData];

    const newRear = isEmpty ? 0 : (rear + 1) % maxSize;
    const newFront = isEmpty ? 0 : front;

    newQueue[newRear] = value;

    return [
        createFrame(newQueue, 'push', `Enqueued ${value} at rear (${newRear})`, [newRear], { front: newFront, rear: newRear, maxSize }, { ...COMPLEXITY.QUEUE_OP, operations: 1 })
    ];
}

export function cqDequeue(queueData, front, rear, maxSize) {
    let isEmpty = rear === -1;

    if (isEmpty) {
        return [createErrorFrame(queueData, `Circular Queue Underflow! Cannot dequeue.`, front, { front, rear, maxSize })];
    }

    const newQueue = [...queueData];
    const dequeuedValue = newQueue[front];
    newQueue[front] = null;

    let newFront = front;
    let newRear = rear;

    if (front === rear) { // Last element removed, reset queue
        newFront = 0;
        newRear = -1;
    } else {
        newFront = (front + 1) % maxSize;
    }

    return [
        createFrame(newQueue, 'pop', `Dequeued ${dequeuedValue} from front (${front})`, [front], { front: newFront, rear: newRear, maxSize }, { ...COMPLEXITY.QUEUE_OP, operations: 1 })
    ];
}
