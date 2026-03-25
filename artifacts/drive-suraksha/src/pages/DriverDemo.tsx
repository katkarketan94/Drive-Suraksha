import { useState } from "react";
import { AlertTriangle, MapPin, Loader2, Sparkles, Activity } from "lucide-react";
import { useScoringEngine, HAZARDS, HazardType } from "@/hooks/use-scoring-engine";
import { ScoreDial } from "@/components/ui/score-dial";
import { RiskBadge } from "@/components/ui/risk-badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function DriverDemo() {
  const { currentScore, riskLevel, activeHazards, toggleHazard, isInferring } = useScoringEngine(85);
  const [showSummary, setShowSummary] = useState(false);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto h-full flex flex-col">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Live AI Edge Demo</h1>
          <p className="text-muted-foreground mt-1">Simulate road conditions to see real-time inference and scoring.</p>
        </div>
        <div className="flex items-center space-x-2 bg-card border border-white/10 px-4 py-2 rounded-lg">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Silk Board Junction, BLR</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* LEFT: Camera Feed Simulation */}
        <div className="lg:col-span-4 rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl flex flex-col bg-black">
          <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/10">
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-xs font-bold font-mono text-white">REC • 1080p 60fps</span>
          </div>
          
          <div className="flex-1 relative overflow-hidden">
            <img 
              src={`${import.meta.env.BASE_URL}images/dashcam-view.png`} 
              alt="Dashcam Feed" 
              className="w-full h-full object-cover opacity-80"
            />
            {/* AI Scanning Overlay */}
            <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan shadow-[0_0_15px_rgba(0,184,217,1)]" />
            
            {/* Bounding Boxes for active hazards */}
            <AnimatePresence>
              {Array.from(activeHazards).map((hazardId, i) => {
                const hazard = HAZARDS.find(h => h.id === hazardId);
                // Fake random positions for bounding boxes based on index
                const positions = [
                  { top: '60%', left: '30%', width: '40%', height: '30%' },
                  { top: '40%', left: '10%', width: '20%', height: '40%' },
                  { top: '50%', left: '60%', width: '30%', height: '20%' },
                ];
                const pos = positions[i % positions.length];
                
                return (
                  <motion.div
                    key={hazardId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={cn(
                      "absolute border-2 bg-black/20 backdrop-blur-[2px]",
                      hazard?.severity === 'high' ? 'border-destructive' : 'border-warning'
                    )}
                    style={pos}
                  >
                    <div className={cn(
                      "absolute -top-6 left-[-2px] px-2 py-0.5 text-[10px] font-bold uppercase whitespace-nowrap",
                      hazard?.severity === 'high' ? 'bg-destructive text-white' : 'bg-warning text-black'
                    )}>
                      {hazard?.label} {Math.floor(Math.random() * 10 + 85)}%
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {isInferring && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-30">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* MIDDLE: Detection Toggles */}
        <div className="lg:col-span-4 glass-card rounded-3xl p-6 flex flex-col h-[500px] lg:h-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg flex items-center">
              <Activity className="w-5 h-5 mr-2 text-primary" />
              Environment Injector
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {HAZARDS.map((hazard) => {
              const isActive = activeHazards.has(hazard.id);
              return (
                <button
                  key={hazard.id}
                  onClick={() => toggleHazard(hazard.id)}
                  disabled={isInferring}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left group",
                    isActive 
                      ? "bg-primary/10 border-primary/50 shadow-[0_0_15px_rgba(0,184,217,0.15)]" 
                      : "bg-background/50 border-white/5 hover:border-white/20 hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                      isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:text-foreground"
                    )}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={cn("font-medium transition-colors", isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>
                        {hazard.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">Impact: {hazard.impact} pts</p>
                    </div>
                  </div>
                  
                  {/* Switch visual */}
                  <div className={cn(
                    "w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out relative",
                    isActive ? "bg-primary" : "bg-muted-foreground/30"
                  )}>
                    <div className={cn(
                      "w-4 h-4 rounded-full bg-white transition-transform duration-300 ease-in-out shadow-sm",
                      isActive ? "translate-x-6" : "translate-x-0"
                    )} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Real-time Score Panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card rounded-3xl p-8 flex flex-col items-center justify-center flex-1 relative overflow-hidden text-center">
            {/* Background glow based on risk */}
            <div className={cn(
              "absolute inset-0 opacity-10 transition-colors duration-1000 blur-3xl",
              riskLevel === 'HIGH' ? "bg-destructive" : riskLevel === 'MODERATE' ? "bg-warning" : "bg-success"
            )} />
            
            <RiskBadge level={riskLevel} className="mb-8 relative z-10 scale-110" />
            
            <ScoreDial score={currentScore} size={240} className="mb-6 relative z-10" />
            
            <AnimatePresence mode="popLayout">
              {activeHazards.size > 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full space-y-2 relative z-10"
                >
                  {Array.from(activeHazards).slice(0, 2).map(id => {
                    const h = HAZARDS.find(x => x.id === id);
                    return (
                      <div key={id} className="flex items-center justify-between px-4 py-2 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive font-medium">
                        <span className="flex items-center"><AlertTriangle className="w-4 h-4 mr-2" /> {h?.label}</span>
                        <span>{h?.impact}</span>
                      </div>
                    )
                  })}
                  {activeHazards.size > 2 && (
                    <p className="text-xs text-muted-foreground pt-1">+{activeHazards.size - 2} more hazards</p>
                  )}
                </motion.div>
              ) : (
                <motion.p 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-success font-medium relative z-10 flex items-center"
                >
                  <Sparkles className="w-4 h-4 mr-2" /> Optimal driving behavior
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setShowSummary(!showSummary)}
            className="w-full py-4 rounded-2xl font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg shadow-secondary/20 transition-all active:scale-95 flex items-center justify-center"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Safety Summary
          </button>
          
          <AnimatePresence>
            {showSummary && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card p-4 rounded-2xl text-sm leading-relaxed overflow-hidden"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-bold text-primary uppercase">AI Analysis</span>
                </div>
                {riskLevel === 'HIGH' ? 
                  "Immediate intervention recommended. Multiple high-severity hazards detected reducing civic score severely. Consider re-routing or taking a break." :
                  riskLevel === 'MODERATE' ?
                  "Caution advised. Some civic infractions detected. Please adhere to lane discipline and observe local conditions to improve score." :
                  "Excellent driving record maintained. No current hazards affecting your civic score. Keep up the good work."
                }
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
