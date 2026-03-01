import { create } from 'zustand';

export const useExecutionStore = create((set, get) => ({
    mode: 'array', // 'array' | 'stack' | 'double_stack'
    frames: [],
    currentStep: 0,
    isPlaying: false,
    speed: 3, // 1 to 5

    // Actions
    setMode: (mode) => {
        // Automatically reset execution state on mode change as requested
        set({ mode, frames: [], currentStep: 0, isPlaying: false });
    },

    setFrames: (frames) => set({ frames, currentStep: 0, isPlaying: false }),

    nextStep: () => set((state) => {
        if (state.currentStep < state.frames.length - 1) {
            return { currentStep: state.currentStep + 1 };
        }
        return { isPlaying: false };
    }),

    prevStep: () => set((state) => ({
        currentStep: Math.max(0, state.currentStep - 1)
    })),

    setIsPlaying: (isPlaying) => set({ isPlaying }),

    setSpeed: (speed) => set({ speed }),

    resetExecution: () => set({
        frames: [],
        currentStep: 0,
        isPlaying: false
    }),
}));
