import type { MatchingResult } from "@/types/matching";

export interface ReportSummary {

  totalClients: number;

  matched: number;

  unmatched: number;

  ambiguous: number;

  matchRate: number;

}

/**
 * Generates a high-level report from the
 * matching results. 
 */
export function generateReport(
  matchingResult: MatchingResult
): ReportSummary {

  const ambiguous =
    matchingResult.duplicateCount;

  const matched =
    matchingResult.matchedCount;

  const unmatched =
    matchingResult.unmatchedCount;

  const totalClients =
    matchingResult.totalClientRecords;

  const matchRate =
    totalClients === 0
      ? 0
      : Number(
          (
            (matched / totalClients) *
            100
          ).toFixed(2)
        );

  return {

    totalClients,

    matched,

    unmatched,

    ambiguous,

    matchRate,

  };

}