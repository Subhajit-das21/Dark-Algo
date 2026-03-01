import React, { useMemo } from 'react';
import { useExecutionStore } from '../store/useExecutionStore';
import { useStructureStore } from '../store/useStructureStore';

export default function VisualizationCanvas() {
    const { frames, currentStep, mode } = useExecutionStore();
    const { arrayData, stackData, matrix, cols, queueData, linkedListData, treeData, graphNodes, graphEdges, isDirected } = useStructureStore();

    // Use frame data if we are executing, otherwise use raw structure store
    let displayData;
    let displayFront = -1;
    let displayRear = -1;
    let displayHead = null;
    let displayTail = null;
    let displayEdges = [];
    let displayActiveEdges = [];
    let displayVisited = [];

    if (frames.length > 0 && frames[currentStep]) {
        displayData = frames[currentStep].data;
        if (mode === 'queue' || mode === 'circularqueue') {
            displayFront = frames[currentStep].variables?.front ?? -1;
            displayRear = frames[currentStep].variables?.rear ?? -1;
        } else if (['sll', 'dll', 'cll'].includes(mode)) {
            displayHead = frames[currentStep].variables?.head || null;
            displayTail = frames[currentStep].variables?.tail || null;
        } else if (mode === 'graph') {
            displayEdges = graphEdges; // edges structure doesn't animate geometrically, just visually state highlights
            displayActiveEdges = frames[currentStep].variables?.activeEdges || [];
            displayVisited = frames[currentStep].variables?.visited || [];
        } else if (mode === 'bst') {
            displayVisited = frames[currentStep].variables?.visited || [];
        }
    } else {
        if (mode === 'array') displayData = arrayData;
        else if (mode === 'stack') displayData = stackData;
        else if (mode === 'array2d') displayData = matrix;
        else if (mode === 'queue' || mode === 'circularqueue') {
            displayData = queueData;
            displayFront = useStructureStore.getState().queueFront;
            displayRear = useStructureStore.getState().queueRear;
        } else if (['sll', 'dll', 'cll'].includes(mode)) {
            displayData = linkedListData;
            displayHead = useStructureStore.getState().llHead;
            displayTail = useStructureStore.getState().llTail;
        } else if (mode === 'bst') {
            displayData = treeData;
        } else if (mode === 'graph') {
            displayData = graphNodes;
            displayEdges = graphEdges;
        }
    }

    const currentFrame = frames[currentStep] || {};

    const arrayBlocks = useMemo(() => {
        return displayData.map((val, idx) => {
            let stateClass = 'border-[#19ff9c]/30 text-white';
            let bgClass = 'bg-[#19ff9c]/5';
            let shadowClass = '';
            let transformClass = 'translate-y-0 scale-100';

            if (currentFrame.activeIndices?.includes(idx)) {
                if (currentFrame.action === 'compare') {
                    stateClass = 'border-[#00e5ff] text-[#00e5ff]';
                    bgClass = 'bg-[#00e5ff]/20';
                    shadowClass = 'shadow-[0_0_15px_rgba(0,229,255,0.4)]';
                    transformClass = '-translate-y-2';
                } else if (currentFrame.action === 'swap') {
                    stateClass = 'border-[#b366ff] text-[#b366ff]';
                    bgClass = 'bg-[#b366ff]/20';
                    shadowClass = 'shadow-[0_0_15px_rgba(179,102,255,0.4)]';
                    transformClass = '-translate-y-4 scale-105';
                } else if (currentFrame.action === 'found' || currentFrame.action === 'target') {
                    stateClass = 'border-[#19ff9c] text-black font-bold';
                    bgClass = 'bg-[#19ff9c]';
                    shadowClass = 'shadow-[0_0_20px_rgba(25,255,156,0.6)]';
                    transformClass = 'scale-110';
                } else if (currentFrame.action === 'error') {
                    stateClass = 'border-[#ff3366] text-[#ff3366]';
                    bgClass = 'bg-[#ff3366]/20';
                    shadowClass = 'shadow-[0_0_15px_rgba(255,51,102,0.6)]';
                    transformClass = 'relative animate-pulse scale-105';
                }
            }

            return (
                <div
                    key={`block-${idx}`}
                    className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-lg border-2 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${stateClass} ${bgClass} ${shadowClass} ${transformClass}`}
                >
                    <span className="font-mono text-lg">{val}</span>
                    <span className="absolute -bottom-6 text-xs text-[#8c9bb0] font-mono">{idx}</span>
                </div>
            );
        });
    }, [displayData, currentFrame]);

    const isDoubleStack = displayData.length > 0 && displayData.length === useStructureStore.getState().maxStackSize;

    const stackBlocks = useMemo(() => {
        return displayData.map((val, idx) => {
            let stateClass = 'border-[#b366ff]/30 text-white';
            let bgClass = 'bg-[#b366ff]/5';
            let shadowClass = '';
            let transformClass = 'translate-x-0 scale-100';

            const { top1, top2 } = useStructureStore.getState();
            const isStack1 = isDoubleStack && idx <= top1;
            const isStack2 = isDoubleStack && idx >= top2;

            if (isDoubleStack) {
                if (isStack1) {
                    stateClass = 'border-[#00e5ff]/50 text-[#00e5ff]';
                    bgClass = 'bg-[#00e5ff]/10';
                } else if (isStack2) {
                    stateClass = 'border-[#b366ff]/50 text-[#b366ff]';
                    bgClass = 'bg-[#b366ff]/10';
                } else {
                    stateClass = 'border-white/5 text-transparent';
                    bgClass = 'bg-black/20';
                }
            }

            if (currentFrame.activeIndices?.includes(idx)) {
                if (currentFrame.action === 'push') {
                    stateClass = 'border-[#19ff9c] text-[#19ff9c] font-bold';
                    bgClass = 'bg-[#19ff9c]/20';
                    shadowClass = 'shadow-[0_0_20px_rgba(25,255,156,0.5)]';
                    transformClass = 'scale-110';
                } else if (currentFrame.action === 'target') {
                    stateClass = 'border-[#00e5ff] text-[#00e5ff] font-bold';
                    bgClass = 'bg-[#00e5ff]/20';
                    shadowClass = 'shadow-[0_0_20px_rgba(0,229,255,0.5)]';
                    transformClass = '-translate-y-2 scale-105';
                } else if (currentFrame.action === 'error' || currentFrame.action === 'delete') {
                    stateClass = 'border-[#ff3366] text-[#ff3366]';
                    bgClass = 'bg-[#ff3366]/20';
                    shadowClass = 'shadow-[0_0_15px_rgba(255,51,102,0.6)] animate-pulse';
                    transformClass = 'scale-105';
                }
            }

            if (isDoubleStack && top1 === top2 - 1) {
                if (idx === top1 || idx === top2) {
                    shadowClass = 'shadow-[0_0_25px_rgba(255,51,102,0.6)]';
                    bgClass = 'bg-[#ff3366]/20';
                    stateClass = 'border-[#ff3366] text-white';
                }
            }

            return (
                <div
                    key={`stack-block-${idx}`}
                    className={`relative flex flex-col items-center justify-center ${isDoubleStack ? 'w-12 h-12' : 'w-40 h-10'} rounded border-2 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${stateClass} ${bgClass} ${shadowClass} ${transformClass}`}
                >
                    <span className="font-mono text-base font-semibold">{val !== null && val !== undefined ? val : ''}</span>
                    {!isDoubleStack && <span className="absolute -left-8 text-xs text-[#8c9bb0] font-mono">{idx}</span>}
                    {isDoubleStack && <span className="absolute -top-6 text-[10px] text-[#8c9bb0] font-mono">{idx}</span>}
                </div>
            );
        });
    }, [displayData, currentFrame, isDoubleStack, mode]);

    const matrixBlocks = useMemo(() => {
        if (mode !== 'array2d') return null;
        if (!displayData || displayData.length === 0) return null;

        return displayData.map((rowArr, rIdx) => {
            return rowArr.map((val, cIdx) => {
                const idx = rIdx * cols + cIdx;

                let stateClass = 'border-[#19ff9c]/30 text-white';
                let bgClass = 'bg-[#19ff9c]/5';
                let shadowClass = '';
                let transformClass = 'translate-y-0 scale-100 opacity-90 hover:opacity-100';

                // Semantic Highlighting
                if (currentFrame.activeIndices?.includes(idx)) {
                    if (currentFrame.action === 'compare') {
                        stateClass = 'border-[#00e5ff] text-[#00e5ff]';
                        bgClass = 'bg-[#00e5ff]/20';
                        shadowClass = 'shadow-[0_0_15px_rgba(0,229,255,0.4)]';
                        transformClass = 'scale-110 z-10 opacity-100';
                    } else if (currentFrame.action === 'found' || currentFrame.action === 'target') {
                        stateClass = 'border-[#19ff9c] text-black font-bold';
                        bgClass = 'bg-[#19ff9c]';
                        shadowClass = 'shadow-[0_0_20px_rgba(25,255,156,0.6)]';
                        transformClass = 'scale-110 z-10 opacity-100';
                    } else if (currentFrame.action === 'error') {
                        stateClass = 'border-[#ff3366] text-[#ff3366]';
                        bgClass = 'bg-[#ff3366]/20';
                        shadowClass = 'shadow-[0_0_15px_rgba(255,51,102,0.6)]';
                        transformClass = 'relative animate-pulse scale-105 z-10 opacity-100';
                    }
                }

                return (
                    <div
                        key={`matrix-${rIdx}-${cIdx}`}
                        className={`relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded border transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${stateClass} ${bgClass} ${shadowClass} ${transformClass}`}
                    >
                        <span className="font-mono text-sm md:text-base">{val}</span>
                    </div>
                );
            });
        });
    }, [displayData, currentFrame, mode, cols]);

    const queueBlocks = useMemo(() => {
        if (mode !== 'queue' && mode !== 'circularqueue') return null;
        if (!displayData || displayData.length === 0) return null;

        return displayData.map((val, idx) => {
            let stateClass = 'border-[#56ccf2]/30 text-white';
            let bgClass = 'bg-[#56ccf2]/5';
            let shadowClass = '';
            let transformClass = 'translate-y-0 scale-100';

            const isFront = idx === displayFront;
            const isRear = idx === displayRear;
            const isEmptyCell = val === null || val === undefined;

            if (isEmptyCell) {
                stateClass = 'border-white/5 text-transparent';
                bgClass = 'bg-black/20';
            }

            if (currentFrame.activeIndices?.includes(idx)) {
                if (currentFrame.action === 'push') {
                    stateClass = 'border-[#19ff9c] text-[#19ff9c] font-bold';
                    bgClass = 'bg-[#19ff9c]/20';
                    shadowClass = 'shadow-[0_0_20px_rgba(25,255,156,0.5)]';
                    transformClass = 'scale-110 -translate-y-2';
                } else if (currentFrame.action === 'pop') {
                    stateClass = 'border-[#ff3366] text-[#ff3366] font-bold';
                    bgClass = 'bg-[#ff3366]/20';
                    shadowClass = 'shadow-[0_0_20px_rgba(255,51,102,0.5)]';
                    transformClass = 'scale-110 translate-y-2 opacity-50';
                } else if (currentFrame.action === 'error') {
                    stateClass = 'border-[#ff3366] text-[#ff3366]';
                    bgClass = 'bg-[#ff3366]/20';
                    shadowClass = 'shadow-[0_0_15px_rgba(255,51,102,0.6)] animate-pulse';
                    transformClass = 'relative scale-105';
                }
            }

            return (
                <div key={`queue-block-${idx}`} className="relative flex flex-col items-center">
                    {isFront && !isEmptyCell && (
                        <div className="absolute -top-10 text-[10px] text-[#56ccf2] font-mono tracking-widest animate-bounce flex flex-col items-center">
                            FRONT
                            <div className="w-px h-4 bg-[#56ccf2] mt-1"></div>
                        </div>
                    )}

                    <div
                        className={`relative flex flex-col items-center justify-center w-14 h-14 rounded border-2 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${stateClass} ${bgClass} ${shadowClass} ${transformClass}`}
                    >
                        <span className="font-mono text-lg">{isEmptyCell ? '' : val}</span>
                        <span className="absolute -bottom-6 text-xs text-[#8c9bb0] font-mono">{idx}</span>
                    </div>

                    {isRear && !isEmptyCell && (
                        <div className="absolute -bottom-14 text-[10px] text-[#b366ff] font-mono tracking-widest animate-bounce flex flex-col items-center">
                            <div className="w-px h-4 bg-[#b366ff] mb-1"></div>
                            REAR
                        </div>
                    )}
                </div>
            );
        });
    }, [displayData, currentFrame, mode, displayFront, displayRear]);

    const linkedListBlocks = useMemo(() => {
        if (!['sll', 'dll', 'cll'].includes(mode)) return null;
        if (!displayData || displayData.length === 0) return null;

        return displayData.map((node, idx) => {
            const isHead = node.id === displayHead;
            const isTail = node.id === displayTail;

            let stateClass = 'border-[#b366ff]/30 text-white';
            let bgClass = 'bg-[#b366ff]/5';
            let shadowClass = '';
            let transformClass = 'translate-y-0 scale-100';

            if (currentFrame.activeIndices?.includes(node.id)) {
                if (currentFrame.action === 'insert') {
                    stateClass = 'border-[#19ff9c] text-[#19ff9c] font-bold';
                    bgClass = 'bg-[#19ff9c]/20';
                    shadowClass = 'shadow-[0_0_20px_rgba(25,255,156,0.5)]';
                    transformClass = 'scale-110 -translate-y-2 relative z-10';
                } else if (currentFrame.action === 'delete') {
                    stateClass = 'border-[#ff3366] text-[#ff3366] font-bold';
                    bgClass = 'bg-[#ff3366]/20';
                    shadowClass = 'shadow-[0_0_20px_rgba(255,51,102,0.5)]';
                    transformClass = 'scale-110 translate-y-2 opacity-50 relative z-10';
                } else if (currentFrame.action === 'compare') {
                    stateClass = 'border-[#00e5ff] text-[#00e5ff] font-bold';
                    bgClass = 'bg-[#00e5ff]/20';
                    shadowClass = 'shadow-[0_0_20px_rgba(0,229,255,0.5)]';
                    transformClass = 'scale-110 relative z-10';
                } else if (currentFrame.action === 'found' || currentFrame.action === 'target') {
                    stateClass = 'border-[#19ff9c] bg-[#19ff9c] text-black font-bold';
                    shadowClass = 'shadow-[0_0_20px_rgba(25,255,156,0.8)]';
                    transformClass = 'scale-110 relative z-10';
                } else if (currentFrame.action === 'error') {
                    stateClass = 'border-[#ff3366] text-[#ff3366]';
                    bgClass = 'bg-[#ff3366]/20';
                    shadowClass = 'shadow-[0_0_15px_rgba(255,51,102,0.6)] animate-pulse';
                    transformClass = 'relative scale-105';
                }
            }

            const hasNextPointer = node.next !== null;
            const isLastRenderedNode = idx === displayData.length - 1;

            return (
                <React.Fragment key={`ll-node-${node.id}`}>
                    <div className="relative flex flex-col items-center">
                        {isHead && (
                            <div className="absolute -top-12 text-[10px] text-[#00e5ff] font-mono tracking-widest animate-bounce flex flex-col items-center z-20">
                                HEAD
                                <div className="w-px h-4 bg-[#00e5ff] mt-1"></div>
                            </div>
                        )}

                        <div
                            className={`relative flex items-center justify-center min-w-[3.5rem] h-14 px-4 rounded-xl border-2 transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${stateClass} ${bgClass} ${shadowClass} ${transformClass}`}
                        >
                            <span className="font-mono text-lg">{node.value}</span>
                        </div>

                        {isTail && (
                            <div className="absolute -bottom-14 text-[10px] text-[#ff3366] font-mono tracking-widest animate-bounce flex flex-col items-center z-20">
                                <div className="w-px h-4 bg-[#ff3366] mb-1"></div>
                                TAIL
                            </div>
                        )}

                        {!hasNextPointer && (
                            <div className="absolute -right-8 top-1/2 -translate-y-1/2 flex items-center z-0">
                                <div className="w-6 h-0.5 bg-white/20"></div>
                                <div className="w-2 h-2 rounded-full border border-white/40 bg-black ml-1 flex items-center justify-center">
                                    <div className="w-[1px] h-3 bg-white/50 rotate-45"></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {!isLastRenderedNode && (
                        <div className="flex flex-col items-center justify-center px-1 md:px-3">
                            {mode === 'sll' && (
                                <div className="flex items-center">
                                    <div className="w-6 md:w-10 h-0.5 bg-[#4a5568]"></div>
                                    <div className="w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-[#4a5568]"></div>
                                </div>
                            )}
                            {(mode === 'dll' || mode === 'cll') && (
                                <div className="flex flex-col gap-1.5 items-center justify-center">
                                    <div className="flex items-center">
                                        <div className="w-6 md:w-10 h-0.5 bg-[#4a5568]"></div>
                                        <div className="w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-[#4a5568]"></div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-0 h-0 border-y-[4px] border-y-transparent border-r-[6px] border-r-[#4a5568]"></div>
                                        <div className="w-6 md:w-10 h-0.5 bg-[#4a5568]"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </React.Fragment>
            );
        });
    }, [displayData, currentFrame, mode, displayHead, displayTail]);

    const treeBlocks = useMemo(() => {
        if (mode !== 'bst' || !displayData) return null;

        const nodes = displayData.map(node => {
            let stateClass = 'border-[#b366ff]/30 text-white';
            let bgClass = 'bg-[#b366ff]/5';
            let shadowClass = '';
            let transformClass = 'scale-100';

            if (currentFrame.activeIndices?.includes(node.id)) {
                if (currentFrame.action === 'compare') {
                    stateClass = 'border-[#00e5ff] text-[#00e5ff]';
                    bgClass = 'bg-[#00e5ff]/20';
                    shadowClass = 'shadow-[0_0_15px_rgba(0,229,255,0.4)]';
                    transformClass = 'scale-110 z-20';
                } else if (currentFrame.action === 'insert') {
                    stateClass = 'border-[#19ff9c] text-[#19ff9c] font-bold';
                    bgClass = 'bg-[#19ff9c]/20';
                    shadowClass = 'shadow-[0_0_20px_rgba(25,255,156,0.6)]';
                    transformClass = 'scale-110 z-20 animate-pulse';
                } else if (currentFrame.action === 'target' || currentFrame.action === 'found') {
                    stateClass = 'border-[#19ff9c] bg-[#19ff9c] text-black font-bold';
                    shadowClass = 'shadow-[0_0_20px_rgba(25,255,156,0.8)]';
                    transformClass = 'scale-125 z-20';
                }
            } else if (displayVisited.includes(node.id)) { // Traversal specific path highlight
                stateClass = 'border-[#b366ff] text-white font-bold';
                bgClass = 'bg-[#b366ff]/20';
                shadowClass = 'shadow-[0_0_15px_rgba(179,102,255,0.4)]';
            }

            return (
                <div
                    key={`tree-node-${node.id}`}
                    className={`absolute flex flex-col items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-500 ease-out ${stateClass} ${bgClass} ${shadowClass} ${transformClass}`}
                    style={{ left: `calc(50% + ${node.x * 2.5}px)`, top: `${40 + node.y}px`, transform: 'translate(-50%, -50%)' }}
                >
                    <span className="font-mono text-sm">{node.value}</span>
                </div>
            );
        });

        // SVG lines for tree
        const lines = [];
        displayData.forEach(node => {
            if (node.left) {
                const target = displayData.find(n => n.id === node.left);
                if (target) {
                    lines.push(
                        <line
                            key={`edge-${node.id}-${target.id}`}
                            x1={`calc(50% + ${node.x * 2.5}px)`}
                            y1={`${40 + node.y}px`}
                            x2={`calc(50% + ${target.x * 2.5}px)`}
                            y2={`${40 + target.y}px`}
                            stroke="#4a5568"
                            strokeWidth="2"
                            className="transition-all duration-500"
                        />
                    );
                }
            }
            if (node.right) {
                const target = displayData.find(n => n.id === node.right);
                if (target) {
                    lines.push(
                        <line
                            key={`edge-${node.id}-${target.id}`}
                            x1={`calc(50% + ${node.x * 2.5}px)`}
                            y1={`${40 + node.y}px`}
                            x2={`calc(50% + ${target.x * 2.5}px)`}
                            y2={`${40 + target.y}px`}
                            stroke="#4a5568"
                            strokeWidth="2"
                            className="transition-all duration-500"
                        />
                    );
                }
            }
        });

        return { nodes, lines };
    }, [displayData, currentFrame, mode, displayVisited]);

    const graphBlocks = useMemo(() => {
        if (mode !== 'graph' || !displayData) return null;

        const nodes = displayData.map(node => {
            let stateClass = 'border-[#56ccf2]/30 text-white';
            let bgClass = 'bg-[#56ccf2]/5';
            let shadowClass = '';
            let transformClass = 'scale-100';

            const isVisited = displayVisited.includes(node.id);
            if (isVisited) {
                stateClass = 'border-[#56ccf2]/80 text-[#56ccf2]';
                bgClass = 'bg-[#56ccf2]/20';
                shadowClass = 'shadow-[0_0_15px_rgba(86,204,242,0.3)]';
            }

            if (currentFrame.activeIndices?.includes(node.id)) {
                if (currentFrame.action === 'compare') {
                    stateClass = 'border-[#b366ff] text-[#b366ff]';
                    bgClass = 'bg-[#b366ff]/20';
                    shadowClass = 'shadow-[0_0_15px_rgba(179,102,255,0.4)]';
                    transformClass = 'scale-110 z-20';
                } else if (currentFrame.action === 'insert') {
                    stateClass = 'border-[#19ff9c] text-[#19ff9c] font-bold';
                    bgClass = 'bg-[#19ff9c]/20';
                    shadowClass = 'shadow-[0_0_20px_rgba(25,255,156,0.6)]';
                    transformClass = 'scale-110 z-20 animate-pulse';
                } else if (currentFrame.action === 'target' || currentFrame.action === 'found') {
                    stateClass = 'border-[#19ff9c] bg-[#19ff9c] text-black font-bold';
                    shadowClass = 'shadow-[0_0_20px_rgba(25,255,156,0.8)]';
                    transformClass = 'scale-125 z-20';
                }
            }

            return (
                <div
                    key={`graph-node-${node.id}`}
                    className={`absolute flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-500 ease-out ${stateClass} ${bgClass} ${shadowClass} ${transformClass}`}
                    style={{ left: `calc(50% + ${node.x * 2.5}px)`, top: `calc(50% + ${node.y * 2.5}px)`, transform: 'translate(-50%, -50%)' }}
                >
                    <span className="font-mono text-sm">{node.value}</span>
                </div>
            );
        });

        const lines = displayEdges.map(edge => {
            const src = displayData.find(n => n.id === edge.source);
            const tgt = displayData.find(n => n.id === edge.target);
            if (!src || !tgt) return null;

            const isActive = displayActiveEdges.includes(edge.id);
            const strokeColor = isActive ? '#b366ff' : '#4a5568';
            const strokeWidth = isActive ? '3' : '2';

            // Adjust end position slightly so arrow doesn't clip under node boundary
            // A basic vector math to shorten edge by radius (24px)
            const dx = tgt.x - src.x;
            const dy = tgt.y - src.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const rRatio = dist === 0 ? 0 : 25 / (dist * 2.5);

            const x1 = `calc(50% + ${src.x * 2.5}px)`;
            const y1 = `calc(50% + ${src.y * 2.5}px)`;
            const x2 = isDirected ? `calc(50% + ${tgt.x * 2.5 - dx * rRatio * 2.5}px)` : `calc(50% + ${tgt.x * 2.5}px)`;
            const y2 = isDirected ? `calc(50% + ${tgt.y * 2.5 - dy * rRatio * 2.5}px)` : `calc(50% + ${tgt.y * 2.5}px)`;

            return (
                <line
                    key={`edge-${edge.id}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    markerEnd={isDirected ? "url(#arrowhead)" : ""}
                    className="transition-all duration-300"
                />
            );
        });

        return { nodes, lines };
    }, [displayData, displayEdges, currentFrame, mode, displayActiveEdges, displayVisited, isDirected]);

    return (
        <main className="flex-1 relative flex items-center justify-center m-4 ml-0 glass rounded-xl overflow-hidden p-8 shadow-2xl">
            <div className="w-full h-full relative flex items-center justify-center overflow-hidden">

                {mode === 'array' && (
                    <div className="flex flex-wrap gap-4 items-end justify-center w-full max-w-5xl">
                        {arrayBlocks}
                        {(!displayData || displayData.length === 0) && (
                            <div className="text-[#8c9bb0] font-mono opacity-50 text-xl animate-pulse">
                                Array is empty
                            </div>
                        )}
                    </div>
                )}

                {mode === 'array2d' && (
                    <div
                        className="array-2d-container grid gap-2 p-4 bg-black/20 rounded-lg border border-white/5 shadow-inner"
                        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
                    >
                        {matrixBlocks}
                        {(!displayData || displayData.length === 0) && (
                            <div className="text-[#8c9bb0] font-mono opacity-50 text-xl animate-pulse col-span-full py-10">
                                Matrix is empty
                            </div>
                        )}
                    </div>
                )}

                {mode === 'stack' && (
                    <div className={`flex ${isDoubleStack ? 'flex-row gap-2' : 'flex-col-reverse gap-2 border-b-4 border-l-4 border-r-4 border-[#8c9bb0]/50 rounded-b-lg p-4 pb-2 w-48'} items-center justify-center`}>
                        {stackBlocks}
                        {(!displayData || displayData.length === 0) && !isDoubleStack && (
                            <div className="text-[#8c9bb0] font-mono opacity-50 text-md animate-pulse py-10">
                                Stack is empty
                            </div>
                        )}
                    </div>
                )}

                {(mode === 'queue' || mode === 'circularqueue') && (
                    <div className="flex flex-col items-center justify-center w-full max-w-5xl py-12">
                        <div className="flex gap-2">
                            {queueBlocks}
                        </div>
                    </div>
                )}

                {['sll', 'dll', 'cll'].includes(mode) && (
                    <div className="flex flex-col items-center justify-center w-full max-w-5xl py-16">
                        <div className="flex relative z-10 w-fit">
                            {linkedListBlocks}

                            {mode === 'cll' && displayData && displayData.length > 1 && (
                                <div
                                    className="absolute -top-12 left-6 right-6 h-14 border-t-2 border-l-2 border-r-2 border-[#4a5568] border-dashed rounded-t-xl z-0 pointer-events-none"
                                >
                                    <div className="absolute -bottom-[2px] -left-[6px] w-0 h-0 border-x-[5px] border-x-transparent border-t-[8px] border-t-[#4a5568]"></div>
                                </div>
                            )}
                        </div>
                        {(!displayData || displayData.length === 0) && (
                            <div className="text-[#8c9bb0] font-mono opacity-50 text-xl animate-pulse">
                                Linked List is empty
                            </div>
                        )}
                    </div>
                )}

                {mode === 'bst' && (
                    <div className="absolute inset-0 pointer-events-none">
                        <svg className="absolute inset-0 w-full h-full z-0 overflow-visible">
                            {treeBlocks?.lines}
                        </svg>
                        <div className="absolute inset-0 z-10 w-full h-full">
                            {treeBlocks?.nodes}
                        </div>
                        {(!displayData || displayData.length === 0) && (
                            <div className="flex items-center justify-center w-full h-full text-[#8c9bb0] font-mono opacity-50 text-xl animate-pulse">
                                BST is empty
                            </div>
                        )}
                    </div>
                )}

                {mode === 'graph' && (
                    <div className="absolute inset-0 pointer-events-none">
                        <svg className="absolute inset-0 w-full h-full z-0 overflow-visible">
                            {isDirected && (
                                <defs>
                                    <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="0" refY="2" orient="auto">
                                        <polygon points="0 0, 6 2, 0 4" fill="#4a5568" />
                                    </marker>
                                </defs>
                            )}
                            {graphBlocks?.lines}
                        </svg>
                        <div className="absolute inset-0 z-10 w-full h-full">
                            {graphBlocks?.nodes}
                        </div>
                        {(!displayData || displayData.length === 0) && (
                            <div className="flex items-center justify-center w-full h-full text-[#8c9bb0] font-mono opacity-50 text-xl animate-pulse">
                                Graph is empty
                            </div>
                        )}
                    </div>
                )}

            </div>
        </main>
    );
}
