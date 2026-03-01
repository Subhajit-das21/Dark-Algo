import React, { useState } from 'react';

export default function Dropdown({ title, children, defaultOpen = false }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center bg-[#ffffff0d] hover:bg-[#ffffff1a] border border-white/5 px-4 py-3 rounded-t-lg transition-colors duration-200"
            >
                <h3 className="text-sm text-[#8c9bb0] uppercase tracking-wider font-semibold">{title}</h3>
                <svg
                    className={`w-4 h-4 text-[#8c9bb0] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out border border-t-0 border-white/5 rounded-b-lg bg-black/20 ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
}
