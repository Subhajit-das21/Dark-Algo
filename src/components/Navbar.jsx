import React from 'react';
import { useExecutionStore } from '../store/useExecutionStore';

export default function Navbar() {
    const { mode, setMode } = useExecutionStore();

    const MODES = [
        { id: 'array', label: 'Array' },
        { id: 'array2d', label: '2D Array' },
        { id: 'stack', label: 'Stack' },
        { id: 'doublestack', label: 'Double Stack' },
        { id: 'queue', label: 'Queue' },
        { id: 'circularqueue', label: 'Circ. Queue' },
        { id: 'sll', label: 'SLL' },
        { id: 'dll', label: 'DLL' },
        { id: 'cll', label: 'CLL' },
        { id: 'bst', label: 'BST' },
        { id: 'graph', label: 'Graph' }
    ];

    return (
        <header className="flex justify-between items-center px-8 h-[60px] bg-black/90 border-b border-white/5 z-50">
            <div className="text-2xl font-bold tracking-[2px]">
                <span className="neon-text">DARK</span><span className="white-text">ALGO</span>
            </div>

            <nav className="flex gap-2 bg-white/5 p-1 rounded-[20px] overflow-x-auto custom-scrollbar max-w-[60vw]">
                {MODES.map(m => {
                    // special visual merging of double stack into stack active selection for Navbar aesthetics
                    const isActive = mode === m.id || (m.id === 'stack' && mode === 'doublestack');
                    // Hide double stack button since Stack Controls contains the trigger for Double
                    if (m.id === 'doublestack') return null;

                    return (
                        <button
                            key={m.id}
                            onClick={() => setMode(m.id)}
                            className={`px-4 py-1.5 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${isActive ? 'bg-[#19ff9c] text-black shadow-[0_0_15px_rgba(25,255,156,0.2)]' : 'text-[#8c9bb0] hover:text-white'}`}
                        >
                            {m.label}
                        </button>
                    );
                })}
            </nav>

            <div className="flex items-center gap-6">
                <a href="#" className="text-[#19ff9c] text-sm hover:underline">GitHub</a>
            </div>
        </header>
    );
}
