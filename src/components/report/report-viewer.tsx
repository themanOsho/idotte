"use client";

import { WorkbookPreview } from "@/types/preview";
import { ClientWorkbookSummary } from "@/types/client";
import { MatchingResult } from "@/types/matching";

import { ReportHeader } from "./report-header";
import { ReportCover } from "./report-cover";
import { MatchedTable } from "./matched-table";
import { DuplicateTable } from "./duplicate-table";
import { UnmatchedTable } from "./unmatched-table";
import { PrintReportButton } from "./print-report-button";
import { ExportExcelButton } from "./export-excel-button";

import Link from "next/link";

interface ReportViewerProps {
  allocation: WorkbookPreview;
  client: ClientWorkbookSummary;
  result: MatchingResult;
}

export function ReportViewer({
  allocation,
  client,
  result,
}: ReportViewerProps) {

  return (

    <section className="mt-12 space-y-10">

        <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground print-hidden mb-6"
        >
            ← Back to Workspace
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print-hidden">

            <div>
                <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
                Placement Report
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                Review the generated report before printing or exporting.
                </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <PrintReportButton />

                <ExportExcelButton
                allocation={allocation}
                client={client}
                result={result}
                />
            </div>

        </div>


      <div className="report-document space-y-10">

        <ReportHeader />

        <ReportCover
          allocation={allocation}
          client={client}
          result={result}
        />

        <div className="page-break">

          <MatchedTable
            records={result.matched}
          />

        </div>

        {result.duplicateMatches.length > 0 && (

          <div className="page-break">

            <DuplicateTable
              records={result.duplicateMatches}
            />

          </div>

        )}

        {result.unmatched.length > 0 && (

          <div className="page-break">

            <UnmatchedTable
              records={result.unmatched}
            />

          </div>

        )}

      </div>

    </section>

  );

}