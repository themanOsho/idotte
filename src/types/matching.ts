import { AllocationRecord } from "./allocation";
import { ClientRecord } from "./client";

export interface MatchedRecord {
  client: ClientRecord;

  allocations: AllocationRecord[];
}

export interface UnmatchedRecord {
  client: ClientRecord;
}

export interface MatchingResult {
  matched: MatchedRecord[];

  unmatched: UnmatchedRecord[];

  totalClientRecords: number;

  matchedCount: number;

  unmatchedCount: number;
}