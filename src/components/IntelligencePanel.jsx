import React from 'react';
import { useExecutionStore } from '../store/useExecutionStore';

import { useStructureStore } from '../store/useStructureStore';

export default function IntelligencePanel() {
    const { mode, frames, currentStep, isPlaying } = useExecutionStore();
    const { queueFront, queueRear, maxQueueSize, top1, top2, llLength, rows, cols } = useStructureStore();

    let fallbackVars = {};

    if (mode === 'queue' || mode === 'circularqueue') {
        fallbackVars = { front: queueFront, rear: queueRear, maxSize: maxQueueSize };
    } else if (mode === 'stack') {
        fallbackVars = { top: top1 };
    } else if (mode === 'doublestack') {
        fallbackVars = { top1, top2 };
    } else if (['sll', 'dll', 'cll'].includes(mode)) {
        fallbackVars = { length: llLength };
    } else if (mode === 'array2d') {
        fallbackVars = { rows, cols };
    } else if (mode === 'bst') {
        const root = useStructureStore.getState().treeRoot;
        fallbackVars = { size: useStructureStore.getState().treeData.length, root: root || 'null' };
    } else if (mode === 'graph') {
        const v = useStructureStore.getState().graphNodes.length;
        const e = useStructureStore.getState().graphEdges.length;
        fallbackVars = { vertices: v, edges: e };
    }

    // Safe extraction of current frame
    const currentFrame = frames[currentStep] || {
        action: 'idle',
        description: 'System ready. Waiting for user input...',
        variables: fallbackVars,
        stats: { time: '-', space: '-', operations: 0 }
    };

    return (
        <aside className="w-[320px] shrink-0 glass flex flex-col rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] m-4 ml-0 z-10 relative">
            <div className="p-5 border-b border-white/10 bg-gradient-to-l from-white/5 to-transparent flex justify-between items-center backdrop-blur-md">
                <h2 className="text-[0.95rem] font-bold tracking-[2px] uppercase text-white/90">Intelligence</h2>
                <div className="w-2 h-2 rounded-full bg-[#00e5ff] shadow-[0_0_10px_#00e5ff] animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* Operation Badge */}
                <div className="p-6 pb-2">
                    <div className={`px-4 py-3 rounded-xl font-bold tracking-widest text-[0.8rem] flex justify-center items-center gap-3 border shadow-inner transition-all duration-300 ${currentFrame.action !== 'idle' ? 'bg-[#19ff9c]/10 border-[#19ff9c]/40 text-[#19ff9c] shadow-[inset_0_0_15px_rgba(25,255,156,0.1)]' : 'bg-white/5 border-white/10 text-[#8c9bb0]'
                        }`}>
                        <span className={`w-2.5 h-2.5 rounded-full ${currentFrame.action !== 'idle' ? 'bg-[#19ff9c] shadow-[0_0_10px_#19ff9c]' : 'bg-[#8c9bb0]'
                            }`}></span>
                        <span className="uppercase">{currentFrame.action}</span>
                    </div>
                </div>

                {/* Step Explainer */}
                <div className="m-6 mt-4 p-5 glass-card relative overflow-hidden group hover:border-white/10 transition-colors">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00e5ff] to-transparent opacity-50"></div>
                    <h3 className="text-[0.65rem] font-bold text-[#8c9bb0] uppercase mb-3 tracking-[2px]">Explanation</h3>
                    <p className="text-[0.9rem] leading-relaxed text-white/90 font-medium">
                        {currentFrame.description}
                    </p>
                </div>

                {/* Live Variables */}
                <div className="m-6 mt-4 p-5 glass-card relative overflow-hidden hover:border-white/10 transition-colors">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#b366ff]/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
                    <h3 className="text-[0.65rem] font-bold text-[#8c9bb0] uppercase mb-4 tracking-[2px]">Memory Tracking</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {Object.entries(currentFrame.variables || {}).map(([key, value]) => {
                            let displayValue = value;
                            if (Array.isArray(value)) {
                                displayValue = `[${value.join(', ')}]`;
                            } else if (typeof value === 'object' && value !== null) {
                                displayValue = JSON.stringify(value);
                            }

                            return (
                                <div key={key} className="col-span-2 flex justify-between items-center bg-[#020306]/60 px-4 py-2.5 rounded-lg border border-white/5 shadow-inner hover:border-white/10 transition-colors">
                                    <span className="text-[#8c9bb0] font-mono text-xs font-semibold shrink-0 mr-4 tracking-wider">{key}</span>
                                    <span className="neon-text-blue font-mono text-sm max-w-[150px] truncate" title={displayValue}>{displayValue}</span>
                                </div>
                            );
                        })}
                        {Object.keys(currentFrame.variables || {}).length === 0 && (
                            <div className="col-span-2 text-[#8c9bb0] text-sm text-center py-4 italic opacity-50">Empty Register</div>
                        )}
                    </div>
                </div>

                {/* Complexity Stats */}
                <div className="m-6 mt-4 p-5 glass-card relative overflow-hidden hover:border-white/10 transition-colors">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-[#ff3366]/40 to-transparent"></div>
                    <h3 className="text-[0.65rem] font-bold text-[#8c9bb0] uppercase mb-4 tracking-[2px]">Runtime</h3>
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between text-sm items-center bg-[#020306]/30 px-3 py-2 rounded">
                            <span className="text-[#8c9bb0] font-medium">Time Limit:</span>
                            <span className="font-mono text-white bg-white/10 px-2 py-0.5 rounded text-xs">{currentFrame.stats?.time || '-'}</span>
                        </div>
                        <div className="flex justify-between text-sm items-center bg-[#020306]/30 px-3 py-2 rounded">
                            <span className="text-[#8c9bb0] font-medium">Space Limit:</span>
                            <span className="font-mono text-white bg-white/10 px-2 py-0.5 rounded text-xs">{currentFrame.stats?.space || '-'}</span>
                        </div>
                        <div className="mt-2 text-center p-3 bg-gradient-to-br from-[#19ff9c]/10 to-transparent border border-[#19ff9c]/20 rounded-xl">
                            <div className="text-[0.65rem] text-[#19ff9c] font-bold tracking-[2px] uppercase mb-1">Total Operations</div>
                            <div className="font-mono text-[#19ff9c] font-black text-2xl" style={{ textShadow: '0 0 15px rgba(25,255,156,0.3)' }}>
                                {currentFrame.stats?.operations || 0}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
