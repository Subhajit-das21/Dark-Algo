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
    <div className="flex flex-col h-screen w-screen app-container text-white overflow-hidden bg-[#05060a]">
      <Navbar />
      <div className="flex flex-1 overflow-hidden p-2 gap-2 relative">
        <ControlPanel />
        <VisualizationCanvas />
        <IntelligencePanel />
      </div>
    </div>
  );
}

export default App;
