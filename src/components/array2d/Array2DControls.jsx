import React, { useState, useEffect } from 'react';
import { useExecutionStore } from '../../store/useExecutionStore';
import { useStructureStore } from '../../store/useStructureStore';
import Dropdown from '../ui/Dropdown';
import { execute2DTraversal, generateMatrix } from '../../utils/array2dAlgorithms';

export default function Array2DControls() {
    const { isPlaying, setFrames, resetExecution } = useExecutionStore();
    const { matrix, rows, cols, setMatrix, setRows, setCols } = useStructureStore();

    const [inputRows, setInputRows] = useState(rows);
    const [inputCols, setInputCols] = useState(cols);
    const [targetRow, setTargetRow] = useState('');
    const [targetCol, setTargetCol] = useState('');

    // Initialize logic
    useEffect(() => {
        if (matrix.length === 0) {
            handleGenerateMatrix(rows, cols);
        }
        return () => resetExecution();
    }, []);

    const handleGenerateMatrix = (r = inputRows, c = inputCols) => {
        if (isPlaying) return;
        resetExecution();

        // Boundaries
        const safeRows = Math.min(Math.max(parseInt(r, 10) || 3, 1), 10);
        const safeCols = Math.min(Math.max(parseInt(c, 10) || 3, 1), 10);

        setInputRows(safeRows);
        setInputCols(safeCols);
        setRows(safeRows);
        setCols(safeCols);

        setMatrix(generateMatrix(safeRows, safeCols, true));
    };

    const handleTraversal = () => {
        if (isPlaying) return;
        resetExecution();

        const state = useStructureStore.getState();
        const tr = targetRow !== '' ? parseInt(targetRow, 10) : null;
        const tc = targetCol !== '' ? parseInt(targetCol, 10) : null;

        const frames = execute2DTraversal(state.matrix, tr, tc);
        setFrames(frames);
    };

    return (
        <div className="flex flex-col gap-2">
            <Dropdown title="Matrix Settings" defaultOpen={true}>
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-[#8c9bb0]">Rows (1-10)</label>
                        <input
                            type="number"
                            min="1" max="10"
                            value={inputRows}
                            onChange={(e) => setInputRows(e.target.value)}
                            className="bg-black/30 border border-white/5 text-white p-2 rounded outline-none focus:border-[#19ff9c]"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-[#8c9bb0]">Cols (1-10)</label>
                        <input
                            type="number"
                            min="1" max="10"
                            value={inputCols}
                            onChange={(e) => setInputCols(e.target.value)}
                            className="bg-black/30 border border-white/5 text-white p-2 rounded outline-none focus:border-[#19ff9c]"
                        />
                    </div>
                </div>
                <button
                    disabled={isPlaying}
                    onClick={() => handleGenerateMatrix()}
                    className="w-full bg-white/5 border border-white/10 text-white p-2 rounded hover:bg-white/10 disabled:opacity-50 transition-colors mb-2"
                >
                    Generate Random Matrix
                </button>
            </Dropdown>

            <Dropdown title="2D Traversal" defaultOpen={true}>
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-[#8c9bb0]">Target Row</label>
                        <input
                            type="number"
                            min="0" max={rows - 1}
                            placeholder="Optional"
                            value={targetRow}
                            onChange={(e) => setTargetRow(e.target.value)}
                            className="bg-black/30 border border-white/5 text-white p-2 rounded outline-none focus:border-[#00e5ff]"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-[#8c9bb0]">Target Col</label>
                        <input
                            type="number"
                            min="0" max={cols - 1}
                            placeholder="Optional"
                            value={targetCol}
                            onChange={(e) => setTargetCol(e.target.value)}
                            className="bg-black/30 border border-white/5 text-white p-2 rounded outline-none focus:border-[#00e5ff]"
                        />
                    </div>
                </div>

                <button
                    disabled={isPlaying}
                    onClick={handleTraversal}
                    className="w-full bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff] p-2 rounded hover:bg-[#00e5ff]/20 disabled:opacity-50 transition-colors"
                >
                    Row-Major Traversal
                </button>
            </Dropdown>

            <Dropdown title="Matrix Controls" defaultOpen={true}>
                <button
                    disabled={isPlaying}
                    onClick={() => {
                        resetExecution();
                        setMatrix(generateMatrix(rows, cols, false)); // ordered
                    }}
                    className="w-full bg-white/5 border border-white/5 text-[#8c9bb0] p-2 rounded hover:bg-white/10 hover:text-white disabled:opacity-50 transition-colors text-sm"
                >
                    Generate Ordered Matrix
                </button>
            </Dropdown>
        </div>
    );
}
