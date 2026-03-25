import { StatCard } from "@/components/ui/stat-card";
import { ScoreDial } from "@/components/ui/score-dial";
import { Target, TrendingUp, AlertOctagon, VolumeX, Car, Navigation, ShieldAlert, Map, ShieldCheck } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { cn } from "@/lib/utils";

const TREND_DATA = [
  { day: 'Mon', score: 82 },
  { day: 'Tue', score: 85 },
  { day: 'Wed', score: 81 },
  { day: 'Thu', score: 88 },
  { day: 'Fri', score: 86 },
  { day: 'Sat', score: 92 },
  { day: 'Sun', score: 89 },
];

function ProgressBar({ label, value, icon: Icon, colorClass }: { label: string, value: number, icon: any, colorClass: string }) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-medium flex items-center text-muted-foreground">
          <Icon className="w-4 h-4 mr-2" />
          {label}
        </span>
        <span className="font-bold">{value}/100</span>
      </div>
      <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-1000", colorClass)} 
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  );
}

export default function CivicScore() {
  // In a real app, this data comes from useGetCivicScore() hook
  const currentScore = 89;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="mb-2">
        <h1 className="text-3xl font-display font-bold">Civic Driving Score</h1>
        <p className="text-muted-foreground mt-1">Your comprehensive driving reputation and behavior analysis.</p>
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Score Card */}
        <div className="glass-card p-8 rounded-3xl flex flex-col items-center justify-center lg:col-span-1 relative overflow-hidden">
          <div className="absolute top-4 right-4 px-3 py-1 bg-success/10 text-success rounded-full text-xs font-bold border border-success/20 uppercase tracking-wider">
            Top 15%
          </div>
          <ScoreDial score={currentScore} size={220} />
          <p className="mt-6 text-center text-muted-foreground text-sm max-w-[200px]">
            You are driving safer than 85% of drivers in Bengaluru today.
          </p>
        </div>

        {/* Sub Scores */}
        <div className="glass-card p-8 rounded-3xl lg:col-span-1 flex flex-col justify-center">
          <h3 className="font-display font-semibold text-lg mb-6">Pillar Breakdown</h3>
          <ProgressBar label="Safety & Rules" value={92} icon={ShieldCheck} colorClass="bg-primary" />
          <ProgressBar label="Civic Compliance" value={85} icon={Navigation} colorClass="bg-secondary" />
          <ProgressBar label="Smooth Driving" value={78} icon={Car} colorClass="bg-warning" />
          <ProgressBar label="Noise Discipline" value={95} icon={VolumeX} colorClass="bg-success" />
        </div>

        {/* Gamified Recommendation */}
        <div className="rounded-3xl lg:col-span-1 bg-gradient-to-br from-primary/20 via-card to-secondary/10 border border-primary/20 p-8 flex flex-col relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 opacity-20 group-hover:scale-110 transition-transform duration-500">
            <Target className="w-48 h-48 text-primary" />
          </div>
          
          <h3 className="font-display font-bold text-xl mb-2 text-foreground relative z-10">Next Level: Elite</h3>
          <p className="text-sm text-muted-foreground mb-6 relative z-10">You need 6 more points to unlock Elite Civic status and premium insurance discounts.</p>
          
          <div className="mt-auto relative z-10 space-y-3">
            <div className="bg-background/60 backdrop-blur-sm p-4 rounded-xl border border-white/5 flex items-start space-x-3">
              <AlertOctagon className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">Avoid harsh braking</p>
                <p className="text-xs text-muted-foreground">Cost you -4 pts yesterday.</p>
              </div>
            </div>
            <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              View Detailed Log
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Chart */}
        <div className="glass-card p-6 rounded-3xl lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-lg flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              7-Day Trend
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white' }}
                  itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Small Stats Grid */}
        <div className="grid grid-rows-2 gap-6 lg:col-span-1">
          <StatCard 
            title="Total KM Tracked" 
            value="1,240" 
            icon={<Map className="w-6 h-6" />}
            trend={{ value: "+45 this week", isPositive: true }}
          />
          <StatCard 
            title="Hazards Avoided" 
            value="18" 
            icon={<ShieldAlert className="w-6 h-6" />}
            description="Thanks to real-time predictive alerts."
          />
        </div>
      </div>
    </div>
  );
}

