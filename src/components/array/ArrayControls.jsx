import React, { useState, useEffect } from 'react';
import { useExecutionStore } from '../../store/useExecutionStore';
import { useStructureStore } from '../../store/useStructureStore';
import Dropdown from '../ui/Dropdown';
import {
    linearSearch, binarySearch,
    bubbleSort, selectionSort, insertionSort,
    insertElement, deleteElement
} from '../../utils/arrayAlgorithms';

export default function ArrayControls() {
    const { isPlaying, setFrames, resetExecution } = useExecutionStore();
    const { arrayData, setArrayData } = useStructureStore();

    const [inputValue, setInputValue] = useState('');
    const [inputIndex, setInputIndex] = useState('');

    // Unmount/Mount cleanup to prevent stale states
    useEffect(() => {
        if (arrayData.length === 0) {
            setArrayData([42, 12, 88, 5, 23, 19, 7]);
        }
        return () => resetExecution();
    }, []);

    const handleExecution = (algoFn, actionStr, ...args) => {
        if (isPlaying) return;
        resetExecution();

        const state = useStructureStore.getState();
        const frames = algoFn(state.arrayData, ...args);
        setFrames(frames);

        // Immediate functional mutation mirroring to store (so multiple instructions accumulate safely without timer loop syncing)
        const lastFrame = frames[frames.length - 1];
        if (!lastFrame.isError && (actionStr === 'insert' || actionStr === 'delete')) {
            setArrayData(lastFrame.data);
        }
    };

    const handleSetCustomArray = () => {
        if (!inputValue) return;
        const items = inputValue.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
        if (items.length > 0) {
            setArrayData(items);
            resetExecution();
            setInputValue('');
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <Dropdown title="Searching" defaultOpen={true}>
                <div className="flex gap-2 mb-3">
                    <input
                        type="number"
                        placeholder="Target"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="flex-1 bg-black/30 border border-white/5 text-white p-2 rounded outline-none focus:border-[#19ff9c]"
                    />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        disabled={isPlaying || !inputValue}
                        onClick={() => handleExecution(linearSearch, 'search', parseInt(inputValue, 10))}
                        className="bg-white/5 border border-white/10 text-white p-2 rounded hover:bg-white/10 disabled:opacity-50 transition-colors"
                    >
                        Linear Search
                    </button>
                    <button
                        disabled={isPlaying || !inputValue}
                        onClick={() => handleExecution(binarySearch, 'search', parseInt(inputValue, 10))}
                        className="bg-white/5 border border-white/10 text-white p-2 rounded hover:bg-white/10 disabled:opacity-50 transition-colors"
                    >
                        Binary Search
                    </button>
                </div>
            </Dropdown>

            <Dropdown title="Sorting">
                <div className="grid grid-cols-1 gap-2">
                    <button
                        disabled={isPlaying}
                        onClick={() => handleExecution(bubbleSort, 'sort')}
                        className="bg-white/5 border border-white/10 text-white p-2 rounded hover:bg-white/10 disabled:opacity-50 transition-colors"
                    >
                        Bubble Sort
                    </button>
                    <button
                        disabled={isPlaying}
                        onClick={() => handleExecution(selectionSort, 'sort')}
                        className="bg-white/5 border border-white/10 text-white p-2 rounded hover:bg-white/10 disabled:opacity-50 transition-colors"
                    >
                        Selection Sort
                    </button>
                    <button
                        disabled={isPlaying}
                        onClick={() => handleExecution(insertionSort, 'sort')}
                        className="bg-white/5 border border-white/10 text-white p-2 rounded hover:bg-white/10 disabled:opacity-50 transition-colors"
                    >
                        Insertion Sort
                    </button>
                </div>
            </Dropdown>

            <Dropdown title="Basic Operations">
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        placeholder="Val(s)"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-1/2 bg-black/30 border border-white/5 text-white p-2 rounded outline-none focus:border-[#19ff9c]"
                    />
                    <input
                        type="number"
                        placeholder="Idx"
                        value={inputIndex}
                        onChange={(e) => setInputIndex(e.target.value)}
                        className="w-1/2 bg-black/30 border border-white/5 text-white p-2 rounded outline-none focus:border-[#19ff9c]"
                    />
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                        disabled={isPlaying || !inputValue}
                        onClick={() => handleExecution(insertElement, 'insert', parseInt(inputValue, 10), inputIndex)}
                        className="bg-white/5 border border-white/10 text-white p-2 rounded hover:bg-white/10 disabled:opacity-50 transition-colors"
                    >
                        Insert
                    </button>
                    <button
                        disabled={isPlaying}
                        onClick={() => handleExecution(deleteElement, 'delete', inputIndex)}
                        className="bg-white/5 border border-white/10 border-[#ff3366]/30 text-[#ff3366] p-2 rounded hover:bg-[#ff3366]/10 disabled:opacity-50 transition-colors"
                    >
                        Delete
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        disabled={isPlaying}
                        onClick={handleSetCustomArray}
                        className="bg-white/5 border border-white/5 text-[#8c9bb0] p-2 rounded hover:bg-white/10 hover:text-white disabled:opacity-50 transition-colors text-xs"
                    >
                        Set Custom (CSV)
                    </button>
                    <button
                        disabled={isPlaying}
                        onClick={() => { setArrayData([]); resetExecution(); }}
                        className="bg-white/5 border border-white/5 text-[#8c9bb0] p-2 rounded hover:bg-white/10 hover:text-white disabled:opacity-50 transition-colors text-xs"
                    >
                        Clear Array
                    </button>
                </div>
            </Dropdown>
        </div>
    );
}
