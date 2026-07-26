import { AllocationIndex } from "@/engine/allocation/indexer";

import {
  ClientRecord,
} from "@/types/client";

import {
  MatchingResult,
  MatchedRecord,
  UnmatchedRecord,
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

    /**
     * Duplicate names are expected.
     * Return every matching allocation record.
     */
    for (const allocation of allocationMatches) {

      matched.push({

        client,

        allocation,

      });

    }

  }

  return {
    matched,
    unmatched,

    totalClientRecords: clientRecords.length,

    matchedCount: matched.length,

    unmatchedCount: unmatched.length,
    };

}