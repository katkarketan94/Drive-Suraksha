import { Router, type IRouter } from "express";
import { GetEventsResponseItem, CreateEventBody } from "@workspace/api-zod";
import { randomUUID } from "crypto";

const router: IRouter = Router();

const SCORE_IMPACTS: Record<string, number> = {
  pothole_detected: -15,
  waterlogging_detected: -15,
  lane_violation: -10,
  wrong_side_driving: -8,
  honking_spike: -5,
  pedestrian_risk: -7,
  traffic_signal_violation: -10,
  helmet_missing: -12,
  accident_hotspot_nearby: -5,
  smooth_driving_bonus: 3,
};

const RECOMMENDATIONS: Record<string, string> = {
  pothole_detected: "Slow down and steer clear of road damage. Report the pothole to the municipal authority.",
  waterlogging_detected: "Reduce speed and avoid waterlogged areas. Switch to an alternate route if possible.",
  lane_violation: "Stay within your designated lane. Lane discipline improves traffic flow and safety.",
  wrong_side_driving: "DANGER: Immediately return to the correct lane. Wrong-side driving is extremely hazardous.",
  honking_spike: "Minimize unnecessary honking. Excessive noise contributes to civic distress.",
  pedestrian_risk: "Slow down near pedestrian zones. Yield to pedestrians at all times.",
  traffic_signal_violation: "Obey all traffic signals. Signal violations are a major cause of accidents.",
  helmet_missing: "Always wear a certified helmet when riding a two-wheeler. It is both the law and your protection.",
  accident_hotspot_nearby: "You are approaching a known accident-prone zone. Exercise extreme caution.",
  smooth_driving_bonus: "Excellent driving! You are contributing to a safer urban environment.",
};

interface DrivingEvent {
  id: string;
  timestamp: string;
  type: string;
  severity: string;
  location: string;
  description: string;
  scoreImpact: number;
  recommendation: string;
}

const seedEvents: DrivingEvent[] = [
  {
    id: "evt-001",
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    type: "pothole_detected",
    severity: "high",
    location: "Silk Board Junction, Bengaluru",
    description: "Large pothole cluster detected on the inner ring road near Silk Board flyover.",
    scoreImpact: -15,
    recommendation: RECOMMENDATIONS.pothole_detected,
  },
  {
    id: "evt-002",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    type: "honking_spike",
    severity: "medium",
    location: "MG Road, Bengaluru",
    description: "Excessive honking detected in the 500m stretch near Brigade Road junction.",
    scoreImpact: -5,
    recommendation: RECOMMENDATIONS.honking_spike,
  },
  {
    id: "evt-003",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    type: "lane_violation",
    severity: "medium",
    location: "Koramangala 5th Block, Bengaluru",
    description: "Vehicle crossed the center divider into oncoming lane near the police station.",
    scoreImpact: -10,
    recommendation: RECOMMENDATIONS.lane_violation,
  },
  {
    id: "evt-004",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    type: "smooth_driving_bonus",
    severity: "low",
    location: "Indiranagar 100ft Road, Bengaluru",
    description: "Consistent speed maintained, no violations detected in a 2km stretch.",
    scoreImpact: 3,
    recommendation: RECOMMENDATIONS.smooth_driving_bonus,
  },
  {
    id: "evt-005",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    type: "pedestrian_risk",
    severity: "high",
    location: "Whitefield Main Road, Bengaluru",
    description: "Pedestrian detected crossing without signal at ITPL entrance. Vehicle braking required.",
    scoreImpact: -7,
    recommendation: RECOMMENDATIONS.pedestrian_risk,
  },
];

let events: DrivingEvent[] = [...seedEvents];

router.get("/events", (_req, res) => {
  const sorted = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  res.json(sorted);
});

router.post("/events", (req, res) => {
  const parsed = CreateEventBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid event data", details: parsed.error });
    return;
  }

  const { type, severity, location, description } = parsed.data;
  const scoreImpact = SCORE_IMPACTS[type] ?? 0;
  const recommendation = RECOMMENDATIONS[type] ?? "Stay alert and drive safely.";

  const newEvent: DrivingEvent = {
    id: `evt-${randomUUID().slice(0, 8)}`,
    timestamp: new Date().toISOString(),
    type,
    severity,
    location,
    description,
    scoreImpact,
    recommendation,
  };

  events.unshift(newEvent);
  if (events.length > 100) events = events.slice(0, 100);

  res.status(201).json(GetEventsResponseItem.parse(newEvent));
});

export default router;
