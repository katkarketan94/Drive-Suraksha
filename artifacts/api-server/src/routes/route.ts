import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/route/risks", (_req, res) => {
  const data = {
    routeName: "Koramangala → MG Road → Indiranagar",
    totalDistance: "8.4 km",
    overallRating: "MODERATE",
    riskScore: 62,
    explanation:
      "This route passes through 2 high-density traffic zones and 1 known accident hotspot. Expect road surface issues near Silk Board and significant honking congestion on MG Road between 5–8 PM.",
    zones: [
      {
        id: "zone-1",
        name: "Silk Board Junction Approach",
        type: "pothole_cluster",
        severity: "high",
        description: "Dense pothole cluster in the 600m approach to Silk Board flyover. Road surface severely deteriorated post-monsoon.",
        coordinates: "12.9175° N, 77.6229° E",
        distanceFromStart: "0.0 km",
      },
      {
        id: "zone-2",
        name: "Koramangala 80ft Road",
        type: "lane_violations",
        severity: "medium",
        description: "Frequent lane-change violations and two-wheeler intrusions reported. High pedestrian crossing activity.",
        coordinates: "12.9293° N, 77.6272° E",
        distanceFromStart: "1.8 km",
      },
      {
        id: "zone-3",
        name: "BTM Layout Waterlogging",
        type: "waterlogging",
        severity: "high",
        description: "Chronic waterlogging stretch spanning 400m during and after rain. Vehicles frequently get stranded.",
        coordinates: "12.9166° N, 77.6101° E",
        distanceFromStart: "3.2 km",
      },
      {
        id: "zone-4",
        name: "MG Road Brigade Junction",
        type: "accident_hotspot",
        severity: "high",
        description: "Top-ranked accident blackspot in Bengaluru Central. 47 incidents reported in the last 6 months. Extra caution advised.",
        coordinates: "12.9718° N, 77.5967° E",
        distanceFromStart: "5.7 km",
      },
      {
        id: "zone-5",
        name: "Indiranagar 100ft Road",
        type: "smooth_segment",
        severity: "low",
        description: "Well-maintained road with good lighting and minimal traffic. Ideal driving conditions.",
        coordinates: "12.9784° N, 77.6408° E",
        distanceFromStart: "7.2 km",
      },
    ],
  };
  res.json(data);
});

export default router;
