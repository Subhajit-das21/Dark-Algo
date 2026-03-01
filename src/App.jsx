import React, { useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import ControlPanel from './components/ControlPanel';
import IntelligencePanel from './components/IntelligencePanel';
import VisualizationCanvas from './components/VisualizationCanvas';
import { useExecutionStore } from './store/useExecutionStore';

function App() {
  const { isPlaying, speed, nextStep, frames, currentStep, setIsPlaying } = useExecutionStore();
  const timerRef = useRef(null);

  // Execution Engine Loop
  useEffect(() => {
    if (isPlaying) {
      if (currentStep >= frames.length - 1) {
        setIsPlaying(false);
        return;
      }

      const speedMs = [1000, 500, 200, 50, 10][speed - 1] || 200;

      timerRef.current = setTimeout(() => {
        nextStep();
      }, speedMs);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, currentStep, speed, frames, nextStep, setIsPlaying]);

  return (
    <div className="flex flex-col h-screen w-screen app-container text-white overflow-hidden bg-[#020306] relative">

      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#19ff9c] rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#b366ff] rounded-full mix-blend-screen filter blur-[180px] opacity-10 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] bg-[#00e5ff] rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-pulse-slow" style={{ animationDelay: '4s' }}></div>

      <div className="absolute inset-0 bg-grid-pattern z-0 opacity-80 mix-blend-overlay"></div>

      <div className="relative z-10 flex flex-col h-full w-full">
        <Navbar />
        <div className="flex flex-1 overflow-hidden p-4 gap-4 relative max-w-[2000px] mx-auto w-full">
          <ControlPanel />
          <VisualizationCanvas />
          <IntelligencePanel />
        </div>
      </div>

      {/* Mobile Block Overlay */}
      <div className="fixed inset-0 z-[100] flex md:hidden flex-col items-center justify-center p-8 text-center bg-[#020306]/95 backdrop-blur-2xl">
        <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-[#ff3366]/20 to-[#b366ff]/20 border border-[#ff3366]/30 flex items-center justify-center shadow-[0_0_30px_rgba(255,51,102,0.3)] animate-[float_4s_ease-in-out_infinite]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#ff3366]">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
        </div>
        <h2 className="text-xl font-bold tracking-[2px] text-white/90 mb-3 uppercase">Desktop Required</h2>
        <p className="text-sm text-[#8c9bb0] leading-relaxed max-w-[280px]">
          DarkAlgo is a high-fidelity visualization engine optimized for large viewports.
          <br /><br />
          Please <strong>rotate your device</strong> or switch to a <strong className="text-white">Desktop environment</strong> for the full mathematical experience.
        </p>
      </div>

    </div>
  );
}

export default App;
