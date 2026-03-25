import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/route/risks", (_req, res) => {
  const data = {
    routeName: "Bandra → SV Road → Andheri East",
    totalDistance: "8.4 km",
    overallRating: "MODERATE",
    riskScore: 62,
    explanation:
      "This route passes through 2 high-density traffic zones and 1 known accident hotspot. Expect road surface issues near Sion Circle and significant honking congestion on SV Road between 5–8 PM.",
    zones: [
      {
        id: "zone-1",
        name: "Sion Circle Approach",
        type: "pothole_cluster",
        severity: "high",
        description: "Dense pothole cluster in the 600m approach to Sion overbridge. Road surface severely deteriorated post-monsoon.",
        coordinates: "19.0413° N, 72.8618° E",
        distanceFromStart: "0.0 km",
      },
      {
        id: "zone-2",
        name: "SV Road, Bandra West",
        type: "lane_violations",
        severity: "medium",
        description: "Frequent lane-change violations and two-wheeler intrusions reported. High pedestrian crossing activity near Linking Road.",
        coordinates: "19.0596° N, 72.8295° E",
        distanceFromStart: "1.8 km",
      },
      {
        id: "zone-3",
        name: "Dadar Waterlogging Stretch",
        type: "waterlogging",
        severity: "high",
        description: "Chronic waterlogging spanning 400m during and after rain. Vehicles frequently get stranded near Dadar TT Circle.",
        coordinates: "19.0178° N, 72.8478° E",
        distanceFromStart: "3.2 km",
      },
      {
        id: "zone-4",
        name: "Kurla Junction",
        type: "accident_hotspot",
        severity: "high",
        description: "Top-ranked accident blackspot in Mumbai Central. 47 incidents reported in the last 6 months. Extra caution advised.",
        coordinates: "19.0728° N, 72.8826° E",
        distanceFromStart: "5.7 km",
      },
      {
        id: "zone-5",
        name: "Andheri East — JVLR",
        type: "smooth_segment",
        severity: "low",
        description: "Well-maintained road with good lighting and minimal traffic. Ideal driving conditions.",
        coordinates: "19.1136° N, 72.8697° E",
        distanceFromStart: "7.2 km",
      },
    ],
  };
  res.json(data);
});

export default router;
