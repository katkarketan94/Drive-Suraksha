import { useState, useCallback, useEffect } from "react";

export type HazardType = 
  | "pothole_detected" 
  | "waterlogging_detected" 
  | "lane_violation" 
  | "wrong_side_driving" 
  | "honking_spike" 
  | "pedestrian_risk" 
  | "traffic_signal_violation" 
  | "helmet_missing" 
  | "accident_hotspot_nearby" 
  | "smooth_driving_bonus";

export interface HazardDefinition {
  id: HazardType;
  label: string;
  impact: number;
  severity: "low" | "medium" | "high";
  icon: string;
}

export const HAZARDS: HazardDefinition[] = [
  { id: "pothole_detected", label: "Pothole Detected", impact: -15, severity: "medium", icon: "AlertTriangle" },
  { id: "waterlogging_detected", label: "Waterlogging", impact: -15, severity: "high", icon: "Waves" },
  { id: "lane_violation", label: "Lane Violation", impact: -10, severity: "medium", icon: "Merge" },
  { id: "wrong_side_driving", label: "Wrong Side Driving", impact: -8, severity: "high", icon: "ArrowRightLeft" },
  { id: "honking_spike", label: "Honking Spike", impact: -5, severity: "low", icon: "Volume2" },
  { id: "helmet_missing", label: "No Helmet", impact: -12, severity: "high", icon: "ShieldAlert" },
  { id: "pedestrian_risk", label: "Pedestrian Near", impact: -7, severity: "medium", icon: "User" },
];

export function useScoringEngine(initialScore: number = 85) {
  const [baseScore] = useState(initialScore);
  const [activeHazards, setActiveHazards] = useState<Set<HazardType>>(new Set());
  const [currentScore, setCurrentScore] = useState(initialScore);
  const [riskLevel, setRiskLevel] = useState<"LOW" | "MODERATE" | "HIGH">("LOW");
  const [isInferring, setIsInferring] = useState(false);

  const calculateScore = useCallback((hazards: Set<HazardType>) => {
    let newScore = baseScore;
    hazards.forEach(hId => {
      const hazard = HAZARDS.find(h => h.id === hId);
      if (hazard) newScore += hazard.impact;
    });
    return Math.max(0, Math.min(100, newScore));
  }, [baseScore]);

  const determineRisk = useCallback((score: number) => {
    if (score >= 75) return "LOW";
    if (score >= 50) return "MODERATE";
    return "HIGH";
  }, []);

  const toggleHazard = useCallback((hazard: HazardType) => {
    setIsInferring(true);
    
    // Simulate AI inference delay
    setTimeout(() => {
      setActiveHazards(prev => {
        const next = new Set(prev);
        if (next.has(hazard)) {
          next.delete(hazard);
        } else {
          next.add(hazard);
        }
        return next;
      });
      setIsInferring(false);
    }, 600);
  }, []);

  const resetScoring = useCallback(() => {
    setActiveHazards(new Set());
    setCurrentScore(baseScore);
  }, [baseScore]);

  useEffect(() => {
    const score = calculateScore(activeHazards);
    setCurrentScore(score);
    setRiskLevel(determineRisk(score));
  }, [activeHazards, calculateScore, determineRisk]);

  return {
    currentScore,
    riskLevel,
    activeHazards,
    toggleHazard,
    isInferring,
    resetScoring
  };
}
