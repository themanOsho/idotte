import { CheckCircle2 } from "lucide-react";
import { ReactNode } from "react";

interface WorkspaceCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
}

export function WorkspaceCard({
  icon,
  title,
  subtitle,
}: WorkspaceCardProps) {
  return (
    <div className="rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl transition-all duration-300 hover:border-primary/30">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            {icon}
          </div>

          <div>

            <h3 className="font-semibold">
              {title}
            </h3>

            <p className="text-sm text-muted-foreground">
              {subtitle}
            </p>

          </div>

        </div>

        <CheckCircle2 className="h-6 w-6 text-green-500" />

      </div>

    </div>
  );
}