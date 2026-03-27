import React from "react";
import { 
  AlertTriangle, 
  Droplets, 
  MapPin, 
  Activity, 
  Volume2, 
  PersonStanding,
  Video,
  Radio,
  Clock,
  Gauge,
  Zap
} from "lucide-react";

export function IncidentBoard() {
  const incidents = [
    {
      id: "pothole",
      name: "Pothole Detected",
      icon: <AlertTriangle className="w-8 h-8 text-amber-500" />,
      impact: "−15 pts",
      active: true,
    },
    {
      id: "waterlogging",
      name: "Waterlogging",
      icon: <Droplets className="w-8 h-8 text-blue-500" />,
      impact: "−5 pts",
      active: true,
    },
    {
      id: "lane",
      name: "Lane Violation",
      icon: <Zap className="w-8 h-8 text-neutral-400" />,
      impact: "−10 pts",
      active: false,
    },
    {
      id: "wrong-side",
      name: "Wrong Side Driving",
      icon: <MapPin className="w-8 h-8 text-neutral-400" />,
      impact: "−20 pts",
      active: false,
    },
    {
      id: "honking",
      name: "Honking Spike",
      icon: <Volume2 className="w-8 h-8 text-neutral-400" />,
      impact: "−5 pts",
      active: false,
    },
    {
      id: "pedestrian",
      name: "Ped Crossing",
      icon: <PersonStanding className="w-8 h-8 text-neutral-400" />,
      impact: "−10 pts",
      active: false,
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 p-6 font-sans selection:bg-red-500/30 flex flex-col gap-6">
      {/* Top Header Strip */}
      <header className="flex items-center justify-between bg-neutral-900 border border-white/10 rounded-2xl px-6 py-4 shadow-xl">
        <div className="flex items-center gap-3 w-1/3">
          <div className="flex items-center justify-center w-3 h-3 rounded-full bg-red-500 animate-pulse ring-4 ring-red-500/20" />
          <span className="text-sm font-semibold tracking-wide text-neutral-300">
            LIVE SESSION — Sion Circle, MUM
          </span>
        </div>
        
        <div className="w-1/3 flex justify-center items-baseline gap-1">
          <span className="text-5xl font-black text-red-500 tracking-tighter">68</span>
          <span className="text-xl font-medium text-neutral-500">/100</span>
        </div>
        
        <div className="w-1/3 flex items-center justify-end gap-4">
          <div className="px-3 py-1.5 bg-red-500/10 text-red-500 font-bold text-sm rounded-lg border border-red-500/20">
            HIGH RISK
          </div>
          <div className="text-sm font-medium text-neutral-400 bg-neutral-800 px-3 py-1.5 rounded-lg border border-white/5">
            5 events
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex gap-6 flex-1 min-h-0">
        {/* Left Zone (40%) */}
        <div className="w-[40%] flex flex-col gap-4">
          {/* Video Feed Tile */}
          <div className="relative aspect-video bg-neutral-900 rounded-2xl border border-white/10 overflow-hidden shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-tr from-neutral-950/80 via-neutral-900/40 to-transparent z-10" />
            
            {/* Mock Video Content */}
            <div className="absolute inset-0 flex items-center justify-center text-neutral-800">
              <Video className="w-24 h-24 opacity-20" />
            </div>

            {/* Bounding Box Overlay */}
            <div className="absolute top-[40%] left-[30%] w-32 h-24 border-2 border-amber-500 bg-amber-500/10 z-20 shadow-[0_0_15px_rgba(245,158,11,0.3)] group-hover:bg-amber-500/20 transition-colors">
              <div className="absolute -top-6 left-[-2px] bg-amber-500 text-black text-xs font-bold px-2 py-0.5 whitespace-nowrap">
                POTHOLE 76%
              </div>
            </div>

            {/* CV Active Chip */}
            <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <Radio className="w-3.5 h-3.5 text-green-400 animate-pulse" />
              <span className="text-xs font-bold text-white tracking-wider">CV ACTIVE</span>
            </div>
          </div>

          {/* Metric Mini-grid */}
          <div className="grid grid-cols-2 gap-3 h-full">
            <div className="bg-neutral-900 border border-white/5 rounded-xl p-4 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-neutral-400 mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Potholes</span>
              </div>
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <div className="bg-neutral-900 border border-white/5 rounded-xl p-4 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-neutral-400 mb-1">
                <Gauge className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Speed</span>
              </div>
              <span className="text-2xl font-bold text-white">28 <span className="text-sm font-normal text-neutral-500">km/h</span></span>
            </div>
            <div className="bg-neutral-900 border border-white/5 rounded-xl p-4 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-neutral-400 mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Distance</span>
              </div>
              <span className="text-2xl font-bold text-white">4.2 <span className="text-sm font-normal text-neutral-500">km</span></span>
            </div>
            <div className="bg-neutral-900 border border-white/5 rounded-xl p-4 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-neutral-400 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Session</span>
              </div>
              <span className="text-2xl font-bold text-white">6:14</span>
            </div>
          </div>
        </div>

        {/* Right Zone (60%) */}
        <div className="w-[60%] grid grid-cols-2 gap-4 auto-rows-fr">
          {incidents.map((incident) => (
            <div 
              key={incident.id}
              className={`relative overflow-hidden rounded-xl flex flex-col p-5 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-2xl ${
                incident.active 
                  ? "bg-red-950/20 border-l-4 border-red-500 border-y border-r border-y-white/5 border-r-white/5 shadow-lg" 
                  : "bg-neutral-900 border border-white/5 hover:border-white/10"
              }`}
            >
              {/* Top Row: Icon + Status */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${incident.active ? "bg-red-950/40" : "bg-neutral-950"}`}>
                  {incident.icon}
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold tracking-widest ${incident.active ? "text-red-500" : "text-neutral-500"}`}>
                    {incident.active ? "ACTIVE" : "INACTIVE"}
                  </span>
                  {/* Mock Toggle */}
                  <div className={`w-10 h-5 rounded-full p-0.5 flex items-center transition-colors ${incident.active ? "bg-red-500" : "bg-neutral-800"}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${incident.active ? "translate-x-5" : "translate-x-0"}`} />
                  </div>
                </div>
              </div>

              {/* Bottom Row: Name + Impact */}
              <div className="mt-auto flex items-end justify-between">
                <h3 className={`font-semibold text-lg max-w-[60%] leading-tight ${incident.active ? "text-white" : "text-neutral-300"}`}>
                  {incident.name}
                </h3>
                <div className={`px-2.5 py-1 rounded-md text-sm font-bold ${
                  incident.active ? "bg-red-500/20 text-red-400" : "bg-neutral-800 text-neutral-400"
                }`}>
                  {incident.impact}
                </div>
              </div>
              
              {/* Subtle background gradient for active cards */}
              {incident.active && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[50px] -z-10 rounded-full" />
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
