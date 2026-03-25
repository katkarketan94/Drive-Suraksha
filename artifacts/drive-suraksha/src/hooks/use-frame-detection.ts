import { useState, useRef, useCallback, useEffect } from "react";

export interface FrameDetection {
  pothole: boolean;
  confidence: number;
  bbox: { x: number; y: number; width: number; height: number } | null;
  label: string;
}

const DETECT_INTERVAL_MS = 2000;
const CAPTURE_WIDTH = 320;
const CAPTURE_HEIGHT = 180;

export function useFrameDetection(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  enabled: boolean,
  onDetection?: (d: FrameDetection) => void
) {
  const [detection, setDetection] = useState<FrameDetection | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isAnalyzingRef = useRef(false);
  const enabledRef = useRef(enabled);

  useEffect(() => { enabledRef.current = enabled; }, [enabled]);

  const captureFrame = useCallback((): string | null => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return null;

    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }
    const canvas = canvasRef.current;
    canvas.width = CAPTURE_WIDTH;
    canvas.height = CAPTURE_HEIGHT;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, CAPTURE_WIDTH, CAPTURE_HEIGHT);
    return canvas.toDataURL("image/jpeg", 0.7);
  }, [videoRef]);

  const runDetection = useCallback(async () => {
    if (!enabledRef.current || isAnalyzingRef.current) return;
    const frame = captureFrame();
    if (!frame) return;

    isAnalyzingRef.current = true;
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/detect/frame", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frame }),
      });
      if (!res.ok) return;
      const data: FrameDetection = await res.json();
      setDetection(data);
      onDetection?.(data);
    } catch {
    } finally {
      isAnalyzingRef.current = false;
      setIsAnalyzing(false);
    }
  }, [captureFrame, onDetection]);

  useEffect(() => {
    if (!enabled) {
      setDetection(null);
      setIsAnalyzing(false);
      isAnalyzingRef.current = false;
      return;
    }

    runDetection();
    const interval = setInterval(runDetection, DETECT_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [enabled, runDetection]);

  return { detection, isAnalyzing };
}
