import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Camera, 
  Car, 
  Zap,
  Activity,
  AlertCircle,
  Construction
} from 'lucide-react';

export function ScoreFirst() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(t => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const hazards = [
    { id: 'pothole', icon: Construction, label: 'Pothole', active: true },
    { id: 'tailgate', icon: Car, label: 'Tailgating', active: false },
    { id: 'speed', icon: Zap, label: 'Speed', active: false },
    { id: 'lane', icon: Activity, label: 'Lane', active: false },
    { id: 'stop', icon: AlertCircle, label: 'Stop Sign', active: false },
    { id: 'pedestrian', icon: AlertTriangle, label: 'Pedestrian', active: false },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col font-sans overflow-hidden">
      {/* Header Bar */}
      <header className="h-12 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2 text-emerald-500 font-semibold">
          <Shield className="w-5 h-5" />
          <span>DriveSuraksha</span>
        </div>
        
        <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
          <MapPin className="w-4 h-4 text-zinc-500" />
          Sion Circle, MUM
        </div>
        
        <div className="flex items-center gap-2 text-zinc-400 font-mono text-sm bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
          <Clock className="w-4 h-4 text-emerald-500/70" />
          {formatTime(time)}
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex flex-row overflow-hidden">
        
        {/* Left Column (38%) */}
        <section className="w-[38%] border-r border-zinc-800 bg-zinc-900/30 p-8 flex flex-col justify-center gap-10">
          
          {/* 1. Large Score Dial */}
          <div className="flex flex-col items-center">
            <div className="relative w-64 h-64 mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Track */}
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  className="text-zinc-800"
                />
                {/* Score Arc (Amber for 71) */}
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  strokeLinecap="round"
                  strokeDasharray="282.7" 
                  strokeDashoffset={282.7 - (282.7 * 0.71)}
                  className="text-amber-500 transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center mt-2">
                <span className="text-6xl font-black tracking-tighter text-zinc-50">71</span>
                <span className="text-xs font-bold text-zinc-400 tracking-widest mt-1">/100</span>
              </div>
            </div>
            
            <h2 className="text-zinc-400 font-bold tracking-widest text-sm mb-3">CIVIC SCORE</h2>
            <div className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold text-xs tracking-wider">
              MODERATE RISK
            </div>
          </div>

          {/* 2. Hazard Chips */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {hazards.map((h) => {
              const Icon = h.icon;
              return (
                <div 
                  key={h.id} 
                  className={`
                    flex items-center gap-2 p-2 rounded-lg border text-xs font-medium transition-colors
                    ${h.active 
                      ? 'bg-red-500/10 border-red-500/30 text-red-500' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-500'}
                  `}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${h.active ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-zinc-700'}`} />
                  <Icon className="w-3.5 h-3.5" />
                  <span className="truncate">{h.label}</span>
                </div>
              );
            })}
          </div>

          {/* 3. Mini Stats Block */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 grid grid-cols-3 divide-x divide-zinc-800">
            <div className="flex flex-col items-center justify-center px-2 text-center">
              <span className="text-xl font-bold text-zinc-200">3</span>
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mt-1 leading-tight">Hazards Active</span>
            </div>
            <div className="flex flex-col items-center justify-center px-2 text-center">
              <span className="text-xl font-bold text-red-400">−40</span>
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mt-1 leading-tight">Points</span>
            </div>
            <div className="flex flex-col items-center justify-center px-2 text-center">
              <span className="text-xl font-bold text-zinc-200">4</span>
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mt-1 leading-tight">Events Today</span>
            </div>
          </div>

        </section>

        {/* Right Column (62%) */}
        <section className="w-[62%] p-6 flex flex-col gap-4 bg-black">
          
          {/* 1. Video Feed Placeholder */}
          <div className="relative flex-1 rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-800/40 to-zinc-900/80 overflow-hidden flex flex-col justify-end group">
            
            {/* Fake scene / grid overlay */}
            <div className="absolute inset-0 opacity-20" 
                 style={{ backgroundImage: 'linear-gradient(#3f3f46 1px, transparent 1px), linear-gradient(90deg, #3f3f46 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
            />
            
            {/* Scanning line animation */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-cyan-500/0 via-cyan-500/10 to-cyan-500/40 border-b border-cyan-500/50 animate-[scan_3s_ease-in-out_infinite]" />

            {/* Bounding Box */}
            <div className="absolute top-1/2 left-1/3 w-32 h-24 border-2 border-red-500 bg-red-500/10 rounded-sm shadow-[0_0_15px_rgba(239,68,68,0.5)]">
              <div className="absolute -top-6 left-[-2px] bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 whitespace-nowrap">
                POTHOLE 92%
              </div>
            </div>

            {/* Red Alert Overlay */}
            <div className="relative z-10 w-full bg-gradient-to-t from-red-950/90 to-transparent pt-20 pb-6 px-6 border-t border-red-900/50">
              <div className="flex items-center gap-3 text-red-500 animate-pulse">
                <AlertTriangle className="w-8 h-8" />
                <h3 className="text-2xl font-black tracking-tight">POTHOLE DETECTED</h3>
              </div>
            </div>
          </div>

          {/* 2. CV Detector Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-zinc-950 flex items-center justify-center border border-zinc-800">
                <Camera className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-zinc-200">OpenCV Vision Engine</div>
                <div className="text-xs text-zinc-500 mt-0.5 font-mono">Model: yolov8-nano • 200ms/frame</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-cyan-950/30 border border-cyan-900/50 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse" />
              <span className="text-cyan-400 text-xs font-bold tracking-wider">ACTIVE</span>
            </div>
          </div>

          {/* 3. Guidance Card */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 shrink-0 relative overflow-hidden">
            {/* Warning strip */}
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-amber-500" />
            
            <div className="flex items-start gap-4">
              <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500 mt-1">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-amber-400 mb-1">Pothole ahead 45m</h4>
                <p className="text-amber-500/80 text-sm mb-4">Immediate action required to avoid vehicle damage.</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm text-zinc-300 bg-black/20 p-2 rounded border border-amber-500/10">
                    <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-400">1</div>
                    <span>Reduce speed to <strong className="text-white">15 km/h</strong></span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-300 bg-black/20 p-2 rounded border border-amber-500/10">
                    <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-400">2</div>
                    <span>Move safely to <strong className="text-white">right lane</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(600px); opacity: 0; }
        }
      `}} />
    </div>
  );
}
