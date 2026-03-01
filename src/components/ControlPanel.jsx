import React from 'react';
import { useExecutionStore } from '../store/useExecutionStore';
import ArrayControls from './array/ArrayControls';
import Array2DControls from './array2d/Array2DControls';
import StackControls from './stack/StackControls';
import QueueControls from './queue/QueueControls';
import CircularQueueControls from './queue/CircularQueueControls';
import LinkedListControls from './linkedList/LinkedListControls';
import TreeControls from './tree/TreeControls';
import GraphControls from './graph/GraphControls';

export default function ControlPanel() {
    const {
        mode, isPlaying, speed, currentStep, frames,
        setIsPlaying, setSpeed, nextStep, prevStep, resetExecution
    } = useExecutionStore();

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <aside className="w-[300px] shrink-0 glass flex flex-col rounded-xl overflow-hidden shadow-2xl m-4 mr-0">
            <div className="p-4 border-b border-white/5 bg-black/20 flex justify-between items-center">
                <h2 className="text-lg font-semibold tracking-wide">Controls</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {mode === 'array' && <ArrayControls />}
                {mode === 'array2d' && <Array2DControls />}
                {(mode === 'stack' || mode === 'doublestack') && <StackControls />}
                {mode === 'queue' && <QueueControls />}
                {mode === 'circularqueue' && <CircularQueueControls />}
                {['sll', 'dll', 'cll'].includes(mode) && <LinkedListControls />}
                {mode === 'bst' && <TreeControls />}
                {mode === 'graph' && <GraphControls />}
            </div>

            {/* Execution Engine Controls */}
            <div className="p-6 border-t border-white/5 glass-strong">
                <div className="flex justify-center items-center gap-4 mb-5">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 0 || isPlaying}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:scale-105 transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
                    </button>

                    <button
                        onClick={handlePlayPause}
                        className="w-12 h-12 rounded-full bg-[#19ff9c] text-black shadow-[0_0_15px_rgba(25,255,156,0.2)] flex items-center justify-center hover:scale-110 hover:shadow-[0_0_20px_rgba(25,255,156,0.4)] transition-all"
                    >
                        {isPlaying ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                        )}
                    </button>

                    <button
                        onClick={nextStep}
                        disabled={currentStep >= frames.length - 1 || isPlaying || frames.length === 0}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:scale-105 transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
                    </button>

                    <button
                        onClick={resetExecution}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-[#ff3366] hover:text-[#ff3366] hover:scale-105 transition-all text-white ml-2"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <label className="text-sm text-[#8c9bb0]">Speed</label>
                    <input
                        type="range"
                        min="1" max="5"
                        value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        className="flex-1 accent-[#19ff9c]"
                    />
                </div>
            </div>
        </aside>
    );
}
