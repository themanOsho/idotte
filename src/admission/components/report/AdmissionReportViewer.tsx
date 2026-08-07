"use client";

import Link from "next/link";
import { AdmissionReportData } from "../../types/admission-report";
import { ReportHeader } from "./ReportHeader";
import { ReportCover } from "./ReportCover";
import { AdmittedTable } from "./AdmittedTable";
import { RedirectedTable } from "./RedirectedTable";
import { NotAdmittedTable } from "./NotAdmittedTable";
import { PrintReportButton } from "./PrintReportButton";

interface AdmissionReportViewerProps {
  data: AdmissionReportData;
}

export function AdmissionReportViewer({ data }: AdmissionReportViewerProps) {
  return (
    <section className="mt-12 space-y-10">
      <Link
        href="/"
        className="print-hidden text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to Workspace
      </Link>

      <div className="print-hidden mb-12 mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
            Admission Report
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Review the generated report before printing or exporting.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <PrintReportButton />
        </div>
      </div>

      <div className="report-page space-y-10">
        {/* Watermark */}
        <div className="report-watermark hidden" aria-hidden="true">
          <div className="text-4xl font-bold tracking-widest">IDOTTE</div>
          <div className="mt-3 text-2xl font-medium">Mrs. Olujobi</div>
        </div>

        <ReportHeader />

        <ReportCover data={data} />

        <div className="page-break">
          <AdmittedTable groups={data.admittedGroups} />
        </div>

        {data.redirectedGroups.length > 0 && (
          <div className="page-break">
            <RedirectedTable groups={data.redirectedGroups} />
          </div>
        )}

        {data.notAdmittedGroups.length > 0 && (
          <div className="page-break">
            <NotAdmittedTable groups={data.notAdmittedGroups} />
          </div>
        )}
      </div>
    </section>
  );
}