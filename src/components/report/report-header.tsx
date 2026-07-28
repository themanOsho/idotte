"use client";

import { REPORT_CONFIG } from "@/config/report";

export function ReportHeader() {
  return (

    <header className="border-b pb-8 text-center">

      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">
        {REPORT_CONFIG.organisation}
      </p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight">
        {REPORT_CONFIG.title}
      </h1>

    </header>

  );
}