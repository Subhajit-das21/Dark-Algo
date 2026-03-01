import { createFrame, createErrorFrame } from './frameGenerator';

const COMPLEXITY = {
    SEARCH_LINEAR: { time: 'O(N)', space: 'O(1)' },
    SEARCH_BINARY: { time: 'O(log N)', space: 'O(1)' },
    SORT_BUBBLE: { time: 'O(N²)', space: 'O(1)' },
    SORT_SELECTION: { time: 'O(N²)', space: 'O(1)' },
    SORT_INSERTION: { time: 'O(N²)', space: 'O(1)' },
    BASIC: { time: 'O(N)', space: 'O(N)' }
};

export function linearSearch(array, target) {
    const frames = [];
    let ops = 0;

    for (let i = 0; i < array.length; i++) {
        ops++;
        frames.push(createFrame(array, 'compare', `Comparing element at index ${i} with target ${target}`, [i], { i, target }, { ...COMPLEXITY.SEARCH_LINEAR, operations: ops }));

        if (array[i] === target) {
            frames.push(createFrame(array, 'found', `Target ${target} found at index ${i}`, [i], { i, target }, { ...COMPLEXITY.SEARCH_LINEAR, operations: ops }));
            return frames;
        }
    }

    frames.push(createFrame(array, 'idle', `Target ${target} not found in array`, [], { target }, { ...COMPLEXITY.SEARCH_LINEAR, operations: ops }));
    return frames;
}

export function binarySearch(array, target) {
    const frames = [];
    let ops = 0;

    // Verify sorted
    for (let i = 0; i < array.length - 1; i++) {
        if (array[i] > array[i + 1]) {
            return [createErrorFrame(array, 'Array must be sorted for Binary Search')];
        }
    }

    let l = 0;
    let r = array.length - 1;

    while (l <= r) {
        ops++;
        let mid = Math.floor((l + r) / 2);
        frames.push(createFrame(array, 'compare', `Calculating mid: ${mid}. L=${l}, R=${r}`, [l, mid, r], { l, r, mid }, { ...COMPLEXITY.SEARCH_BINARY, operations: ops }));

        ops++;
        if (array[mid] === target) {
            frames.push(createFrame(array, 'found', `Target ${target} found at mid index ${mid}`, [mid], { l, r, mid }, { ...COMPLEXITY.SEARCH_BINARY, operations: ops }));
            return frames;
        }

        if (array[mid] < target) {
            frames.push(createFrame(array, 'compare', `${array[mid]} < ${target}. Searching right half.`, [mid], { l, r, mid }, { ...COMPLEXITY.SEARCH_BINARY, operations: ops }));
            l = mid + 1;
        } else {
            frames.push(createFrame(array, 'compare', `${array[mid]} > ${target}. Searching left half.`, [mid], { l, r, mid }, { ...COMPLEXITY.SEARCH_BINARY, operations: ops }));
            r = mid - 1;
        }
    }

    frames.push(createFrame(array, 'idle', `Target ${target} not found in array`, [], { target }, { ...COMPLEXITY.SEARCH_BINARY, operations: ops }));
    return frames;
}

export function bubbleSort(array) {
    const arr = [...array];
    const frames = [];
    let ops = 0;

    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            ops++;
            frames.push(createFrame(arr, 'compare', `Comparing indices ${j} and ${j + 1}`, [j, j + 1], { i, j }, { ...COMPLEXITY.SORT_BUBBLE, operations: ops }));

            if (arr[j] > arr[j + 1]) {
                ops++;
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                frames.push(createFrame(arr, 'swap', `Swapping ${arr[j + 1]} and ${arr[j]}`, [j, j + 1], { i, j }, { ...COMPLEXITY.SORT_BUBBLE, operations: ops }));
            }
        }
    }

    frames.push(createFrame(arr, 'idle', 'Array is sorted.', [], {}, { ...COMPLEXITY.SORT_BUBBLE, operations: ops }));
    return frames;
}

export function selectionSort(array) {
    const arr = [...array];
    const frames = [];
    let ops = 0;

    for (let i = 0; i < arr.length; i++) {
        let minIdx = i;
        for (let j = i + 1; j < arr.length; j++) {
            ops++;
            frames.push(createFrame(arr, 'compare', `Looking for minimum in unsorted part. Comparing to index ${j}`, [minIdx, j], { i, j, minIdx }, { ...COMPLEXITY.SORT_SELECTION, operations: ops }));
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
                frames.push(createFrame(arr, 'target', `New minimum found at index ${minIdx}`, [minIdx], { i, j, minIdx }, { ...COMPLEXITY.SORT_SELECTION, operations: ops }));
            }
        }
        if (minIdx !== i) {
            ops++;
            let temp = arr[minIdx];
            arr[minIdx] = arr[i];
            arr[i] = temp;
            frames.push(createFrame(arr, 'swap', `Swapping current element ${arr[minIdx]} with minimum ${arr[i]}`, [i, minIdx], { i, minIdx }, { ...COMPLEXITY.SORT_SELECTION, operations: ops }));
        }
    }

    frames.push(createFrame(arr, 'idle', 'Array is sorted.', [], {}, { ...COMPLEXITY.SORT_SELECTION, operations: ops }));
    return frames;
}

export function insertionSort(array) {
    const arr = [...array];
    const frames = [];
    let ops = 0;

    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;

        frames.push(createFrame(arr, 'target', `Current key to insert: ${key}`, [i], { i, j, key }, { ...COMPLEXITY.SORT_INSERTION, operations: ops }));

        while (j >= 0 && arr[j] > key) {
            ops++;
            frames.push(createFrame(arr, 'compare', `${arr[j]} > ${key}. Shifting ${arr[j]} to right.`, [j, j + 1], { i, j, key }, { ...COMPLEXITY.SORT_INSERTION, operations: ops }));
            arr[j + 1] = arr[j];
            j = j - 1;
            frames.push(createFrame(arr, 'swap', `Shift applied.`, [j + 1, j + 2], { i, j, key }, { ...COMPLEXITY.SORT_INSERTION, operations: ops }));
        }

        arr[j + 1] = key;
        frames.push(createFrame(arr, 'insert', `Inserted key ${key} at index ${j + 1}`, [j + 1], { i, j, key }, { ...COMPLEXITY.SORT_INSERTION, operations: ops }));
    }

    frames.push(createFrame(arr, 'idle', 'Array is sorted.', [], {}, { ...COMPLEXITY.SORT_INSERTION, operations: ops }));
    return frames;
}

// Basic operations that return simple frames
export function insertElement(array, value, indexStr) {
    let index = array.length;
    if (indexStr !== '') {
        index = parseInt(indexStr, 10);
        if (isNaN(index)) return [createErrorFrame(array, 'Index must be a valid number')];
        // Allow inserting to the end
        if (index < 0 || index > array.length) {
            return [createErrorFrame(array, `Index ${index} is Out of Bounds. (0 - ${array.length})`, -1)];
        }
    }

    const arr = [...array];
    const frames = [];

    // Empty array case
    if (arr.length === 0) {
        if (index > 0) return [createErrorFrame(array, `Cannot insert at index ${index} on an empty array.`, -1)];
        arr.push(value);
        frames.push(createFrame(arr, 'insert', `Inserted ${value} at index ${index}`, [0], { index, value }, { ...COMPLEXITY.BASIC, operations: 1 }));
        return frames;
    }

    let ops = 0;

    // Shift elements right starting from the back
    for (let i = arr.length; i > index; i--) {
        ops++;
        frames.push(createFrame(arr, 'compare', `Shifting space... Reading index ${i - 1} to move to ${i}`, [i - 1, i], { from: i - 1, to: i }, { ...COMPLEXITY.BASIC, operations: ops }));
        arr[i] = arr[i - 1]; // Shift right
        frames.push(createFrame(arr, 'swap', `Shifted element to index ${i}`, [i], { from: i - 1, to: i }, { ...COMPLEXITY.BASIC, operations: ops }));
    }

    // Insert
    arr[index] = value;
    ops++;
    frames.push(createFrame(arr, 'insert', `Inserted ${value} directly at index ${index}`, [index], { index, value }, { ...COMPLEXITY.BASIC, operations: ops }));

    return frames;
}

export function deleteElement(array, indexStr) {
    if (array.length === 0) {
        return [createErrorFrame(array, 'Cannot delete from an empty array')];
    }

    let index = array.length - 1;
    if (indexStr !== '') {
        index = parseInt(indexStr, 10);
        if (isNaN(index)) return [createErrorFrame(array, 'Index must be a valid number')];
        if (index < 0 || index >= array.length) {
            return [createErrorFrame(array, `Index ${index} is Out of Bounds. (0 - ${array.length - 1})`, index, { index, length: array.length })];
        }
    }

    const value = array[index];
    const arr = [...array];
    arr.splice(index, 1);
    return [createFrame(arr, 'delete', `Deleted element ${value} from index ${index}`, [], { index, value }, { ...COMPLEXITY.BASIC, operations: 1 })];
}
