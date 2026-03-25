import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number): string {
  return Math.max(0, Math.min(100, Math.round(score))).toString();
}

export function getRiskColor(level: "LOW" | "MODERATE" | "HIGH"): string {
  switch (level) {
    case "LOW": return "text-success border-success/30 bg-success/10";
    case "MODERATE": return "text-warning border-warning/30 bg-warning/10";
    case "HIGH": return "text-destructive border-destructive/30 bg-destructive/10";
    default: return "text-muted-foreground border-border bg-muted/50";
  }
}
