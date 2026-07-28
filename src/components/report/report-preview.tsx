"use client";

import { MatchingResult } from "@/types/matching";
import { WorkbookPreview } from "@/types/preview";
import { ClientWorkbookSummary } from "@/types/client";

import { ReportCover } from "./report-cover";
import { MatchedTable } from "./matched-table";
import { DuplicateTable } from "./duplicate-table";
import { UnmatchedTable } from "./unmatched-table";

interface ReportPreviewProps {
  allocation: WorkbookPreview;
  client: ClientWorkbookSummary;
  result: MatchingResult;
}

export function ReportPreview({
  allocation,
  client,
  result,
}: ReportPreviewProps) {
  return (
    <section className="space-y-10">

      <ReportCover
        allocation={allocation}
        client={client}
        result={result}
      />

      <MatchedTable
        records={result.matched}
      />

      <DuplicateTable
        duplicates={result.duplicateMatches}
      />

      <UnmatchedTable
        records={result.unmatched}
      />

    </section>
  );
}