import { Router, type IRouter } from "express";

const router: IRouter = Router();

interface ScoreTrendPoint {
  day: string;
  score: number;
}

interface CivicScoreState {
  overall: number;
  safety: number;
  civicCompliance: number;
  smoothDriving: number;
  noiseDiscipline: number;
  riskLevel: "LOW" | "MODERATE" | "HIGH";
  weeklyTrend: ScoreTrendPoint[];
  improvements: string[];
  deductions: string[];
  recommendation: string;
}

function computeRiskLevel(score: number): "LOW" | "MODERATE" | "HIGH" {
  if (score >= 75) return "LOW";
  if (score >= 50) return "MODERATE";
  return "HIGH";
}

function generateWeeklyTrend(): ScoreTrendPoint[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const baseScore = 78;
  return days.map((day, i) => ({
    day,
    score: Math.max(40, Math.min(100, baseScore + Math.floor(Math.sin(i * 0.8) * 12) + Math.floor(Math.random() * 6))),
  }));
}

let score: CivicScoreState = {
  overall: 85,
  safety: 88,
  civicCompliance: 82,
  smoothDriving: 90,
  noiseDiscipline: 80,
  riskLevel: "LOW",
  weeklyTrend: generateWeeklyTrend(),
  improvements: [
    "No sudden braking incidents in last 3 trips",
    "Consistent lane discipline on highway stretches",
    "Signal compliance improved by 15%",
  ],
  deductions: [
    "Honking detected 3 times today",
    "Minor lane deviation near MG Road",
  ],
  recommendation:
    "To improve your score further, reduce honking and maintain lane discipline on inner city roads.",
};

router.get("/score", (_req, res) => {
  res.json(score);
});

router.post("/score/reset", (_req, res) => {
  score = {
    overall: 85,
    safety: 88,
    civicCompliance: 82,
    smoothDriving: 90,
    noiseDiscipline: 80,
    riskLevel: "LOW",
    weeklyTrend: generateWeeklyTrend(),
    improvements: [
      "No sudden braking incidents in last 3 trips",
      "Consistent lane discipline on highway stretches",
      "Signal compliance improved by 15%",
    ],
    deductions: [
      "Honking detected 3 times today",
      "Minor lane deviation near MG Road",
    ],
    recommendation:
      "To improve your score further, reduce honking and maintain lane discipline on inner city roads.",
  };
  res.json(score);
});

export default router;
