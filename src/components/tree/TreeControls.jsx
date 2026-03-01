import React, { useState, useEffect } from 'react';
import { useExecutionStore } from '../../store/useExecutionStore';
import { useStructureStore } from '../../store/useStructureStore';
import Dropdown from '../ui/Dropdown';
import { bstInsert, bstSearch, bstTraverse } from '../../utils/treeAlgorithms';

export default function TreeControls() {
    const { isPlaying, setFrames, resetExecution } = useExecutionStore();
    const { treeData, treeRoot, setTreeState, resetTree } = useStructureStore();

    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        return () => {
            resetExecution();
            resetTree();
        };
    }, []);

    const executeOp = (algoFn, actionType, ...args) => {
        if (isPlaying) return;
        resetExecution();

        const state = useStructureStore.getState();
        const frames = algoFn(state.treeData, state.treeRoot, ...args);
        setFrames(frames);

        // Immediate functional mutation mirroring to store for cumulative instructions
        const lastFrame = frames[frames.length - 1];
        if (!lastFrame.isError && actionType === 'insert') {
            setTreeState({
                treeData: lastFrame.data,
                treeRoot: lastFrame.variables.root
            });
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <Dropdown title="Binary Search Tree" defaultOpen={true}>
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        placeholder="Node Value"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="flex-1 bg-black/30 border border-white/5 text-white p-2 rounded outline-none focus:border-[#19ff9c]"
                    />
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                    <button
                        disabled={isPlaying || !inputValue}
                        onClick={() => executeOp(bstInsert, 'insert', inputValue)}
                        className="bg-white/5 border border-white/10 text-[#19ff9c] p-2 rounded hover:bg-[#19ff9c]/20 disabled:opacity-50 transition-colors text-sm"
                    >
                        Insert Node
                    </button>
                    <button
                        disabled={isPlaying || !inputValue || !treeRoot}
                        onClick={() => executeOp(bstSearch, 'search', inputValue)}
                        className="bg-white/5 border border-white/10 text-[#00e5ff] p-2 rounded hover:bg-[#00e5ff]/20 disabled:opacity-50 transition-colors text-sm"
                    >
                        Search BST
                    </button>
                </div>

                <div className="h-px bg-white/5 w-full my-3"></div>
                <div className="text-xs text-[#8c9bb0] font-mono mb-2 px-1">TRAVERSALS</div>

                <div className="grid grid-cols-1 gap-2 mb-4">
                    <button
                        disabled={isPlaying || !treeRoot}
                        onClick={() => executeOp(bstTraverse, 'traverse', 'preorder')}
                        className="bg-white/5 border border-white/10 text-white p-2 rounded hover:bg-white/10 disabled:opacity-50 transition-colors text-sm"
                    >
                        Pre-order Traversal
                    </button>
                    <button
                        disabled={isPlaying || !treeRoot}
                        onClick={() => executeOp(bstTraverse, 'traverse', 'inorder')}
                        className="bg-white/5 border border-white/10 text-white p-2 rounded hover:bg-white/10 disabled:opacity-50 transition-colors text-sm"
                    >
                        In-order Traversal
                    </button>
                    <button
                        disabled={isPlaying || !treeRoot}
                        onClick={() => executeOp(bstTraverse, 'traverse', 'postorder')}
                        className="bg-white/5 border border-white/10 text-white p-2 rounded hover:bg-white/10 disabled:opacity-50 transition-colors text-sm"
                    >
                        Post-order Traversal
                    </button>
                </div>

                <div className="h-px bg-white/5 w-full my-3"></div>

                <button
                    disabled={isPlaying}
                    onClick={() => {
                        resetTree();
                        resetExecution();
                    }}
                    className="w-full bg-white/5 border border-white/5 text-[#8c9bb0] p-2 rounded hover:bg-white/10 hover:text-white disabled:opacity-50 transition-colors text-xs"
                >
                    Clear Tree
                </button>
            </Dropdown>
        </div>
    );
}
