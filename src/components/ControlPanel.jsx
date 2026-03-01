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
        <aside className="w-[320px] shrink-0 glass flex flex-col rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] m-4 z-10 relative">
            <div className="p-5 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent flex justify-between items-center backdrop-blur-md">
                <h2 className="text-[0.95rem] font-bold tracking-[2px] uppercase text-white/90">Controls</h2>
                <div className="w-2 h-2 rounded-full bg-[#19ff9c] shadow-[0_0_10px_#19ff9c] animate-pulse"></div>
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
            <div className="p-6 border-t border-white/10 bg-black/40 backdrop-blur-xl relative">
                {/* Embedded decorative Top Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#19ff9c]/50 to-transparent"></div>

                <div className="flex justify-center items-center gap-5 mb-6">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 0 || isPlaying}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all text-white disabled:opacity-30 disabled:hover:scale-100 hover:scale-110"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
                    </button>

                    <div className="relative group perspective-1000">
                        {isPlaying && (
                            <div className="absolute inset-[-4px] bg-gradient-to-r from-[#19ff9c] to-[#00e5ff] rounded-full blur-md opacity-60 animate-spin" style={{ animationDuration: '3s' }}></div>
                        )}
                        <button
                            onClick={handlePlayPause}
                            className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${isPlaying ? 'bg-[#020306] border border-[#19ff9c] text-[#19ff9c] shadow-[0_0_30px_rgba(25,255,156,0.3)] scale-105' : 'bg-gradient-to-br from-[#19ff9c] to-[#00e5ff] text-[#020306] hover:scale-110 hover:shadow-[0_0_25px_rgba(25,255,156,0.5)]'}`}
                        >
                            {isPlaying ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                            ) : (
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M8 5v14l11-7z" /></svg>
                            )}
                        </button>
                    </div>

                    <button
                        onClick={nextStep}
                        disabled={currentStep >= frames.length - 1 || isPlaying || frames.length === 0}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all text-white disabled:opacity-30 disabled:hover:scale-100 hover:scale-110"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" /></svg>
                    </button>

                    <button
                        onClick={resetExecution}
                        className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center hover:bg-[#ff3366]/20 hover:border-[#ff3366] hover:text-[#ff3366] transition-all text-[#8c9bb0] absolute top-6 right-6"
                        title="Reset Execution"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
                    </button>
                </div>

                <div className="flex bg-[#020306]/50 border border-white/5 rounded-xl p-3 items-center gap-4 relative overflow-hidden">
                    <div className="w-1 h-full bg-gradient-to-b from-[#b366ff] to-[#00e5ff] absolute left-0 top-0"></div>
                    <label className="text-xs font-semibold tracking-wider text-[#8c9bb0] pl-2 uppercase">Tempo</label>
                    <input
                        type="range"
                        min="1" max="5"
                        value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        className="flex-1 accent-[#00e5ff] h-1.5 bg-white/10 rounded-full appearance-none outline-none"
                    />
                </div>
            </div>
        </aside>
    );
}
