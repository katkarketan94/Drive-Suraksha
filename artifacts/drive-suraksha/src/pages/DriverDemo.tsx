import { useState, useRef, useCallback, useEffect } from "react";
import { AlertTriangle, MapPin, Loader2, Sparkles, Activity, Camera, X, Video, ExternalLink, Cpu } from "lucide-react";
import { useScoringEngine, HAZARDS } from "@/hooks/use-scoring-engine";
import { useFrameDetection } from "@/hooks/use-frame-detection";
import { ScoreDial } from "@/components/ui/score-dial";
import { RiskBadge } from "@/components/ui/risk-badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type FeedMode = "image" | "video" | "webcam";

const NON_POTHOLE_BOX_POSITIONS = [
  { top: "55%", left: "10%",  width: "18%", height: "12%" },
  { top: "45%", left: "65%",  width: "20%", height: "14%" },
  { top: "30%", left: "35%",  width: "16%", height: "10%" },
];

export default function DriverDemo() {
  const { currentScore, riskLevel, activeHazards, toggleHazard, isInferring } = useScoringEngine(85);
  const [showSummary, setShowSummary] = useState(false);
  const [feedMode, setFeedMode] = useState<FeedMode>("image");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [isWebcamLoading, setIsWebcamLoading] = useState(false);
  const [autoDetect, setAutoDetect] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);
  const potholeActiveRef = useRef(false);

  const isInIframe = window.self !== window.top;
  const canAutoDetect = feedMode === "video" || feedMode === "webcam";

  const { detection, isAnalyzing } = useFrameDetection(
    videoRef,
    autoDetect && canAutoDetect,
    useCallback((d) => {
      const shouldBeActive = d.pothole && d.confidence >= 0.5;
      if (shouldBeActive !== potholeActiveRef.current) {
        potholeActiveRef.current = shouldBeActive;
        toggleHazard("pothole_detected");
      }
    }, [toggleHazard])
  );

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(url);
    setFeedMode("video");
    setWebcamError(null);
    stopWebcam();
  }, [videoUrl]);

  const startWebcam = useCallback(async () => {
    setIsWebcamLoading(true);
    setWebcamError(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("no-api");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      webcamStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setFeedMode("webcam");
    } catch (err: any) {
      const name = err?.name ?? "";
      const msg = err?.message ?? "";
      if (name === "NotAllowedError" || msg.includes("denied") || msg.includes("Permission")) {
        setWebcamError("iframe-blocked");
      } else if (name === "NotFoundError" || msg.includes("no-api")) {
        setWebcamError("Camera not found on this device.");
      } else {
        setWebcamError("Could not access camera. Try opening in a new tab.");
      }
    } finally {
      setIsWebcamLoading(false);
    }
  }, []);

  const stopWebcam = useCallback(() => {
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach(t => t.stop());
      webcamStreamRef.current = null;
    }
  }, []);

  const resetFeed = useCallback(() => {
    stopWebcam();
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(null);
    setFeedMode("image");
    setWebcamError(null);
    setAutoDetect(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [videoUrl, stopWebcam]);

  useEffect(() => () => {
    stopWebcam();
    if (videoUrl) URL.revokeObjectURL(videoUrl);
  }, []);

  const nonPotholeHazards = Array.from(activeHazards).filter(id => id !== "pothole_detected");

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto h-full flex flex-col">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Live AI Edge Demo</h1>
          <p className="text-muted-foreground mt-1">Simulate road conditions to see real-time inference and scoring.</p>
        </div>
        <div className="flex items-center space-x-2 bg-card border border-white/10 px-4 py-2 rounded-lg">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Sion Circle, MUM</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">

        {/* LEFT: Camera Feed */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="rounded-3xl overflow-hidden border border-white/10 relative shadow-2xl flex flex-col bg-black flex-1 min-h-[300px]">
            {/* Recording badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/10">
              <div className={cn("w-2 h-2 rounded-full animate-pulse", feedMode === "image" ? "bg-muted-foreground" : "bg-destructive")} />
              <span className="text-xs font-bold font-mono text-white">
                {feedMode === "webcam" ? "LIVE • WEBCAM" : feedMode === "video" ? "VIDEO • POV" : "SIM • 1080p"}
              </span>
            </div>

            {/* AI analyzing badge */}
            {isAnalyzing && (
              <div className="absolute top-4 right-12 z-20 flex items-center gap-1.5 bg-primary/20 border border-primary/40 backdrop-blur-md px-2.5 py-1.5 rounded-md">
                <Cpu className="w-3 h-3 text-primary animate-pulse" />
                <span className="text-[10px] font-bold font-mono text-primary">ANALYZING</span>
              </div>
            )}

            {/* Reset button */}
            {feedMode !== "image" && (
              <button
                onClick={resetFeed}
                className="absolute top-4 right-4 z-20 p-1.5 rounded-md bg-black/50 border border-white/10 text-white hover:bg-black/70 transition-colors"
                title="Reset to simulated feed"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <div className="flex-1 relative overflow-hidden">
              {feedMode === "image" && (
                <img
                  src={`${import.meta.env.BASE_URL}images/dashcam-view.png`}
                  alt="Dashcam Feed"
                  className="w-full h-full object-cover opacity-80"
                />
              )}

              {feedMode === "video" && videoUrl && (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  autoPlay
                  loop
                  muted={false}
                  controls={false}
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}

              {feedMode === "webcam" && (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}

              {isWebcamLoading && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">Requesting camera access…</p>
                </div>
              )}

              {webcamError && (
                <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-4 px-6 text-center z-40">
                  <Camera className="w-10 h-10 text-destructive" />
                  {webcamError === "iframe-blocked" ? (
                    <>
                      <p className="text-sm text-white font-semibold leading-relaxed">Camera blocked by browser security.</p>
                      <p className="text-xs text-muted-foreground leading-relaxed max-w-[220px]">
                        The preview pane iframe cannot access your camera. Open the app in a new tab to use webcam.
                      </p>
                      <a
                        href={window.location.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open in New Tab
                      </a>
                    </>
                  ) : (
                    <p className="text-sm text-destructive">{webcamError}</p>
                  )}
                  <button onClick={resetFeed} className="text-xs text-muted-foreground underline">Back to simulation</button>
                </div>
              )}

              {/* AI Scanning Overlay */}
              <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan shadow-[0_0_15px_rgba(0,184,217,1)]" />

              {/* AI-detected pothole bounding box (real coordinates from API) */}
              <AnimatePresence>
                {autoDetect && detection?.pothole && detection.bbox && (
                  <motion.div
                    key="pothole-ai-bbox"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute border-2 border-destructive bg-destructive/10 backdrop-blur-[2px]"
                    style={{
                      left: `${detection.bbox.x}%`,
                      top: `${detection.bbox.y}%`,
                      width: `${detection.bbox.width}%`,
                      height: `${detection.bbox.height}%`,
                    }}
                  >
                    <div className="absolute -top-6 left-[-2px] px-2 py-0.5 text-[10px] font-bold uppercase whitespace-nowrap bg-destructive text-white">
                      POTHOLE {Math.round(detection.confidence * 100)}%
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Manual hazard bounding boxes (non-pothole) */}
              <AnimatePresence>
                {nonPotholeHazards.map((hazardId, i) => {
                  const hazard = HAZARDS.find(h => h.id === hazardId);
                  const pos = NON_POTHOLE_BOX_POSITIONS[i % NON_POTHOLE_BOX_POSITIONS.length];
                  return (
                    <motion.div
                      key={hazardId}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={cn(
                        "absolute border-2 bg-black/20 backdrop-blur-[2px]",
                        hazard?.severity === "high" ? "border-destructive" : "border-warning"
                      )}
                      style={pos}
                    >
                      <div className={cn(
                        "absolute -top-6 left-[-2px] px-2 py-0.5 text-[10px] font-bold uppercase whitespace-nowrap",
                        hazard?.severity === "high" ? "bg-destructive text-white" : "bg-warning text-black"
                      )}>
                        {hazard?.label}
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

          {/* Feed source controls */}
          <div className="grid grid-cols-2 gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-medium transition-all",
                feedMode === "video"
                  ? "bg-primary/10 border-primary/50 text-primary"
                  : "bg-card border-white/10 text-muted-foreground hover:border-white/30 hover:text-foreground"
              )}
            >
              <Video className="w-4 h-4" />
              Upload POV Video
            </button>
            <button
              onClick={feedMode === "webcam" ? resetFeed : startWebcam}
              disabled={isWebcamLoading}
              className={cn(
                "flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-medium transition-all",
                feedMode === "webcam"
                  ? "bg-destructive/10 border-destructive/50 text-destructive"
                  : "bg-card border-white/10 text-muted-foreground hover:border-white/30 hover:text-foreground"
              )}
            >
              {isWebcamLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              {feedMode === "webcam" ? "Stop Camera" : "Use Webcam"}
            </button>
          </div>

          {/* AI Auto-Detect toggle (only when video/webcam is active) */}
          {canAutoDetect && (
            <button
              onClick={() => setAutoDetect(v => !v)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-all",
                autoDetect
                  ? "bg-primary/15 border-primary/50 text-primary shadow-[0_0_20px_rgba(0,184,217,0.15)]"
                  : "bg-card border-white/10 text-muted-foreground hover:border-primary/30 hover:text-foreground"
              )}
            >
              <span className="flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                AI Pothole Auto-Detect
              </span>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full font-bold uppercase",
                autoDetect ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {autoDetect ? (isAnalyzing ? "scanning…" : "ON") : "OFF"}
              </span>
            </button>
          )}

          {/* Help tip */}
          {feedMode === "image" && (
            <p className="text-xs text-muted-foreground text-center px-2">
              {isInIframe
                ? <>Upload a dashcam MP4, or <a href={window.location.href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">open in a new tab</a> to use your live camera.</>
                : "Upload a dashcam MP4 or use your device camera to inject a real driver POV into the AI demo."
              }
            </p>
          )}
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
              const isAIControlled = hazard.id === "pothole_detected" && autoDetect && canAutoDetect;
              return (
                <button
                  key={hazard.id}
                  onClick={() => !isAIControlled && toggleHazard(hazard.id)}
                  disabled={isInferring || isAIControlled}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left group",
                    isActive
                      ? "bg-primary/10 border-primary/50 shadow-[0_0_15px_rgba(0,184,217,0.15)]"
                      : "bg-background/50 border-white/5 hover:border-white/20 hover:bg-white/5",
                    isAIControlled && "opacity-70 cursor-default"
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
                        {isAIControlled && <span className="ml-2 text-[10px] text-primary font-bold uppercase tracking-wide">[AI]</span>}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">Impact: {hazard.impact} pts</p>
                    </div>
                  </div>

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
            <div className={cn(
              "absolute inset-0 opacity-10 transition-colors duration-1000 blur-3xl",
              riskLevel === "HIGH" ? "bg-destructive" : riskLevel === "MODERATE" ? "bg-warning" : "bg-success"
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
                    );
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
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card p-4 rounded-2xl text-sm leading-relaxed overflow-hidden"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-bold text-primary uppercase">AI Analysis</span>
                </div>
                {riskLevel === "HIGH"
                  ? "Immediate intervention recommended. Multiple high-severity hazards detected reducing civic score severely. Consider re-routing or taking a break."
                  : riskLevel === "MODERATE"
                    ? "Caution advised. Some civic infractions detected. Please adhere to lane discipline and observe local conditions to improve score."
                    : "Excellent driving record maintained. No current hazards affecting your civic score. Keep up the good work."
                }
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
