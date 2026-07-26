import type { AllocationIndex } from "@/engine/allocation/indexer";
import type { ClientRecord } from "@/types/client";

import type {
  DuplicateMatch,
  MatchedRecord,
  MatchingResult,
  UnmatchedRecord,
} from "@/types/matching";

import { normalizeCandidateName } from "@/utils/normalize-candidate-name";

/**
 * Matches client records against the Allocation index.
 *
 * Matching behaviour:
 * - 0 matches  -> Unmatched
 * - 1 match    -> Matched
 * - 2+ matches -> Duplicate Resolution
 */
export function matchClients(
  allocationIndex: AllocationIndex,
  clientRecords: ClientRecord[]
): MatchingResult {

  const matched: MatchedRecord[] = [];

  const unmatched: UnmatchedRecord[] = [];

  const duplicateMatches: DuplicateMatch[] = [];

  for (const client of clientRecords) {

    const key = normalizeCandidateName(
      client.name
    );

    const allocations =
      allocationIndex.get(key);

    if (!allocations || allocations.length === 0) {

      unmatched.push({
        client,
      });

      continue;

    }

    if (allocations.length === 1) {

      matched.push({

          client,

          allocation: allocations[0],

      });

      continue;

    }

    duplicateMatches.push({

      client,

      allocations,

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
      : (matchedCount / totalClientRecords) * 100;

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