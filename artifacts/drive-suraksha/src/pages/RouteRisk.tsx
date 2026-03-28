import { AlertTriangle, Waves, Merge, Navigation, CheckCircle2, Activity, TrendingDown, MapPin, Flame, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { RiskBadge } from "@/components/ui/risk-badge";
import { StatCard } from "@/components/ui/stat-card";
import { PotholeMap } from "@/components/ui/pothole-map";

const ROUTE_ZONES = [
  {
    id: "1",
    name: "Start: Sion Circle, MUM",
    type: "start",
    severity: "low",
    desc: "Route begins. High density of potholes in the 600m approach to Sion overbridge — road surface severely deteriorated post-monsoon.",
    distance: "0.0 km",
    icon: Navigation,
  },
  {
    id: "2",
    name: "Dadar TT Circle",
    type: "pothole_cluster",
    severity: "high",
    desc: "Dense pothole cluster. Severe road damage in all lanes. Chronic waterlogging spanning 400m near Dadar TT Circle during and post-rain.",
    distance: "2.3 km",
    icon: AlertTriangle,
  },
  {
    id: "3",
    name: "SV Road, Bandra West",
    type: "lane_violations",
    severity: "medium",
    desc: "Frequent lane-change violations and two-wheeler intrusions. High pedestrian crossing near Linking Road. Avoid peak hours.",
    distance: "4.1 km",
    icon: Merge,
  },
  {
    id: "4",
    name: "Kurla Junction",
    type: "accident_hotspot",
    severity: "high",
    desc: "Top-ranked accident blackspot in Mumbai. 47 incidents in last 6 months. Waterlogging + potholes combination. Exercise extreme caution.",
    distance: "5.7 km",
    icon: Waves,
  },
  {
    id: "5",
    name: "End: Andheri East — JVLR",
    type: "smooth",
    severity: "low",
    desc: "Well-maintained corridor. Good lighting, minimal traffic. Safe arrival zone.",
    distance: "8.4 km",
    icon: CheckCircle2,
  },
];

export default function RouteRisk() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Route Risk Intelligence</h1>
          <p className="text-muted-foreground mt-1">
            Pre-trip predictive analysis — Sion Circle → Andheri East via BKC &amp; SV Road, Mumbai
          </p>
        </div>
        <div className="bg-card border border-white/10 px-4 py-3 rounded-xl flex items-center gap-3">
          <MapPin className="w-4 h-4 text-primary" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Overall Route Risk</span>
            <span className="font-bold text-destructive">HIGH — Avoid left lane after Sion</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Distance" value="8.4 km" icon={<Navigation className="w-5 h-5"/>} className="p-4" />
        <StatCard title="Est. Time" value="52 min" icon={<Activity className="w-5 h-5"/>} className="p-4" />
        <StatCard title="Risk Zones" value="3" icon={<AlertTriangle className="w-5 h-5"/>} className="p-4" />
        <StatCard title="Score Impact" value="−18" icon={<TrendingDown className="w-5 h-5"/>} className="p-4" />
      </div>

      {/* Map */}
      <div className="rounded-3xl overflow-hidden border border-white/10 mb-6 relative shadow-2xl">
        {/* Map header bar */}
        <div className="absolute top-0 left-0 right-0 z-[1000] flex items-center justify-between px-4 py-2.5 bg-black/60 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono font-bold text-primary">LIVE HAZARD MAP — MUMBAI</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff4500] shadow-[0_0_6px_#ff4500]" />
              High risk pothole
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff8c00] shadow-[0_0_6px_#ff8c00]" />
              Pothole
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_6px_#00b8d9]" />
              Your position
            </span>
          </div>
        </div>

        <PotholeMap className="w-full h-[440px]" />

        {/* Pothole count badge */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-black/70 backdrop-blur-md border border-white/10 px-3 py-2 rounded-lg">
          <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">Potholes mapped</p>
          <p className="text-xl font-bold text-[#ff4500] tabular-nums">67 <span className="text-sm text-muted-foreground font-normal">on this route</span></p>
        </div>
      </div>

      {/* Route Timeline */}
      <div className="glass-card rounded-3xl p-6 md:p-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-8">Route Breakdown</h2>

        <div className="relative z-10">
          {ROUTE_ZONES.map((zone, index) => {
            const isLast = index === ROUTE_ZONES.length - 1;
            const Icon = zone.icon;

            let colorClasses = "bg-muted/50 text-muted-foreground border-white/10";
            let lineClass = "bg-white/10";

            if (zone.severity === "high") {
              colorClasses = "bg-destructive/20 text-destructive border-destructive/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]";
              lineClass = "bg-gradient-to-b from-destructive/60 to-white/10";
            } else if (zone.severity === "medium") {
              colorClasses = "bg-orange-500/20 text-orange-400 border-orange-500/30";
              lineClass = "bg-gradient-to-b from-orange-500/40 to-white/10";
            }

            return (
              <div key={zone.id} className="flex gap-6 relative">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 relative z-10 bg-background",
                    colorClasses
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {!isLast && (
                    <div className={cn("w-1 flex-1 my-2 rounded-full min-h-[60px]", lineClass)} />
                  )}
                </div>

                <div className={cn("flex-1 pb-10", isLast && "pb-0")}>
                  <div className="bg-background/50 border border-white/5 p-5 rounded-2xl hover:bg-white/5 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{zone.name}</h3>
                      <span className="text-xs font-mono text-muted-foreground bg-black/50 px-2 py-1 rounded">{zone.distance}</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">{zone.desc}</p>
                    {zone.severity !== "low" && (
                      <RiskBadge level={zone.severity === "high" ? "HIGH" : "MODERATE"} animate={false} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
