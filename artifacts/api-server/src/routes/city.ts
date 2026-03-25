import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/city/insights", (_req, res) => {
  const data = {
    potholeDensity: 847,
    waterloggingAlerts: 134,
    highRiskIntersections: 23,
    honkingIndex: 72,
    avgCivicScore: 68,
    violationStats: [
      { category: "Lane Violations", count: 4821, percentage: 34 },
      { category: "Honking Spikes", count: 3620, percentage: 26 },
      { category: "Signal Violations", count: 2104, percentage: 15 },
      { category: "Wrong Side Driving", count: 1390, percentage: 10 },
      { category: "Helmet Missing", count: 1250, percentage: 9 },
      { category: "Pedestrian Risk", count: 851, percentage: 6 },
    ],
    alertsOverTime: [
      { hour: "00:00", alerts: 12 },
      { hour: "02:00", alerts: 8 },
      { hour: "04:00", alerts: 5 },
      { hour: "06:00", alerts: 34 },
      { hour: "08:00", alerts: 187 },
      { hour: "10:00", alerts: 143 },
      { hour: "12:00", alerts: 118 },
      { hour: "14:00", alerts: 129 },
      { hour: "16:00", alerts: 198 },
      { hour: "18:00", alerts: 256 },
      { hour: "20:00", alerts: 167 },
      { hour: "22:00", alerts: 58 },
    ],
    hotspots: [
      { location: "Sion Circle", severity: "high", incidents: 312, type: "Multi-hazard" },
      { location: "Kurla Junction", severity: "high", incidents: 247, type: "Accident Hotspot" },
      { location: "Dadar TT Circle", severity: "high", incidents: 198, type: "Wrong-side" },
      { location: "Bandra West", severity: "medium", incidents: 145, type: "Waterlogging" },
      { location: "Ghatkopar Bridge", severity: "medium", incidents: 134, type: "Pothole Cluster" },
      { location: "Powai IT Corridor", severity: "medium", incidents: 112, type: "Lane Violations" },
      { location: "BKC Inner Road", severity: "low", incidents: 78, type: "Honking Zone" },
    ],
    scoreDistribution: [
      { range: "90-100", count: 3420 },
      { range: "80-89", count: 8910 },
      { range: "70-79", count: 12450 },
      { range: "60-69", count: 9870 },
      { range: "50-59", count: 6230 },
      { range: "Below 50", count: 4120 },
    ],
  };
  res.json(data);
});

export default router;
