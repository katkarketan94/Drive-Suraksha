import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/demo/scenario", (_req, res) => {
  const data = {
    steps: [
      {
        stepNumber: 1,
        title: "Route Started",
        description: "Driver begins journey from Koramangala to Indiranagar. All systems nominal. AI monitoring active.",
        eventType: "smooth_driving_bonus",
        delayMs: 0,
        scoreImpact: 0,
      },
      {
        stepNumber: 2,
        title: "Pothole Detected",
        description: "AI camera detects a 40cm pothole cluster on Silk Board Junction approach. Hazard alert issued.",
        eventType: "pothole_detected",
        delayMs: 8000,
        scoreImpact: -15,
      },
      {
        stepNumber: 3,
        title: "Lane Violation Risk",
        description: "Vehicle trajectory analysis shows deviation from lane markers on MG Road stretch. Warning issued.",
        eventType: "lane_violation",
        delayMs: 18000,
        scoreImpact: -10,
      },
      {
        stepNumber: 4,
        title: "Honking Spike Detected",
        description: "Acoustic sensor records 6 honking incidents in 30 seconds. Civic behavior score penalty applied.",
        eventType: "honking_spike",
        delayMs: 28000,
        scoreImpact: -5,
      },
      {
        stepNumber: 5,
        title: "Civic Score Updated",
        description: "Score dropped from 85 to 55 due to accumulated violations. Risk level upgraded to MODERATE.",
        eventType: "accident_hotspot_nearby",
        delayMs: 42000,
        scoreImpact: -5,
      },
      {
        stepNumber: 6,
        title: "Hotspot Alert & Recommendation",
        description: "Approaching Brigade Junction — ranked #2 accident blackspot in Bengaluru. Alternate route suggested via Richmond Road.",
        eventType: "accident_hotspot_nearby",
        delayMs: 58000,
        scoreImpact: 0,
      },
    ],
    totalDuration: 75000,
  };
  res.json(data);
});

export default router;
