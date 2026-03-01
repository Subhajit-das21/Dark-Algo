import { createFrame, createErrorFrame } from './frameGenerator';

const COMPLEXITY = {
    TRAVERSE: { time: 'O(R × C)', space: 'O(1)' }
};

export function execute2DTraversal(matrix, targetRow = null, targetCol = null) {
    const frames = [];
    const rows = matrix.length;
    if (rows === 0) {
        return [createErrorFrame(matrix, "Matrix is empty!", -1, { row: -1, col: -1 })];
    }
    const cols = matrix[0].length;

    let found = false;
    let targetValue = null;
    let targetIdx = -1;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const idx = r * cols + c;
            const isTarget = targetRow === r && targetCol === c;

            frames.push(createFrame(
                matrix,
                isTarget ? 'found' : 'compare',
                isTarget ? `Target found at Row ${r}, Col ${c}` : `Traversing Row ${r}, Col ${c}: Value ${matrix[r][c]}`,
                [idx],
                { row: r, col: c, value: matrix[r][c] },
                { ...COMPLEXITY.TRAVERSE, rows, cols }
            ));

            if (isTarget) {
                found = true;
                break;
            }
        }
        if (found) break;
    }

    if (!found && targetRow !== null && targetCol !== null) {
        frames.push(createErrorFrame(matrix, `Target Row ${targetRow}, Col ${targetCol} is out of bounds.`, -1, { row: targetRow, col: targetCol }));
    }

    return frames;
}

export function generateMatrix(rows, cols, random = true) {
    const matrix = [];
    let counter = 1;
    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            row.push(random ? Math.floor(Math.random() * 99) + 1 : counter++);
        }
        matrix.push(row);
    }
    return matrix;
}
