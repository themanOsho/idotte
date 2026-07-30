"use client";

import { REPORT_CONFIG } from "@/config/report";

export function ReportHeader() {
  return (

    <header className="border-b border-t py-12 text-center">

      <p className="text-sm font-bold uppercase tracking-[0.35em] text-primary">
        {REPORT_CONFIG.organisation}
      </p>

      <h1 className="mt-8 text-4xl font-bold tracking-tight">
        {REPORT_CONFIG.title}
      </h1>

    </header>

  );
}