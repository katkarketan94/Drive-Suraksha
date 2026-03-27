import React from 'react';
import { 
  ShieldAlert, 
  Waves, 
  Car, 
  ArrowLeftRight, 
  Volume2, 
  PersonStanding,
  AlertTriangle,
  Activity,
  MapPin,
  Clock
} from 'lucide-react';

export function Cockpit() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0d12] text-white font-sans overflow-hidden select-none">
      
      {/* Top Zone (60% height) - Video Feed */}
      <div className="relative h-[60vh] w-full bg-gradient-to-b from-slate-900 via-slate-800 to-zinc-950 flex-shrink-0">
        
        {/* Top-left badge */}
        <div className="absolute top-6 left-6 flex items-center gap-3 bg-black/50 backdrop-blur-md px-4 py-2 rounded-sm border border-white/10">
          <div className="w-3 h-3 rounded-full bg-[#ef4444] animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
          <span className="font-mono text-sm tracking-wider font-semibold text-white">LIVE • DASHCAM</span>
        </div>

        {/* Top-right chip */}
        <div className="absolute top-6 right-6 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-sm border border-[#00b8d9]/30">
          <Activity className="w-4 h-4 text-[#00b8d9] animate-pulse" />
          <span className="font-mono text-xs text-[#00b8d9] tracking-widest font-medium">CV DETECTING</span>
        </div>

        {/* Scanning line animation */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00b8d9] shadow-[0_0_15px_rgba(0,184,217,1)] opacity-70"
             style={{ animation: 'scan 3s linear infinite' }}>
           <style>
            {`
              @keyframes scan {
                0% { transform: translateY(0); opacity: 0; }
                10% { opacity: 0.8; }
                90% { opacity: 0.8; }
                100% { transform: translateY(60vh); opacity: 0; }
              }
            `}
          </style>
        </div>

        {/* Bounding Box (Pothole) */}
        <div className="absolute bottom-[15%] left-[45%] w-56 h-40 border-2 border-dashed border-[#ef4444] bg-[#ef4444]/10 flex flex-col justify-start">
          <div className="bg-[#ef4444] text-white font-mono text-xs px-2 py-1 inline-block self-start -mt-6">
            POTHOLE 76%
          </div>
        </div>

        {/* Bottom-left distance HUD */}
        <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-yellow-500/20 border border-yellow-500/50 backdrop-blur-md px-4 py-2 rounded-sm">
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
          <span className="font-mono text-lg font-bold text-yellow-400 tracking-tight">⚠ POTHOLE 45m — CAUTION</span>
        </div>
      </div>

      {/* Bottom Row (40% height) - 3 Panels */}
      <div className="flex h-[40vh] w-full p-4 gap-4 bg-[#0a0d12]">
        
        {/* Panel 1: Hazard Grid */}
        <div className="flex-1 bg-[#111418] rounded-xl border border-white/5 p-5 flex flex-col">
          <h3 className="text-zinc-400 font-mono text-xs tracking-widest mb-4 uppercase">Detectors</h3>
          <div className="grid grid-cols-2 grid-rows-3 gap-3 flex-1">
            
            <div className="bg-[#00b8d9]/10 border border-[#00b8d9]/40 rounded-lg p-3 flex items-center justify-between shadow-[0_0_15px_rgba(0,184,217,0.15)]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#00b8d9]" />
                <span className="font-medium text-white text-sm">Pothole</span>
              </div>
              <div className="w-8 h-4 bg-[#00b8d9] rounded-full relative">
                <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-400">
                <Waves className="w-5 h-5" />
                <span className="font-medium text-sm">Waterlog</span>
              </div>
              <div className="w-8 h-4 bg-zinc-700 rounded-full relative">
                <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-zinc-400 rounded-full"></div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-400">
                <Car className="w-5 h-5" />
                <span className="font-medium text-sm">Lane Viol.</span>
              </div>
              <div className="w-8 h-4 bg-zinc-700 rounded-full relative">
                <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-zinc-400 rounded-full"></div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-400">
                <ArrowLeftRight className="w-5 h-5" />
                <span className="font-medium text-sm">Wrong Side</span>
              </div>
              <div className="w-8 h-4 bg-zinc-700 rounded-full relative">
                <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-zinc-400 rounded-full"></div>
              </div>
            </div>

            <div className="bg-[#00b8d9]/10 border border-[#00b8d9]/40 rounded-lg p-3 flex items-center justify-between shadow-[0_0_15px_rgba(0,184,217,0.15)]">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-[#00b8d9]" />
                <span className="font-medium text-white text-sm">Honk Spike</span>
              </div>
              <div className="w-8 h-4 bg-[#00b8d9] rounded-full relative">
                <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-400">
                <PersonStanding className="w-5 h-5" />
                <span className="font-medium text-sm">Ped Xing</span>
              </div>
              <div className="w-8 h-4 bg-zinc-700 rounded-full relative">
                <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-zinc-400 rounded-full"></div>
              </div>
            </div>

          </div>
        </div>

        {/* Panel 2: Score Panel */}
        <div className="flex-1 bg-[#111418] rounded-xl border border-white/5 p-5 flex flex-col items-center justify-center relative">
           <div className="relative w-48 h-32 flex flex-col items-center justify-end overflow-hidden">
              {/* Semi-circle SVG */}
              <svg className="absolute top-0 w-48 h-48" viewBox="0 0 100 100">
                {/* Background Track */}
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1f2329" strokeWidth="8" strokeLinecap="round" />
                {/* Score Track (Amber for Moderate) */}
                <path d="M 10 50 A 40 40 0 0 1 80 18" fill="none" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              </svg>
              
              <div className="absolute bottom-2 flex flex-col items-center">
                <span className="text-5xl font-bold tracking-tighter text-white leading-none">83</span>
              </div>
           </div>
           
           <div className="mt-4 text-center">
             <div className="text-sm font-mono text-zinc-400 tracking-widest">CIVIC SCORE</div>
             <div className="mt-2 inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded text-xs font-bold uppercase tracking-wider">
               Moderate Risk
             </div>
           </div>
        </div>

        {/* Panel 3: Status Panel */}
        <div className="flex-1 bg-[#111418] rounded-xl border border-white/5 p-5 flex flex-col">
          <h3 className="text-zinc-400 font-mono text-xs tracking-widest uppercase mb-4">Telemetry</h3>
          
          <div className="flex-1 flex flex-col gap-3">
            {/* Location */}
            <div className="flex items-center gap-4 bg-white/5 rounded-lg p-3 border border-white/5">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 font-mono mb-0.5">LOCATION</div>
                <div className="text-sm font-medium text-white">Sion Circle, MUM</div>
              </div>
            </div>

            <div className="flex gap-3">
              {/* Detector Status */}
              <div className="flex-1 bg-white/5 rounded-lg p-3 border border-white/5 flex flex-col justify-center">
                <div className="text-[10px] text-zinc-500 font-mono mb-1">CV ENGINE</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                  <span className="text-sm font-medium text-emerald-400">OpenCV Active</span>
                </div>
              </div>

              {/* Timer */}
              <div className="flex-1 bg-white/5 rounded-lg p-3 border border-white/5 flex flex-col justify-center">
                <div className="text-[10px] text-zinc-500 font-mono mb-1">SESSION</div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm font-mono text-white">4:23</span>
                </div>
              </div>
            </div>
            
            {/* Stat */}
            <div className="mt-auto bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg p-3 flex justify-between items-center">
                <span className="text-xs text-zinc-300 font-medium">Session Detections</span>
                <span className="text-[#ef4444] font-mono font-bold text-sm">5 POTHOLES</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
