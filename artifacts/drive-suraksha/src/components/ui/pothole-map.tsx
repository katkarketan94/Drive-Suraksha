import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const ROUTE_COORDS: [number, number][] = [
  [19.0413, 72.8618], // Sion Circle (start)
  [19.0320, 72.8555], // Sion–Dadar link
  [19.0178, 72.8478], // Dadar TT Circle
  [19.0250, 72.8580], // Dadar → BKC link
  [19.0596, 72.8650], // BKC
  [19.0596, 72.8450], // BKC → Bandra
  [19.0596, 72.8295], // Bandra West
  [19.0680, 72.8305], // Bandra → SV Road
  [19.0748, 72.8318], // SV Road, Andheri
  [19.0920, 72.8400], // SV Road mid
  [19.1136, 72.8697], // Andheri East
];

const DRIVER_POS: [number, number] = [19.0413, 72.8618];

// Pothole clusters — lat/lng pairs hand-placed near real Mumbai trouble spots
const POTHOLE_BASE: Array<{ center: [number, number]; count: number; spread: number }> = [
  { center: [19.0413, 72.8618], count: 16, spread: 0.0025 }, // Sion Circle (dense)
  { center: [19.0178, 72.8478], count: 13, spread: 0.0020 }, // Dadar TT
  { center: [19.0728, 72.8826], count: 11, spread: 0.0018 }, // Kurla Junction
  { center: [19.0596, 72.8650], count:  6, spread: 0.0012 }, // BKC
  { center: [19.0748, 72.8318], count:  7, spread: 0.0015 }, // SV Road
  { center: [19.0320, 72.8555], count:  5, spread: 0.0010 }, // Sion–Dadar link
  { center: [19.0250, 72.8580], count:  4, spread: 0.0010 }, // Dadar→BKC
  { center: [19.0920, 72.8400], count:  5, spread: 0.0012 }, // SV Road mid
];

// Seeded pseudo-random so layout is deterministic
function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function buildPotholes(): Array<{ pos: [number, number]; severity: "high" | "medium" }> {
  const pts: Array<{ pos: [number, number]; severity: "high" | "medium" }> = [];
  const rand = seededRand(42);
  for (const { center, count, spread } of POTHOLE_BASE) {
    for (let i = 0; i < count; i++) {
      const lat = center[0] + (rand() - 0.5) * 2 * spread;
      const lng = center[1] + (rand() - 0.5) * 2 * spread;
      pts.push({ pos: [lat, lng], severity: rand() > 0.4 ? "high" : "medium" });
    }
  }
  return pts;
}

const POTHOLES = buildPotholes();

const RISK_ZONES: Array<{
  pos: [number, number];
  label: string;
  severity: "high" | "medium" | "low";
}> = [
  { pos: [19.0413, 72.8618], label: "Sion Circle", severity: "high" },
  { pos: [19.0178, 72.8478], label: "Dadar TT", severity: "high" },
  { pos: [19.0728, 72.8826], label: "Kurla Junction", severity: "high" },
  { pos: [19.0596, 72.8295], label: "Bandra West", severity: "medium" },
  { pos: [19.1136, 72.8697], label: "Andheri East", severity: "low" },
];

function severityColor(s: "high" | "medium" | "low") {
  return s === "high" ? "#ef4444" : s === "medium" ? "#f97316" : "#22c55e";
}

export function PotholeMap({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [19.0600, 72.8555],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    mapRef.current = map;

    // CartoDB Dark Matter — matches the dark style from the reference image
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map);

    // Route polyline — cyan/teal dashed line
    L.polyline(ROUTE_COORDS, {
      color: "#00b8d9",
      weight: 3,
      opacity: 0.7,
      dashArray: "8 5",
    }).addTo(map);

    // Pothole markers — orange/red glowing circle markers
    for (const { pos, severity } of POTHOLES) {
      const isHigh = severity === "high";
      L.circleMarker(pos, {
        radius: isHigh ? 6 : 4,
        fillColor: isHigh ? "#ff4500" : "#ff8c00",
        fillOpacity: 0.9,
        color: isHigh ? "#ff6b35" : "#ffb347",
        weight: 1.5,
        className: "pothole-dot",
      }).addTo(map);
    }

    // Risk zone rings — larger semi-transparent circles marking hotspot areas
    for (const zone of RISK_ZONES) {
      if (zone.severity !== "low") {
        L.circle(zone.pos, {
          radius: zone.severity === "high" ? 220 : 140,
          color: severityColor(zone.severity),
          fillColor: severityColor(zone.severity),
          fillOpacity: 0.08,
          weight: 1.5,
          dashArray: "4 4",
        }).addTo(map);
      }

      // Zone label tooltip
      L.circleMarker(zone.pos, {
        radius: 1,
        opacity: 0,
        fillOpacity: 0,
      })
        .addTo(map)
        .bindTooltip(zone.label, {
          permanent: true,
          direction: "top",
          offset: [0, -8],
          className: "map-label",
        });
    }

    // Driver position pin
    const driverIcon = L.divIcon({
      className: "",
      html: `
        <div style="position:relative;width:28px;height:28px;">
          <div style="
            position:absolute;inset:0;border-radius:50%;
            background:rgba(0,184,217,0.25);
            animation:driver-ping 1.4s ease-out infinite;
          "></div>
          <div style="
            position:absolute;inset:4px;border-radius:50%;
            background:#00b8d9;border:2px solid white;
            box-shadow:0 0 12px rgba(0,184,217,0.8);
          "></div>
          <div style="
            position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
            width:6px;height:6px;border-radius:50%;background:white;
          "></div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    L.marker(DRIVER_POS, { icon: driverIcon })
      .addTo(map)
      .bindPopup(
        `<div style="font-family:monospace;font-size:11px;color:#00b8d9;font-weight:bold">📍 YOUR POSITION<br/><span style="color:#fff">Sion Circle, MUM</span></div>`,
        { className: "driver-popup" }
      );

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes driver-ping {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .map-label {
          background: rgba(0,0,0,0.7) !important;
          border: 1px solid rgba(255,255,255,0.15) !important;
          color: rgba(255,255,255,0.85) !important;
          font-size: 10px !important;
          font-weight: 600 !important;
          font-family: ui-monospace, monospace !important;
          padding: 2px 6px !important;
          border-radius: 4px !important;
          box-shadow: none !important;
          white-space: nowrap !important;
        }
        .map-label::before { display: none !important; }
        .driver-popup .leaflet-popup-content-wrapper {
          background: rgba(0,0,0,0.85);
          border: 1px solid rgba(0,184,217,0.4);
          border-radius: 8px;
        }
        .driver-popup .leaflet-popup-tip { background: rgba(0,0,0,0.85); }
        .leaflet-control-zoom a {
          background: #111418 !important;
          color: #fff !important;
          border-color: rgba(255,255,255,0.1) !important;
        }
        .leaflet-control-zoom a:hover { background: #1e2328 !important; }
      `}</style>
      <div ref={containerRef} className={className} />
    </>
  );
}
