import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ScoreDialProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ScoreDial({ score, size = 200, strokeWidth = 16, className }: ScoreDialProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const dashoffset = circumference - (animatedScore / 100) * circumference;

  let colorClass = "text-success";
  let glowClass = "drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]";
  if (score < 50) {
    colorClass = "text-destructive";
    glowClass = "drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]";
  } else if (score < 75) {
    colorClass = "text-warning";
    glowClass = "drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]";
  }

  return (
    <div className={cn("relative flex items-center justify-center font-display", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/5"
        />
        {/* Progress track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          className={cn(
            colorClass, glowClass,
            "transition-all duration-1000 ease-out"
          )}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className={cn("text-6xl font-bold tracking-tighter", colorClass, glowClass)}>
          {Math.round(animatedScore)}
        </span>
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest mt-1">
          Civic Score
        </span>
      </div>
    </div>
  );
}
