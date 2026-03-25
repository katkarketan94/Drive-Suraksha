import { useEffect, useRef, useState, useCallback } from "react";

declare const cv: any;

export interface CvDetection {
  pothole: boolean;
  confidence: number;
  box: { x: number; y: number; width: number; height: number } | null;
  note: string;
  count: number;
}

type DetectionCallback = (d: CvDetection) => void;

const INTERVAL_MS = 200;

function waitForCv(): Promise<void> {
  return new Promise((resolve) => {
    const check = () => {
      if (
        typeof cv !== "undefined" &&
        cv.getBuildInformation &&
        (window as any).cvReady
      ) {
        resolve();
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
}

function detectPotholes(
  videoEl: HTMLVideoElement,
  canvas: HTMLCanvasElement
): CvDetection {
  const W = 640;
  const H = 360;

  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(videoEl, 0, 0, W, H);

  const roiTop = Math.floor(H * 0.38);
  const roiH = H - roiTop;

  let src: any, gray: any, roi: any, blurred: any, thresh: any, closed: any, contours: any, hierarchy: any;

  try {
    const imageData = ctx.getImageData(0, roiTop, W, roiH);
    src = cv.matFromImageData(imageData);

    gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

    blurred = new cv.Mat();
    const ksize = new cv.Size(5, 5);
    cv.GaussianBlur(gray, blurred, ksize, 1.5);

    thresh = new cv.Mat();
    cv.adaptiveThreshold(
      blurred,
      thresh,
      255,
      cv.ADAPTIVE_THRESH_MEAN_C,
      cv.THRESH_BINARY_INV,
      25,
      8
    );

    const morphKernel = cv.getStructuringElement(
      cv.MORPH_ELLIPSE,
      new cv.Size(7, 7)
    );
    closed = new cv.Mat();
    cv.morphologyEx(thresh, closed, cv.MORPH_CLOSE, morphKernel);
    morphKernel.delete();

    contours = new cv.MatVector();
    hierarchy = new cv.Mat();
    cv.findContours(
      closed,
      contours,
      hierarchy,
      cv.RETR_EXTERNAL,
      cv.CHAIN_APPROX_SIMPLE
    );

    interface Candidate {
      rect: { x: number; y: number; w: number; h: number };
      score: number;
      meanVal: number;
    }

    const candidates: Candidate[] = [];

    for (let i = 0; i < contours.size(); i++) {
      const cnt = contours.get(i);
      const area = cv.contourArea(cnt);

      if (area < 350 || area > 22000) {
        cnt.delete();
        continue;
      }

      const perim = cv.arcLength(cnt, true);
      const circularity =
        perim > 0 ? (4 * Math.PI * area) / (perim * perim) : 0;

      if (circularity < 0.1) {
        cnt.delete();
        continue;
      }

      const rect = cv.boundingRect(cnt);
      const aspect = rect.width / Math.max(rect.height, 1);

      if (aspect < 0.2 || aspect > 5.0) {
        cnt.delete();
        continue;
      }

      const subRoi = gray.roi(
        new cv.Rect(
          Math.max(0, rect.x - 2),
          Math.max(0, rect.y - 2),
          Math.min(rect.width + 4, W - rect.x - 2),
          Math.min(rect.height + 4, roiH - rect.y - 2)
        )
      );
      const mean = cv.mean(subRoi);
      subRoi.delete();

      const meanIntensity = mean[0];

      if (meanIntensity > 140) {
        cnt.delete();
        continue;
      }

      const score = area * circularity * (1 - meanIntensity / 255);
      candidates.push({
        rect: { x: rect.x, y: rect.y + roiTop, w: rect.width, h: rect.height },
        score,
        meanVal: meanIntensity,
      });

      cnt.delete();
    }

    candidates.sort((a, b) => b.score - a.score);
    const best = candidates[0];

    if (!best) {
      return {
        pothole: false,
        confidence: 0,
        box: null,
        note: "Road surface looks clear",
        count: 0,
      };
    }

    const rawConf = Math.min(
      0.95,
      0.3 + (best.score / 4000) * 0.65
    );
    const confidence = Math.round(rawConf * 100) / 100;

    const bx = best.rect.x / W;
    const by = best.rect.y / H;
    const bw = best.rect.w / W;
    const bh = best.rect.h / H;

    const note =
      candidates.length === 1
        ? `1 dark depression detected (avg brightness ${Math.round(best.meanVal)})`
        : `${candidates.length} candidates — top match brightness ${Math.round(best.meanVal)}`;

    return {
      pothole: confidence >= 0.40,
      confidence,
      box: { x: bx, y: by, width: bw, height: bh },
      note,
      count: candidates.length,
    };
  } catch {
    return {
      pothole: false,
      confidence: 0,
      box: null,
      note: "CV processing error",
      count: 0,
    };
  } finally {
    [src, gray, blurred, thresh, closed].forEach((m) => {
      try { m?.delete(); } catch {}
    });
    try { contours?.delete(); } catch {}
    try { hierarchy?.delete(); } catch {}
  }
}

export function useOpencvDetection(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  enabled: boolean,
  onDetection: DetectionCallback
) {
  const [cvReady, setCvReady] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detection, setDetection] = useState<CvDetection | null>(null);
  const [lastNote, setLastNote] = useState("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onDetectionRef = useRef(onDetection);
  useEffect(() => { onDetectionRef.current = onDetection; }, [onDetection]);

  useEffect(() => {
    canvasRef.current = document.createElement("canvas");
    waitForCv().then(() => setCvReady(true));
  }, []);

  const runDetection = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2 || video.paused) return;
    if (!cvReady) return;

    setIsAnalyzing(true);
    try {
      const result = detectPotholes(video, canvas);
      setDetection(result);
      setLastNote(result.note);
      onDetectionRef.current(result);
    } finally {
      setIsAnalyzing(false);
    }
  }, [videoRef, cvReady]);

  useEffect(() => {
    if (!enabled || !cvReady) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }
    timerRef.current = setInterval(runDetection, INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [enabled, cvReady, runDetection]);

  return { detection, isAnalyzing, cvReady, lastNote };
}
