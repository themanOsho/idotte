import { AllocationIndex } from "@/engine/allocation/indexer";

import {
  ClientRecord,
} from "@/types/client";

import {
  MatchingResult,
  MatchedRecord,
  UnmatchedRecord,
  DuplicateMatch,
} from "@/types/matching";

import { normalizeCandidateName } from "@/utils/normalize-candidate-name";

/**
 * Matches one client workbook against
 * the Allocation Index.
 */
export function matchClientList(
  clientRecords: ClientRecord[],
  allocationIndex: AllocationIndex
): MatchingResult {

  const matched: MatchedRecord[] = [];

  const duplicateMatches: DuplicateMatch[] = [];

  const unmatched: UnmatchedRecord[] = [];

  for (const client of clientRecords) {

    const key = normalizeCandidateName(
      client.name
    );

    const allocationMatches =
      allocationIndex.get(key);

    if (!allocationMatches) {

      unmatched.push({
        client,
      });

      continue;

    }

    if (allocationMatches.length === 1) {

      matched.push({

        client,

        allocation: allocationMatches[0],

      });

      continue;

    }

    duplicateMatches.push({

      client,

      allocations: allocationMatches,

    });

  }

  const totalClientRecords =
    clientRecords.length;

  const matchedCount =
    matched.length;

  const unmatchedCount =
    unmatched.length;

  const duplicateCount =
    duplicateMatches.length;

  const matchRate =
    totalClientRecords === 0
      ? 0
      : Number(
          (
            ((matchedCount + duplicateCount) /
              totalClientRecords) *
            100
          ).toFixed(2)
        );

  return {

    matched,

    unmatched,

    duplicateMatches,

    totalClientRecords,

    matchedCount,

    unmatchedCount,

    duplicateCount,

    matchRate,

  };
 
}