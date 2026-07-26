import { matchClients } from "@/engine/matching/engine";

import type {
  AllocationIndexResult,
  AllocationIndex,
} from "@/engine/allocation/indexer";

import type { ClientWorkbookSummary } from "@/types/client";
import type { MatchingResult } from "@/types/matching";

export interface MatchingServiceProgress {
  stage: "matching" | "complete";

  message: string;

  progress: number;
}

export interface MatchingServiceResult {
  result: MatchingResult;
}

/**
 * Runs the candidate matching workflow.
 */
export async function processMatching(
  allocationIndex: AllocationIndexResult,
  clientSummary: ClientWorkbookSummary,
  onProgress?: (
    progress: MatchingServiceProgress
  ) => void
): Promise<MatchingServiceResult> {

  onProgress?.({
    stage: "matching",
    message: "Matching candidates...",
    progress: 15,
  });

  const result = matchClients(
    allocationIndex.index,
    clientSummary.worksheets.flatMap(
      (sheet) => sheet.records
    )
  );

  onProgress?.({
    stage: "complete",
    message: "Matching completed.",
    progress: 100,
  });

  return {
    result,
  };

}