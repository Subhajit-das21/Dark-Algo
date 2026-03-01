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
    </div>
  );
}

export default App;
