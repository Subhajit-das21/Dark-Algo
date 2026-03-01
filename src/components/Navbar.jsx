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
        <header className="flex justify-between items-center px-8 mx-4 mt-4 h-[64px] rounded-2xl glass-strong z-50">
            <div className="text-2xl font-bold tracking-[3px] flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-[#19ff9c] to-[#00e5ff] shadow-[0_0_15px_rgba(25,255,156,0.4)] animate-pulse-slow"></div>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">DARK</span>
                <span className="neon-text font-black">ALGO</span>
            </div>

            <nav className="flex gap-2 bg-[#020306]/60 border border-white/5 p-1.5 rounded-[24px] overflow-x-auto custom-scrollbar max-w-[60vw] shadow-inner">
                {MODES.map(m => {
                    const isActive = mode === m.id || (m.id === 'stack' && mode === 'doublestack');
                    if (m.id === 'doublestack') return null;

                    return (
                        <button
                            key={m.id}
                            onClick={() => setMode(m.id)}
                            className={`px-5 py-1.5 rounded-[20px] text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-300 relative ${isActive ? 'bg-gradient-to-r from-[#19ff9c] to-[#00e5ff] text-[#020306] shadow-[0_0_20px_rgba(25,255,156,0.3)] transform scale-105 z-10' : 'text-[#8c9bb0] hover:text-white hover:bg-white/5'}`}
                        >
                            {m.label}
                        </button>
                    );
                })}
            </nav>

            <div className="flex items-center gap-6">
                <button className="px-4 py-1.5 rounded-full border border-white/10 text-xs font-mono text-[#8c9bb0] hover:text-white hover:border-white/30 transition-all bg-white/5">
                    v2.0.0
                </button>
                <a href="#" className="neon-text-blue text-sm font-semibold hover:underline flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.45-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 10 0 0 12 2z" /></svg>
                    GitHub
                </a>
            </div>
        </header>
    );
}
