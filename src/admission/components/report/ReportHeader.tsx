"use client";

import { ADMISSION_REPORT_CONFIG } from "../../config/report";

export function ReportHeader() {
  return (
    <header className="border-b border-t py-12 text-center">
      
      <p className="text-sm font-bold uppercase tracking-[0.35em] text-primary">
        {ADMISSION_REPORT_CONFIG.organisation}
      </p>

      <h1 className="mt-8 text-4xl font-bold tracking-tight">
        {ADMISSION_REPORT_CONFIG.title}
      </h1>

      {/* <p className="mt-3 text-sm text-muted-foreground">
        Junior Secondary School Placement · Session 2025/2026
      </p> */}

    </header>
  );
}