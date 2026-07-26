import type { AllocationIndex } from "@/engine/allocation/indexer";
import type { ClientRecord } from "@/types/client";

import type {
  MatchedRecord,
  MatchingResult,
  UnmatchedRecord,
} from "@/types/matching";

import { normalizeCandidateName } from "@/utils/normalize-candidate-name";

/**
 * Matches client records against the Allocation index.
 *
 * Every matching Allocation record is returned.
 * This allows duplicate candidate names to be
 * handled safely instead of selecting the first one.
 */
export function matchClients(
  allocationIndex: AllocationIndex,
  clientRecords: ClientRecord[]
): MatchingResult {

  const matched: MatchedRecord[] = [];

  const unmatched: UnmatchedRecord[] = [];

  for (const client of clientRecords) {

    const key = normalizeCandidateName(
      client.name
    );

    const allocations =
      allocationIndex.get(key);

    if (
      allocations &&
      allocations.length > 0
    ) {

      matched.push({

        client,

        allocations,

      });

    } else {

      unmatched.push({

        client,

      });

    }

  }

  return {

    matched,

    unmatched,

    totalClientRecords:
      clientRecords.length,

    matchedCount:
      matched.length,

    unmatchedCount:
      unmatched.length,

  };

}