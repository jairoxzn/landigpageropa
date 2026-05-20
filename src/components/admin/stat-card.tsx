import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  delta?: number;
  icon: LucideIcon;
  accent?: "pink" | "black" | "violet" | "amber";
}

export function StatCard({ label, value, delta, icon: Icon, accent = "pink" }: Props) {
  const accents = {
    pink: "from-primary/15 to-primary/5 text-primary",
    black: "from-zinc-900/10 to-zinc-900/5 text-zinc-900 dark:text-white",
    violet: "from-violet-500/15 to-violet-500/5 text-violet-600",
    amber: "from-amber-500/15 to-amber-500/5 text-amber-600"
  };
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className={cn("absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br opacity-50 blur-2xl", accents[accent])} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            {label}
          </p>
          <p className="font-display text-3xl font-bold">{value}</p>
          {delta !== undefined && (
            <p
              className={cn(
                "mt-2 inline-flex items-center gap-1 text-xs font-semibold",
                positive ? "text-emerald-600" : "text-red-500"
              )}
            >
              {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {positive ? "+" : ""}
              {delta}% vs mes anterior
            </p>
          )}
        </div>
        <div className={cn("h-12 w-12 grid place-items-center rounded-2xl bg-gradient-to-br", accents[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
