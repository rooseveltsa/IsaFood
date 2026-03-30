import { type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

type ColorVariant = "emerald" | "blue" | "amber" | "purple";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
  color: ColorVariant;
}

const colorMap: Record<ColorVariant, { bg: string; text: string; iconBg: string }> = {
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    iconBg: "bg-emerald-100",
  },
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    iconBg: "bg-blue-100",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    iconBg: "bg-amber-100",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    iconBg: "bg-purple-100",
  },
};

export function MetricCard({ title, value, change, icon: Icon, color }: MetricCardProps) {
  const colors = colorMap[color];
  const isPositive = change >= 0;

  return (
    <Card className="rounded-2xl border-0 shadow-lg shadow-emerald-900/5 p-4 sm:p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl sm:text-3xl font-heading font-bold tracking-tight">
            {value}
          </p>
          <div className="flex items-center gap-1">
            {isPositive ? (
              <ArrowUp className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <ArrowDown className="h-3.5 w-3.5 text-red-500" />
            )}
            <span
              className={`text-xs font-semibold ${
                isPositive ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {isPositive ? "+" : ""}
              {change}%
            </span>
            <span className="text-xs text-muted-foreground ml-0.5">vs ontem</span>
          </div>
        </div>

        <div className={`${colors.iconBg} rounded-xl p-2.5`}>
          <Icon className={`h-5 w-5 ${colors.text}`} />
        </div>
      </div>
    </Card>
  );
}
