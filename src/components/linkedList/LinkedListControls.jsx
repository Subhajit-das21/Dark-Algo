import React, { useState, useEffect } from 'react';
import { useExecutionStore } from '../../store/useExecutionStore';
import { useStructureStore } from '../../store/useStructureStore';
import Dropdown from '../ui/Dropdown';
import { llInsert, llDelete, llSearch } from '../../utils/linkedListAlgorithms';

export default function LinkedListControls() {
    const { mode, isPlaying, setFrames, resetExecution } = useExecutionStore();
    const { linkedListData, llHead, llTail, llLength, setLinkedListState, resetLinkedList } = useStructureStore();

    const [inputValue, setInputValue] = useState('');
    const [inputIndex, setInputIndex] = useState('');

    // Clear on mode switch (SLL -> DLL -> CLL)
    useEffect(() => {
        return () => {
            resetExecution();
            resetLinkedList();
        };
    }, [mode]);

    const executeOp = (algoFn, actionType, ...args) => {
        if (isPlaying) return;
        resetExecution();

        const state = useStructureStore.getState();
        const frames = algoFn(
            state.linkedListData,
            state.llHead,
            state.llTail,
            state.llLength,
            ...args,
            mode // passing 'sll', 'dll', or 'cll'
        );
        setFrames(frames);

        const lastFrame = frames[frames.length - 1];
        if (!lastFrame.isError && (actionType === 'insert' || actionType === 'delete')) {
            setLinkedListState({
                linkedListData: lastFrame.data,
                llHead: lastFrame.variables.head,
                llTail: lastFrame.variables.tail,
                llLength: lastFrame.variables.length
            });
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <Dropdown title="Linked List Operations" defaultOpen={true}>
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        placeholder="Value"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-1/2 bg-black/30 border border-white/5 text-white p-2 rounded outline-none focus:border-[#19ff9c]"
                    />
                    <input
                        type="number"
                        placeholder="Index"
                        value={inputIndex}
                        onChange={(e) => setInputIndex(e.target.value)}
                        className="w-1/2 bg-black/30 border border-white/5 text-white p-2 rounded outline-none focus:border-[#19ff9c]"
                    />
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                        disabled={isPlaying || !inputValue}
                        onClick={() => executeOp(llInsert, 'insert', inputValue, 'head', '')}
                        className="bg-white/5 border border-white/10 text-white p-2 rounded hover:bg-[#19ff9c]/20 hover:text-[#19ff9c] disabled:opacity-50 transition-colors text-sm"
                    >
                        Insert Head
                    </button>
                    <button
                        disabled={isPlaying || !inputValue}
                        onClick={() => executeOp(llInsert, 'insert', inputValue, 'tail', '')}
                        className="bg-white/5 border border-white/10 text-white p-2 rounded hover:bg-[#19ff9c]/20 hover:text-[#19ff9c] disabled:opacity-50 transition-colors text-sm"
                    >
                        Insert Tail
                    </button>
                </div>
                <div className="grid grid-cols-1 gap-2 mb-4">
                    <button
                        disabled={isPlaying || !inputValue || inputIndex === ''}
                        onClick={() => executeOp(llInsert, 'insert', inputValue, 'position', inputIndex)}
                        className="bg-white/5 border border-white/10 text-white p-2 rounded hover:bg-[#19ff9c]/20 hover:text-[#19ff9c] disabled:opacity-50 transition-colors text-sm"
                    >
                        Insert at Index
                    </button>
                </div>

                <div className="h-px bg-white/5 w-full my-3"></div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                        disabled={isPlaying || llLength === 0}
                        onClick={() => executeOp(llDelete, 'delete', 'head', '')}
                        className="bg-white/5 border border-white/10 text-white p-2 rounded hover:bg-[#ff3366]/20 hover:text-[#ff3366] disabled:opacity-50 transition-colors text-sm"
                    >
                        Delete Head
                    </button>
                    <button
                        disabled={isPlaying || llLength === 0}
                        onClick={() => executeOp(llDelete, 'delete', 'tail', '')}
                        className="bg-white/5 border border-white/10 text-white p-2 rounded hover:bg-[#ff3366]/20 hover:text-[#ff3366] disabled:opacity-50 transition-colors text-sm"
                    >
                        Delete Tail
                    </button>
                </div>
                <div className="grid grid-cols-1 gap-2 mb-4">
                    <button
                        disabled={isPlaying || llLength === 0 || inputIndex === ''}
                        onClick={() => executeOp(llDelete, 'delete', 'position', inputIndex)}
                        className="bg-white/5 border border-white/10 text-white p-2 rounded hover:bg-[#ff3366]/20 hover:text-[#ff3366] disabled:opacity-50 transition-colors text-sm"
                    >
                        Delete at Index
                    </button>
                </div>

                <div className="h-px bg-white/5 w-full my-3"></div>

                <div className="grid grid-cols-2 gap-2">
                    <button
                        disabled={isPlaying || !inputValue || llLength === 0}
                        onClick={() => executeOp(llSearch, 'search', inputValue)}
                        className="bg-white/5 border border-white/10 text-[#00e5ff] p-2 rounded hover:bg-[#00e5ff]/20 disabled:opacity-50 transition-colors text-sm"
                    >
                        Search Value
                    </button>
                    <button
                        disabled={isPlaying}
                        onClick={() => {
                            resetLinkedList();
                            resetExecution();
                        }}
                        className="bg-white/5 border border-white/5 text-[#8c9bb0] p-2 rounded hover:bg-white/10 hover:text-white disabled:opacity-50 transition-colors text-sm"
                    >
                        Clear List
                    </button>
                </div>
            </Dropdown>
        </div>
    );
}
