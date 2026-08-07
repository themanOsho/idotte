"use client";

import { useState } from "react";
import {
  Database,
  MapPin,
  School,
  Users,
  Calendar,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { DatasetSummary as DatasetSummaryData } from "../engine/dataset-summary";

interface DatasetSummaryProps {
  summary: DatasetSummaryData;
}

export function DatasetSummary({ summary }: DatasetSummaryProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="space-y-6">
      {/* Header card */}
      <div className="rounded-3xl border border-border bg-card/60 backdrop-blur-xl p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <Database className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Admission Dataset</h2>
            <p className="text-sm text-muted-foreground">
              Academic Session {summary.session}
            </p>
          </div>
        </div>
      </div>

      {/* Top-level stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<MapPin className="h-5 w-5" />}
          label="LGAs"
          value={summary.zoneCount}
        />
        <StatCard
          icon={<School className="h-5 w-5" />}
          label="Schools"
          value={summary.schoolCount}
        />
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Students"
          value={summary.studentCount}
        />
        <div className="rounded-3xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-primary/10 p-2 text-primary">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-6 text-lg font-bold tracking-tight sm:text-xl">
            {summary.lastUpdated}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Last Updated</p>
        </div>
      </div>

      {/* Expandable LGA list */}
      <div className="rounded-3xl border border-border bg-card/60 backdrop-blur-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center justify-between border-b border-border px-6 py-5 text-left transition-colors hover:bg-primary/5"
        >
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">
              LGAs
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({summary.zoneCount})
              </span>
            </h3>
          </div>
          {expanded ? (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          )}
        </button>

        {expanded && (
          <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
            {summary.lgas.map((lga) => (
              <div
                key={lga.name}
                className="flex items-center justify-between border-b border-border/50 px-6 py-4 transition-colors hover:bg-primary/5 last:border-0 md:odd:border-r md:odd:border-border/50"
              >
                <div>
                  <p className="font-medium">{lga.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {lga.schools.toLocaleString()} school
                    {lga.schools === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                  {lga.students.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-primary/10 p-2 text-primary">{icon}</div>
      </div>
      <p className="mt-6 text-3xl font-bold tracking-tight">
        {value.toLocaleString()}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}