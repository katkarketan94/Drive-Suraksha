import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  ShieldAlert, 
  Activity, 
  Map, 
  Building2, 
  PlayCircle,
  Home,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/demo", label: "Driver Demo", icon: Activity },
  { href: "/score", label: "Civic Score", icon: ShieldAlert },
  { href: "/route", label: "Route Risk", icon: Map },
  { href: "/city", label: "City Intel", icon: Building2 },
  { href: "/scenario", label: "Run Scenario", icon: PlayCircle },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row overflow-hidden relative selection:bg-primary/30">
      
      {/* Decorative background effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[120px]" />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 z-20 bg-background/80 backdrop-blur-md sticky top-0">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-1">
            <img src={`${import.meta.env.BASE_URL}images/logo-shield.png`} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">DriveSuraksha</span>
        </Link>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-foreground">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-10 pt-20 bg-background/95 backdrop-blur-xl md:hidden flex flex-col p-4 border-b border-white/10"
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div 
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-4 rounded-xl mb-2 transition-all",
                      isActive ? "bg-primary/20 text-primary border border-primary/30" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-72 border-r border-white/5 bg-black/20 backdrop-blur-md z-10 h-screen sticky top-0 shrink-0">
        <div className="p-6">
          <Link href="/" className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-1.5 shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
              <img src={`${import.meta.env.BASE_URL}images/logo-shield.png`} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-foreground group-hover:text-glow transition-all">DriveSuraksha</h1>
              <p className="text-[10px] uppercase tracking-widest text-primary font-bold">AI Urban Co-Driver</p>
            </div>
          </Link>
        </div>

        <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 cursor-pointer group relative overflow-hidden",
                  isActive 
                    ? "bg-gradient-to-r from-primary/20 to-transparent text-primary border-l-2 border-primary shadow-[inset_0_0_20px_rgba(0,184,217,0.05)]" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground border-l-2 border-transparent"
                )}>
                  {isActive && <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />}
                  <Icon className={cn("w-5 h-5 z-10", isActive && "animate-pulse-glow")} />
                  <span className="font-medium z-10">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="p-6 mt-auto">
          <div className="bg-gradient-to-br from-card to-card/50 border border-white/10 rounded-xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">System Status</span>
            </div>
            <p className="text-sm font-medium text-foreground">AI Models Online</p>
            <p className="text-xs text-muted-foreground mt-1">Latency: 42ms (Edge)</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 h-[calc(100vh-65px)] md:h-screen overflow-y-auto overflow-x-hidden z-10 relative scroll-smooth pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
}
