import { Map, AlertTriangle, Waves, Merge, Navigation, CheckCircle2, Activity, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { RiskBadge } from "@/components/ui/risk-badge";
import { StatCard } from "@/components/ui/stat-card";

const MOCK_ROUTE_ZONES = [
  {
    id: "1",
    name: "Start: Koramangala 80ft Road",
    type: "smooth",
    severity: "low",
    desc: "Clear road, normal traffic flow.",
    distance: "0 km",
    icon: Navigation
  },
  {
    id: "2",
    name: "Sony World Junction",
    type: "pothole_cluster",
    severity: "high",
    desc: "Severe pothole cluster detected in left lane.",
    distance: "2.4 km",
    icon: AlertTriangle
  },
  {
    id: "3",
    name: "HSR Layout Inner Ring",
    type: "lane_violations",
    severity: "medium",
    desc: "Frequent wrong-side driving reports.",
    distance: "4.1 km",
    icon: Merge
  },
  {
    id: "4",
    name: "Agara Lake Stretch",
    type: "waterlogging",
    severity: "high",
    desc: "Waterlogging detected. High hydroplaning risk.",
    distance: "5.8 km",
    icon: Waves
  },
  {
    id: "5",
    name: "End: Bellandur Gate",
    type: "smooth",
    severity: "low",
    desc: "Arrived safely.",
    distance: "7.2 km",
    icon: CheckCircle2
  }
];

export default function RouteRisk() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Route Risk Intelligence</h1>
          <p className="text-muted-foreground mt-1">Pre-trip predictive analysis based on civic data.</p>
        </div>
        <div className="bg-card border border-white/10 px-4 py-3 rounded-xl flex items-center space-x-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Overall Route Risk</span>
            <span className="font-bold text-destructive">HIGH (Avoid Left Lane)</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard title="Distance" value="7.2km" icon={<Map className="w-5 h-5"/>} className="p-4" />
        <StatCard title="Est. Time" value="45m" icon={<Activity className="w-5 h-5"/>} className="p-4" />
        <StatCard title="Risk Zones" value="3" icon={<AlertTriangle className="w-5 h-5"/>} className="p-4" />
        <StatCard title="Score Impact" value="-12" icon={<TrendingDown className="w-5 h-5"/>} className="p-4" />
      </div>

      {/* Vertical Timeline */}
      <div className="glass-card rounded-3xl p-6 md:p-10 relative overflow-hidden">
        {/* Background decorative map grid */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
        
        <div className="relative z-10">
          {MOCK_ROUTE_ZONES.map((zone, index) => {
            const isLast = index === MOCK_ROUTE_ZONES.length - 1;
            const Icon = zone.icon;
            
            let colorClasses = "bg-muted text-muted-foreground border-white/10";
            let lineClass = "bg-white/10";
            
            if (zone.severity === "high") {
              colorClasses = "bg-destructive/20 text-destructive border-destructive/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]";
              lineClass = "bg-gradient-to-b from-destructive to-white/10";
            } else if (zone.severity === "medium") {
              colorClasses = "bg-warning/20 text-warning border-warning/30";
            } else if (zone.severity === "low" && index !== 0 && !isLast) {
              colorClasses = "bg-success/20 text-success border-success/30";
            }

            return (
              <div key={zone.id} className="flex gap-6 relative">
                {/* Timeline Line & Node */}
                <div className="flex flex-col items-center">
                  <div className={cn("w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0 relative z-10 bg-background", colorClasses)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {!isLast && (
                    <div className={cn("w-1 flex-1 my-2 rounded-full min-h-[60px]", lineClass)} />
                  )}
                </div>

                {/* Content Card */}
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

