import React, { useState, useEffect } from 'react';
import { useExecutionStore } from '../../store/useExecutionStore';
import { useStructureStore } from '../../store/useStructureStore';
import Dropdown from '../ui/Dropdown';
import { cqEnqueue, cqDequeue } from '../../utils/queueAlgorithms';

export default function CircularQueueControls() {
    const { isPlaying, setFrames, resetExecution } = useExecutionStore();
    const { queueData, maxQueueSize, setQueueState, resetQueue } = useStructureStore();

    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (queueData.length === 0) {
            setQueueState({
                queueData: new Array(maxQueueSize).fill(null),
                queueFront: 0,
                queueRear: -1
            });
        }
        return () => {
            resetExecution();
            resetQueue();
        };
    }, []);

    const executeOp = (algoFn, actionType, ...args) => {
        if (isPlaying) return;
        resetExecution();

        const state = useStructureStore.getState();
        const frames = algoFn(state.queueData, state.queueFront, state.queueRear, state.maxQueueSize, ...args);
        setFrames(frames);

        const lastFrame = frames[frames.length - 1];
        if (!lastFrame.isError && (actionType === 'enqueue' || actionType === 'dequeue')) {
            setQueueState({
                queueData: lastFrame.data,
                queueFront: lastFrame.variables.front,
                queueRear: lastFrame.variables.rear
            });
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <Dropdown title="Circular Queue" defaultOpen={true}>
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        placeholder="Value to Enqueue"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="flex-1 bg-black/30 border border-white/5 text-white p-2 rounded outline-none focus:border-[#19ff9c]"
                    />
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                        disabled={isPlaying || !inputValue}
                        onClick={() => executeOp(cqEnqueue, 'enqueue', parseInt(inputValue, 10))}
                        className="bg-white/5 border border-white/10 text-[#56ccf2] p-2 rounded hover:bg-white/10 disabled:opacity-50 transition-colors"
                    >
                        CQ Enqueue
                    </button>
                    <button
                        disabled={isPlaying}
                        onClick={() => executeOp(cqDequeue, 'dequeue')}
                        className="bg-white/5 border border-white/10 border-[#ff3366]/30 text-[#ff3366] p-2 rounded hover:bg-[#ff3366]/10 disabled:opacity-50 transition-colors"
                    >
                        CQ Dequeue
                    </button>
                </div>
                <button
                    disabled={isPlaying}
                    onClick={() => {
                        setQueueState({
                            queueData: new Array(maxQueueSize).fill(null),
                            queueFront: 0,
                            queueRear: -1
                        });
                        resetExecution();
                    }}
                    className="w-full bg-white/5 border border-white/5 text-[#8c9bb0] p-2 rounded hover:bg-white/10 hover:text-white disabled:opacity-50 transition-colors text-xs"
                >
                    Reset Circular Queue
                </button>
            </Dropdown>
        </div>
    );
}
