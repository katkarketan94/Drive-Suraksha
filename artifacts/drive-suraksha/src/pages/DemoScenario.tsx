import { useState, useEffect, useRef } from "react";
import { Play, Square, RotateCcw, ChevronRight, CheckCircle } from "lucide-react";
import { ScoreDial } from "@/components/ui/score-dial";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const SCENARIO_STEPS = [
  { id: 1, title: "Trip Started", desc: "Driver initiates route in normal conditions.", impact: 0, delay: 0 },
  { id: 2, title: "Pothole Detected", desc: "Edge AI identifies severe pothole cluster ahead.", impact: -10, delay: 3000 },
  { id: 3, title: "Alert Issued", desc: "Audio-visual alert sent to driver. Driver slows down.", impact: +2, delay: 2000 },
  { id: 4, title: "Lane Violation", desc: "Driver swerves into wrong lane to avoid pothole.", impact: -15, delay: 4000 },
  { id: 5, title: "Score Penalized", desc: "Civic driving score updated instantly in DB.", impact: 0, delay: 2000 },
  { id: 6, title: "City Operator Notified", desc: "Hotspot logged in City Intelligence dashboard.", impact: 0, delay: 3000 },
];

export default function DemoScenario() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(85);
  const [logs, setLogs] = useState<{time: string, msg: string, isBad: boolean}[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const addLog = (msg: string, isBad = false) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
    setLogs(prev => [{ time, msg, isBad }, ...prev]);
  };

  const startDemo = () => {
    if (currentStep >= SCENARIO_STEPS.length) resetDemo();
    setIsPlaying(true);
    if (currentStep === 0) addLog("Demo scenario initialized.");
  };

  const pauseDemo = () => {
    setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    addLog("Demo paused.");
  };

  const resetDemo = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setScore(85);
    setLogs([]);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // State Machine Effect
  useEffect(() => {
    if (!isPlaying) return;

    if (currentStep < SCENARIO_STEPS.length) {
      const step = SCENARIO_STEPS[currentStep];
      
      timerRef.current = setTimeout(() => {
        // Execute Step
        addLog(step.desc, step.impact < 0);
        if (step.impact !== 0) {
          setScore(prev => prev + step.impact);
        }
        
        // Move to next
        setCurrentStep(prev => prev + 1);
        
        if (currentStep === SCENARIO_STEPS.length - 1) {
          setIsPlaying(false);
          addLog("Scenario complete.");
        }
      }, step.delay || 1000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStep]);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold">Scenario Runner</h1>
          <p className="text-muted-foreground mt-1">Automated workflow demonstration of the platform.</p>
        </div>
        
        <div className="flex space-x-3">
          {!isPlaying ? (
            <button onClick={startDemo} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold flex items-center shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
              <Play className="w-4 h-4 mr-2" fill="currentColor" /> Play Demo
            </button>
          ) : (
            <button onClick={pauseDemo} className="bg-warning text-warning-foreground px-6 py-2.5 rounded-xl font-bold flex items-center shadow-lg shadow-warning/20 hover:bg-warning/90 transition-all active:scale-95">
              <Square className="w-4 h-4 mr-2" fill="currentColor" /> Pause
            </button>
          )}
          <button onClick={resetDemo} className="bg-white/10 hover:bg-white/20 text-foreground px-4 py-2.5 rounded-xl font-bold flex items-center transition-all">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left: Progress Steps */}
        <div className="lg:col-span-4 glass-card rounded-3xl p-6 overflow-y-auto">
          <h3 className="font-bold text-lg mb-6">Execution Sequence</h3>
          <div className="space-y-4">
            {SCENARIO_STEPS.map((step, idx) => {
              const isPast = idx < currentStep;
              const isCurrent = idx === currentStep && isPlaying;
              
              return (
                <div key={step.id} className={cn(
                  "p-4 rounded-2xl border transition-all duration-500",
                  isCurrent ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(0,184,217,0.15)]" : 
                  isPast ? "bg-white/5 border-white/10 opacity-70" : "bg-transparent border-transparent opacity-40 grayscale"
                )}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center">
                      Step {step.id}
                      {isPast && <CheckCircle className="w-4 h-4 ml-2 text-success" />}
                      {isCurrent && <div className="w-2 h-2 rounded-full bg-primary animate-pulse ml-2" />}
                    </span>
                    {step.impact !== 0 && (
                      <span className={cn("text-xs font-bold px-2 py-0.5 rounded", step.impact < 0 ? "bg-destructive/20 text-destructive" : "bg-success/20 text-success")}>
                        {step.impact > 0 ? '+' : ''}{step.impact} pts
                      </span>
                    )}
                  </div>
                  <h4 className={cn("font-bold text-lg", isCurrent ? "text-primary text-glow" : "text-foreground")}>{step.title}</h4>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Output & Logs */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="glass-card rounded-3xl p-8 flex items-center justify-center h-[280px]">
             <ScoreDial score={score} size={200} />
          </div>

          <div className="glass-card rounded-3xl flex flex-col flex-1 min-h-0 overflow-hidden border-t-4 border-t-secondary/50">
            <div className="bg-black/40 px-6 py-3 border-b border-white/5 flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-muted-foreground">System.Out.Logs</span>
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/50" />
                <div className="w-3 h-3 rounded-full bg-warning/50" />
                <div className="w-3 h-3 rounded-full bg-success/50" />
              </div>
            </div>
            <div className="p-6 font-mono text-sm overflow-y-auto custom-scrollbar flex-1 flex flex-col-reverse">
              <AnimatePresence>
                {logs.map((log, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-3 leading-relaxed flex space-x-3"
                  >
                    <span className="text-muted-foreground shrink-0">[{log.time}]</span>
                    <span className={cn("flex-1", log.isBad ? "text-destructive" : "text-foreground")}>
                      <ChevronRight className="w-4 h-4 inline-block mr-1 opacity-50 -mt-0.5" />
                      {log.msg}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
