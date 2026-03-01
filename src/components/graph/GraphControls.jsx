import React, { useState, useEffect } from 'react';
import { useExecutionStore } from '../../store/useExecutionStore';
import { useStructureStore } from '../../store/useStructureStore';
import Dropdown from '../ui/Dropdown';
import { graphBFS, graphDFS } from '../../utils/graphAlgorithms';

export default function GraphControls() {
    const { isPlaying, setFrames, resetExecution } = useExecutionStore();
    const { graphNodes, graphEdges, isDirected, setGraphState, resetGraph } = useStructureStore();

    const [nodeValue, setNodeValue] = useState('');
    const [sourceNode, setSourceNode] = useState('');
    const [targetNode, setTargetNode] = useState('');
    const [startNode, setStartNode] = useState('');

    useEffect(() => {
        // Init with a basic graph shape for demo purposes if empty
        if (graphNodes.length === 0) {
            setGraphState({
                graphNodes: [
                    { id: '1', value: 1, x: -60, y: -60 },
                    { id: '2', value: 2, x: 60, y: -60 },
                    { id: '3', value: 3, x: 0, y: 0 },
                    { id: '4', value: 4, x: -60, y: 60 },
                    { id: '5', value: 5, x: 60, y: 60 },
                ],
                graphEdges: [
                    { id: 'e1', source: '1', target: '3', weight: 1, isDirected },
                    { id: 'e2', source: '2', target: '3', weight: 1, isDirected },
                    { id: 'e3', source: '3', target: '4', weight: 1, isDirected },
                    { id: 'e4', source: '3', target: '5', weight: 1, isDirected },
                    { id: 'e5', source: '1', target: '2', weight: 1, isDirected },
                ]
            });
        }

        return () => {
            resetExecution();
            resetGraph();
        };
    }, [isDirected]);

    const handleAddNode = () => {
        if (isPlaying || !nodeValue) return;
        const val = parseInt(nodeValue, 10);
        if (isNaN(val)) return;

        // Give it a random circular coordinate mapping for demonstration
        const angle = Math.random() * Math.PI * 2;
        const radius = 80 + Math.random() * 40;

        const newNode = {
            id: 'n_' + Math.random().toString(36).substr(2, 9),
            value: val,
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius
        };

        setGraphState({ graphNodes: [...graphNodes, newNode] });
        setNodeValue('');
    };

    const handleAddEdge = () => {
        if (isPlaying || !sourceNode || !targetNode || sourceNode === targetNode) return;

        const src = graphNodes.find(n => n.value === parseInt(sourceNode, 10));
        const tgt = graphNodes.find(n => n.value === parseInt(targetNode, 10));

        if (!src || !tgt) return; // Nodes must exist

        // Prevent duplicate exact edges
        const exists = graphEdges.some(e =>
            (e.source === src.id && e.target === tgt.id) ||
            (!isDirected && e.source === tgt.id && e.target === src.id)
        );

        if (!exists) {
            const newEdge = {
                id: 'e_' + Math.random().toString(36).substr(2, 9),
                source: src.id,
                target: tgt.id,
                weight: 1,
                isDirected
            };
            setGraphState({ graphEdges: [...graphEdges, newEdge] });
        }
        setSourceNode('');
        setTargetNode('');
    };

    const executeTraversal = (algoFn) => {
        if (isPlaying || !startNode) return;
        resetExecution();

        const start = graphNodes.find(n => n.value === parseInt(startNode, 10));
        if (!start) return;

        const state = useStructureStore.getState();
        const frames = algoFn(state.graphNodes, state.graphEdges, start.id);
        setFrames(frames);
    };

    return (
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[75vh] pr-2 custom-scrollbar">
            <Dropdown title="Graph Builder" defaultOpen={true}>
                <div className="flex items-center justify-between mb-4 px-2">
                    <span className="text-white text-sm font-mono">Directed Edges</span>
                    <button
                        onClick={() => {
                            if (isPlaying) return;
                            resetExecution();
                            setGraphState({
                                isDirected: !isDirected,
                                graphEdges: graphEdges.map(e => ({ ...e, isDirected: !isDirected }))
                            });
                        }}
                        className={`w-10 h-5 rounded-full relative transition-colors ${isDirected ? 'bg-[#19ff9c]' : 'bg-[#4a5568]'}`}
                    >
                        <div className={`w-3 h-3 rounded-full bg-white absolute top-1 transition-transform ${isDirected ? 'translate-x-6' : 'translate-x-1'}`}></div>
                    </button>
                </div>

                <div className="h-px bg-white/5 w-full my-3"></div>
                <div className="text-xs text-[#8c9bb0] font-mono mb-2 px-1">ADD NODE</div>

                <div className="flex gap-2 mb-4">
                    <input
                        type="number"
                        placeholder="Value"
                        value={nodeValue}
                        onChange={(e) => setNodeValue(e.target.value)}
                        className="flex-1 bg-black/30 border border-white/5 text-white p-2 rounded outline-none focus:border-[#19ff9c]"
                    />
                    <button
                        disabled={isPlaying || !nodeValue}
                        onClick={handleAddNode}
                        className="bg-white/5 border border-white/10 text-white px-4 rounded hover:bg-white/10 disabled:opacity-50 transition-colors"
                    >
                        +
                    </button>
                </div>

                <div className="text-xs text-[#8c9bb0] font-mono mb-2 px-1">ADD EDGE</div>
                <div className="flex gap-2 mb-4">
                    <input
                        type="number"
                        placeholder="Src Val"
                        value={sourceNode}
                        onChange={(e) => setSourceNode(e.target.value)}
                        className="w-1/2 bg-black/30 border border-white/5 text-white p-2 rounded outline-none focus:border-[#19ff9c]"
                    />
                    <input
                        type="number"
                        placeholder="Tgt Val"
                        value={targetNode}
                        onChange={(e) => setTargetNode(e.target.value)}
                        className="w-1/2 bg-black/30 border border-white/5 text-white p-2 rounded outline-none focus:border-[#19ff9c]"
                    />
                </div>
                <button
                    disabled={isPlaying || !sourceNode || !targetNode}
                    onClick={handleAddEdge}
                    className="w-full bg-white/5 border border-white/10 text-white p-2 rounded hover:bg-[#19ff9c]/20 hover:text-[#19ff9c] disabled:opacity-50 transition-colors text-sm mb-4"
                >
                    Connect Nodes
                </button>

                <div className="h-px bg-white/5 w-full my-3"></div>
                <div className="text-xs text-[#8c9bb0] font-mono mb-2 px-1">PATHFINDING</div>

                <div className="flex gap-2 mb-3">
                    <input
                        type="number"
                        placeholder="Start Node Value"
                        value={startNode}
                        onChange={(e) => setStartNode(e.target.value)}
                        className="flex-1 bg-black/30 border border-white/5 text-white p-2 rounded outline-none focus:border-[#19ff9c]"
                    />
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                    <button
                        disabled={isPlaying || !startNode}
                        onClick={() => executeTraversal(graphBFS)}
                        className="bg-white/5 border border-white/10 text-[#56ccf2] p-2 rounded hover:bg-[#56ccf2]/20 disabled:opacity-50 transition-colors text-sm"
                    >
                        BFS
                    </button>
                    <button
                        disabled={isPlaying || !startNode}
                        onClick={() => executeTraversal(graphDFS)}
                        className="bg-white/5 border border-white/10 text-[#b366ff] p-2 rounded hover:bg-[#b366ff]/20 disabled:opacity-50 transition-colors text-sm"
                    >
                        DFS
                    </button>
                </div>

                <button
                    disabled={isPlaying}
                    onClick={() => {
                        setGraphState({ graphNodes: [], graphEdges: [] });
                        resetExecution();
                    }}
                    className="w-full bg-white/5 border border-white/5 text-[#ff3366] p-2 rounded hover:bg-[#ff3366]/10 disabled:opacity-50 transition-colors text-xs"
                >
                    Clear Canvas
                </button>
            </Dropdown>
        </div>
    );
}
