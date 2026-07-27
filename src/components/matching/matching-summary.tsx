import {
  Users,
  CheckCircle2,
  XCircle,
  Percent,
} from "lucide-react";
interface MatchingSummaryProps {
  totalClients: number;
  matched: number;
  unmatched: number;
}
export function MatchingSummary({
  totalClients,
  matched,
  unmatched,
}: MatchingSummaryProps) {
  const percentage =
    totalClients === 0
      ? 0
      : Math.round((matched / totalClients) * 100);
  const cards = [
    {
      title: "Client Records",
      value: totalClients.toLocaleString(),
      icon: Users,
    },
    {
      title: "Matched",
      value: matched.toLocaleString(),
      icon: CheckCircle2,
    },
    {
      title: "Unmatched",
      value: unmatched.toLocaleString(),
      icon: XCircle,
    },
    {
      title: "Match Rate",
      value: `${percentage}%`,
      icon: Percent,
    },
  ];
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {card.title}
              </span>
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <p className="mt-5 text-3xl font-bold">
              {card.value}
            </p>
          </div>
        );
      })}
    </section>
  );
}