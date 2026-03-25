import { StatCard } from "@/components/ui/stat-card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Building2, AlertTriangle, Users, ShieldAlert, Activity } from "lucide-react";

const VIOLATION_DATA = [
  { name: 'Lane Rules', count: 4500 },
  { name: 'Helmet', count: 3200 },
  { name: 'Wrong Side', count: 2800 },
  { name: 'Signals', count: 1900 },
  { name: 'Honking', count: 5600 },
];

const HOTSPOTS = [
  { id: 1, loc: "Silk Board", incidents: 342, type: "Congestion & Lane Violations", severity: "HIGH" },
  { id: 2, loc: "Koramangala 80ft", incidents: 156, type: "Pothole Clusters", severity: "MODERATE" },
  { id: 3, loc: "Outer Ring Road", incidents: 890, type: "Waterlogging", severity: "HIGH" },
  { id: 4, loc: "Indiranagar 100ft", incidents: 124, type: "Wrong Side Driving", severity: "MODERATE" },
];

export default function CityIntel() {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Urban Intelligence</h1>
          <p className="text-muted-foreground mt-1">Aggregated data for city planners and authorities.</p>
        </div>
        <select className="bg-card border border-white/10 px-4 py-2 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary text-foreground">
          <option>Mumbai, MH</option>
          <option>Pune, MH</option>
          <option>New Delhi, DL</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Total Monitored" value="84,200" icon={<Users className="w-5 h-5"/>} />
        <StatCard title="Active Pothole Alerts" value="1,245" icon={<AlertTriangle className="w-5 h-5 text-warning"/>} />
        <StatCard title="Avg City Civic Score" value="72.4" icon={<ShieldAlert className="w-5 h-5 text-primary"/>} />
        <StatCard title="Waterlogging Zones" value="14" icon={<AlertTriangle className="w-5 h-5 text-destructive"/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="glass-card p-6 rounded-3xl lg:col-span-2 flex flex-col">
          <h3 className="font-display font-semibold text-lg mb-6">Top Violation Categories (Last 24h)</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={VIOLATION_DATA} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.8)" fontSize={13} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {VIOLATION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(var(--${index === 4 ? 'destructive' : index === 1 ? 'warning' : 'primary'}))`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hotspots List */}
        <div className="glass-card p-6 rounded-3xl lg:col-span-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-semibold text-lg">Priority Hotspots</h3>
            <button className="text-xs font-bold text-primary uppercase hover:underline">View All</button>
          </div>
          
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {HOTSPOTS.map((spot) => (
              <div key={spot.id} className="p-4 bg-background/50 border border-white/5 rounded-2xl hover:bg-white/5 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold">{spot.loc}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${spot.severity === 'HIGH' ? 'bg-destructive/20 text-destructive' : 'bg-warning/20 text-warning'}`}>
                    {spot.severity}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{spot.type}</p>
                <div className="flex items-center text-xs font-medium text-foreground">
                  <Activity className="w-3 h-3 mr-1 text-primary" />
                  {spot.incidents} incidents reported
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

