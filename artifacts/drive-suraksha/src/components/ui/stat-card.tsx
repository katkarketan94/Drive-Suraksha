import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: { value: string; isPositive: boolean };
  className?: string;
}

export function StatCard({ title, value, icon, description, trend, className }: StatCardProps) {
  return (
    <div className={cn("glass-card p-6 rounded-2xl flex flex-col relative overflow-hidden group hover:border-primary/50 transition-colors duration-300", className)}>
      <div className="absolute -right-6 -top-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300 scale-150">
        {icon}
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="p-2 bg-primary/10 text-primary rounded-lg border border-primary/20">
          {icon}
        </div>
      </div>
      
      <div className="flex items-baseline space-x-3">
        <span className="text-4xl font-display font-bold text-foreground">{value}</span>
        {trend && (
          <span className={cn(
            "text-sm font-semibold flex items-center",
            trend.isPositive ? "text-success" : "text-destructive"
          )}>
            {trend.isPositive ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
      
      {description && (
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
      )}
    </div>
  );
}
