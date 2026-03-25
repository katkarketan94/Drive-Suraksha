import { cn } from "@/lib/utils";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";

interface RiskBadgeProps {
  level: "LOW" | "MODERATE" | "HIGH";
  className?: string;
  animate?: boolean;
}

export function RiskBadge({ level, className, animate = true }: RiskBadgeProps) {
  const getProps = () => {
    switch (level) {
      case "LOW":
        return {
          bg: "bg-success/15 border-success/30 text-success",
          icon: <ShieldCheck className="w-4 h-4 mr-1.5" />,
          label: "Low Risk",
          animation: ""
        };
      case "MODERATE":
        return {
          bg: "bg-warning/15 border-warning/30 text-warning",
          icon: <Shield className="w-4 h-4 mr-1.5" />,
          label: "Moderate Risk",
          animation: ""
        };
      case "HIGH":
        return {
          bg: "bg-destructive/15 border-destructive/30 text-destructive shadow-[0_0_15px_rgba(239,68,68,0.4)]",
          icon: <ShieldAlert className="w-4 h-4 mr-1.5" />,
          label: "High Risk",
          animation: animate ? "animate-pulse" : ""
        };
    }
  };

  const { bg, icon, label, animation } = getProps();

  return (
    <div className={cn(
      "inline-flex items-center px-3 py-1 rounded-full border text-sm font-bold uppercase tracking-wider",
      bg, animation, className
    )}>
      {icon}
      {label}
    </div>
  );
}
