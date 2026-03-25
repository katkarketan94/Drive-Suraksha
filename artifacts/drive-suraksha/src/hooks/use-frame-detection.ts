import { useState, useRef, useCallback, useEffect } from "react";

export interface FrameDetection {
  pothole: boolean;
  confidence: number;
  bbox: { x: number; y: number; width: number; height: number } | null;
  label: string;
  rawResponse?: string;
}

const DETECT_INTERVAL_MS = 2500;
const CAPTURE_WIDTH = 640;
const CAPTURE_HEIGHT = 360;
const CONFIDENCE_THRESHOLD = 0.4;

export function useFrameDetection(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  enabled: boolean,
  onDetection?: (d: FrameDetection) => void
) {
  const [detection, setDetection] = useState<FrameDetection | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastNote, setLastNote] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isAnalyzingRef = useRef(false);
  const enabledRef = useRef(enabled);

  useEffect(() => { enabledRef.current = enabled; }, [enabled]);

  const captureFrame = useCallback((): string | null => {
    const video = videoRef.current;
    if (!video) return null;

    // Accept any ready state >= 1 (have metadata) for video elements
    // Some browsers report readyState=1 even while playing from blob URLs
    if (video.readyState < 1) return null;

    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }
    const canvas = canvasRef.current;
    canvas.width = CAPTURE_WIDTH;
    canvas.height = CAPTURE_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    try {
      ctx.drawImage(video, 0, 0, CAPTURE_WIDTH, CAPTURE_HEIGHT);
    } catch {
      return null;
    }

    // Use higher JPEG quality for better AI analysis
    return canvas.toDataURL("image/jpeg", 0.9);
  }, [videoRef]);

  const runDetection = useCallback(async () => {
    if (!enabledRef.current || isAnalyzingRef.current) return;
    const frame = captureFrame();
    if (!frame) {
      console.warn("[frame-detection] captureFrame returned null — video not ready?");
      return;
    }

    isAnalyzingRef.current = true;
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/detect/frame", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frame }),
      });
      if (!res.ok) {
        console.error("[frame-detection] API error:", res.status);
        return;
      }
      const data: FrameDetection = await res.json();
      console.log(`[frame-detection] pothole=${data.pothole} conf=${data.confidence} note="${data.rawResponse}"`);

      // Apply confidence threshold
      const effectiveDetection: FrameDetection = {
        ...data,
        pothole: data.pothole && data.confidence >= CONFIDENCE_THRESHOLD,
      };

      setDetection(effectiveDetection);
      if (data.rawResponse) setLastNote(data.rawResponse);
      onDetection?.(effectiveDetection);
    } catch (e) {
      console.error("[frame-detection] fetch error:", e);
    } finally {
      isAnalyzingRef.current = false;
      setIsAnalyzing(false);
    }
  }, [captureFrame, onDetection]);

  useEffect(() => {
    if (!enabled) {
      setDetection(null);
      setIsAnalyzing(false);
      setLastNote("");
      isAnalyzingRef.current = false;
      return;
    }

    runDetection();
    const interval = setInterval(runDetection, DETECT_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [enabled, runDetection]);

  return { detection, isAnalyzing, lastNote };
}
