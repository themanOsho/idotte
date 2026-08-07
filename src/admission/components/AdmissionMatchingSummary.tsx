"use client";

import {
  Users,
  CheckCircle2,
  ArrowRightLeft,
  XCircle,
} from "lucide-react";
import Link from "next/link";

export interface AdmissionMatchingSummaryProps {
  total: number;
  admitted: number;
  redirected: number;
  notAdmitted: number;
  /** Optional – hide the View Report button when false */
  showReportLink?: boolean;
  reportHref?: string;
}

export function AdmissionMatchingSummary({
  total,
  admitted,
  redirected,
  notAdmitted,
  showReportLink = true,
  reportHref = "/admission/report",
}: AdmissionMatchingSummaryProps) {
  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl border border-border bg-card/60 backdrop-blur-xl p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <CheckCircle2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Matching Complete</h2>
            <p className="text-sm text-muted-foreground">
              Admission results for this client list
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Total Students"
          value={total}
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Admitted"
          value={admitted}
        />
        <StatCard
          icon={<ArrowRightLeft className="h-5 w-5" />}
          label="Redirected"
          value={redirected}
        />
        <StatCard
          icon={<XCircle className="h-5 w-5" />}
          label="Not Admitted"
          value={notAdmitted}
        />
      </div>

      {/* View Report */}
      {showReportLink && (
        <div className="flex justify-center pt-2">
          <Link
            href={reportHref}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            View Report
          </Link>
        </div>
      )}
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