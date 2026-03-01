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
        <aside className="w-[320px] shrink-0 glass flex flex-col rounded-xl overflow-hidden shadow-2xl m-4 ml-0">
            <div className="p-4 border-b border-white/5 bg-black/20 flex justify-between items-center">
                <h2 className="text-lg font-semibold tracking-wide">Intelligence</h2>
            </div>

            <div className="flex-1 overflow-y-auto">
                {/* Operation Badge */}
                <div className="p-6 pb-0">
                    <div className={`px-4 py-3 rounded-md font-semibold tracking-wide flex items-center gap-2 border bg-black/30 ${currentFrame.action !== 'idle' ? 'border-[#19ff9c]/30 text-[#19ff9c]' : 'border-white/5 text-[#8c9bb0]'
                        }`}>
                        <span className={`w-2 h-2 rounded-full ${currentFrame.action !== 'idle' ? 'bg-[#19ff9c] shadow-[0_0_8px_#19ff9c]' : 'bg-[#8c9bb0]'
                            }`}></span>
                        <span className="uppercase">{currentFrame.action}</span>
                    </div>
                </div>

                {/* Step Explainer */}
                <div className="m-6 p-5 glass-card">
                    <h3 className="text-xs text-[#8c9bb0] uppercase mb-3 tracking-wide">Explanation</h3>
                    <p className="text-[0.95rem] leading-relaxed text-white">
                        {currentFrame.description}
                    </p>
                </div>

                {/* Live Variables */}
                <div className="m-6 p-5 glass-card">
                    <h3 className="text-xs text-[#8c9bb0] uppercase mb-3 tracking-wide">Live Variables</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(currentFrame.variables || {}).map(([key, value]) => {
                            let displayValue = value;
                            if (Array.isArray(value)) {
                                displayValue = `[${value.join(', ')}]`;
                            } else if (typeof value === 'object' && value !== null) {
                                displayValue = JSON.stringify(value);
                            }

                            return (
                                <div key={key} className="col-span-2 sm:col-span-1 flex justify-between items-center bg-black/40 px-3 py-2 rounded border-l-2 border-[#00e5ff] overflow-hidden">
                                    <span className="text-[#8c9bb0] font-mono text-sm shrink-0 mr-2">{key}</span>
                                    <span className="text-[#00e5ff] font-mono truncate" title={displayValue}>{displayValue}</span>
                                </div>
                            );
                        })}
                        {Object.keys(currentFrame.variables || {}).length === 0 && (
                            <div className="col-span-2 text-[#8c9bb0] text-sm text-center py-2 italic">No active variables</div>
                        )}
                    </div>
                </div>

                {/* Complexity Stats */}
                <div className="m-6 p-5 glass-card">
                    <h3 className="text-xs text-[#8c9bb0] uppercase mb-3 tracking-wide">Complexity</h3>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-[#8c9bb0]">Time:</span>
                            <span className="font-mono text-white">{currentFrame.stats?.time || '-'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[#8c9bb0]">Space:</span>
                            <span className="font-mono text-white">{currentFrame.stats?.space || '-'}</span>
                        </div>
                        <div className="h-[1px] bg-white/5 my-2"></div>
                        <div className="flex justify-between text-sm items-center">
                            <span className="text-[#8c9bb0]">Operations:</span>
                            <span className="font-mono text-[#19ff9c] font-bold text-lg">{currentFrame.stats?.operations || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
