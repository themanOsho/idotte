import { ReactNode } from "react";
interface MatchingStatCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
}
export function MatchingStatCard({
  icon,
  title,
  value,
}: MatchingStatCardProps) {
  return (
    <div className="rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl transition-all duration-300 hover:border-primary/30">
      <div className="flex items-center justify-between">
        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
          {icon}
        </div>
      </div>
      <h3 className="mt-6 text-3xl font-bold tracking-tight">
        {typeof value === "number"
          ? value.toLocaleString()
          : value}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {title}
      </p>
    </div>
  );
}