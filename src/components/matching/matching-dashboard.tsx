import {
  CheckCircle2,
  AlertTriangle,
  Copy,
  Percent,
} from "lucide-react";
import { MatchingStatCard } from "./matching-stat-card";
interface MatchingDashboardProps {
  matchedCount: number;
  unmatchedCount: number;
  duplicateCount: number;
  matchRate: number;
}
export function MatchingDashboard({
  matchedCount,
  unmatchedCount,
  duplicateCount,
  matchRate,
}: MatchingDashboardProps) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          Matching Results
        </h2>
        <p className="text-muted-foreground">
          Review the outcome before generating reports.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MatchingStatCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          title="Matched"
          value={matchedCount}
        />
        <MatchingStatCard
          icon={<AlertTriangle className="h-5 w-5" />}
          title="Unmatched"
          value={unmatchedCount}
        />
        <MatchingStatCard
          icon={<Copy className="h-5 w-5" />}
          title="Duplicate Matches"
          value={duplicateCount}
        />
        <MatchingStatCard
          icon={<Percent className="h-5 w-5" />}
          title="Match Rate"
          value={`${matchRate.toFixed(2)}%`}
        />
      </div>
    </section>
  );
}