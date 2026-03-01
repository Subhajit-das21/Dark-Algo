import React, { useState, useEffect } from 'react';
import { useExecutionStore } from '../../store/useExecutionStore';
import { useStructureStore } from '../../store/useStructureStore';
import Dropdown from '../ui/Dropdown';
import {
    pushSimpleStack, popSimpleStack, peekSimpleStack,
    pushDoubleStack1, pushDoubleStack2, popDoubleStack1, popDoubleStack2
} from '../../utils/stackAlgorithms';

export default function StackControls() {
    const { isPlaying, setFrames, resetExecution } = useExecutionStore();
    const { stackData, setStackData, maxStackSize, top1, setTop1, top2, setTop2 } = useStructureStore();

    const [inputValue, setInputValue] = useState('');
    const [stackType, setStackType] = useState('simple'); // 'simple' or 'double'

    useEffect(() => {
        // Initialize empty stack array based on maxStackSize
        if (stackData.length === 0) {
            if (stackType === 'simple') {
                setStackData([]);
                setTop1(-1);
            } else {
                setStackData(new Array(maxStackSize).fill(null));
                setTop1(-1);
                setTop2(maxStackSize);
            }
        }
        return () => resetExecution();
    }, [stackType, maxStackSize]);

    const handleSwitchType = (type) => {
        if (isPlaying) return;
        setStackType(type);
        resetExecution();
        if (type === 'simple') {
            setStackData([]);
            setTop1(-1);
        } else {
            setStackData(new Array(maxStackSize).fill(null));
            setTop1(-1);
            setTop2(maxStackSize);
        }
    };

    const executeSimple = (algoFn, actionStr, ...args) => {
        if (isPlaying) return;
        resetExecution();

        const state = useStructureStore.getState();
        const frames = algoFn(state.stackData, ...args, state.maxStackSize);
        setFrames(frames);

        if (actionStr === 'push') state.pushSimple(args[0]);
        else if (actionStr === 'pop') state.popSimple();
    };

    const executeDouble = (algoFn, actionStr, ...args) => {
        if (isPlaying) return;
        resetExecution();

        const state = useStructureStore.getState();
        const frames = algoFn(state.stackData, ...args, state.top1, state.top2, state.maxStackSize);
        setFrames(frames);

        if (actionStr === 'push1') state.pushDouble1(args[0]);
        else if (actionStr === 'push2') state.pushDouble2(args[0]);
        else if (actionStr === 'pop1') state.popDouble1();
        else if (actionStr === 'pop2') state.popDouble2();
    };

    return (
        <div className="flex flex-col gap-2">
            <Dropdown title="Stack Types" defaultOpen={true}>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        disabled={isPlaying}
                        onClick={() => handleSwitchType('simple')}
                        className={`p-2 rounded border transition-colors ${stackType === 'simple' ? 'bg-[#19ff9c]/20 border-[#19ff9c] text-[#19ff9c]' : 'bg-white/5 border-white/10 text-[#8c9bb0] hover:text-white'}`}
                    >
                        Simple Stack
                    </button>
                    <button
                        disabled={isPlaying}
                        onClick={() => handleSwitchType('double')}
                        className={`p-2 rounded border transition-colors ${stackType === 'double' ? 'bg-[#19ff9c]/20 border-[#19ff9c] text-[#19ff9c]' : 'bg-white/5 border-white/10 text-[#8c9bb0] hover:text-white'}`}
                    >
                        Double Stack
                    </button>
                </div>
            </Dropdown>

            {stackType === 'simple' ? (
                <Dropdown title="Basic Stack" defaultOpen={true}>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            placeholder="Value to push"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="flex-1 bg-black/30 border border-white/5 text-white p-2 rounded outline-none focus:border-[#19ff9c]"
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            disabled={isPlaying || !inputValue}
                            onClick={() => executeSimple(pushSimpleStack, 'push', parseInt(inputValue, 10) || inputValue)}
                            className="bg-white/5 border border-white/10 text-white p-2 rounded hover:bg-white/10 disabled:opacity-50 transition-colors"
                        >
                            Push
                        </button>
                        <button
                            disabled={isPlaying}
                            onClick={() => executeSimple(popSimpleStack, 'pop')}
                            className="bg-white/5 border border-white/10 text-white p-2 rounded hover:bg-white/10 disabled:opacity-50 transition-colors"
                        >
                            Pop
                        </button>
                        <button
                            disabled={isPlaying}
                            onClick={() => executeSimple(peekSimpleStack, 'peek')}
                            className="bg-white/5 border border-white/10 text-white p-2 rounded hover:bg-white/10 disabled:opacity-50 transition-colors"
                        >
                            Peek
                        </button>
                    </div>
                    <button
                        disabled={isPlaying}
                        onClick={() => { setStackData([]); setTop1(-1); resetExecution(); }}
                        className="mt-2 w-full bg-white/5 border border-white/5 text-[#8c9bb0] p-2 rounded hover:bg-white/10 hover:text-white disabled:opacity-50 transition-colors text-sm"
                    >
                        Clear Stack
                    </button>
                </Dropdown>
            ) : (
                <Dropdown title="Double Stack Ops" defaultOpen={true}>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            placeholder="Value"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="flex-1 bg-black/30 border border-white/5 text-white p-2 rounded outline-none focus:border-[#19ff9c]"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <button
                            disabled={isPlaying || !inputValue}
                            onClick={() => executeDouble(pushDoubleStack1, 'push1', parseInt(inputValue, 10))}
                            className="bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00e5ff] p-2 rounded hover:bg-[#00e5ff]/20 disabled:opacity-50 transition-colors"
                        >
                            Push S1
                        </button>
                        <button
                            disabled={isPlaying || !inputValue}
                            onClick={() => executeDouble(pushDoubleStack2, 'push2', parseInt(inputValue, 10))}
                            className="bg-[#b366ff]/10 border border-[#b366ff]/30 text-[#b366ff] p-2 rounded hover:bg-[#b366ff]/20 disabled:opacity-50 transition-colors"
                        >
                            Push S2
                        </button>
                        <button
                            disabled={isPlaying}
                            onClick={() => executeDouble(popDoubleStack1, 'pop1')}
                            className="bg-[#00e5ff]/5 border border-[#00e5ff]/20 text-[#00e5ff]/80 p-2 rounded hover:bg-[#00e5ff]/20 hover:text-[#00e5ff] disabled:opacity-50 transition-colors"
                        >
                            Pop S1
                        </button>
                        <button
                            disabled={isPlaying}
                            onClick={() => executeDouble(popDoubleStack2, 'pop2')}
                            className="bg-[#b366ff]/5 border border-[#b366ff]/20 text-[#b366ff]/80 p-2 rounded hover:bg-[#b366ff]/20 hover:text-[#b366ff] disabled:opacity-50 transition-colors"
                        >
                            Pop S2
                        </button>
                    </div>
                </Dropdown>
            )}
        </div>
    );
}
