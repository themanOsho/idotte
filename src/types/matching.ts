import { AllocationRecord } from "./allocation";
import { ClientRecord } from "./client";

export interface MatchedRecord {

  client: ClientRecord;

  allocation: AllocationRecord;

}

export interface DuplicateMatch {

  client: ClientRecord;

  allocations: AllocationRecord[];

  selectedAllocation?: AllocationRecord;

}

export interface UnmatchedRecord {

  client: ClientRecord;

}

export interface MatchingResult {

  matched: MatchedRecord[];

  unmatched: UnmatchedRecord[];

  duplicateMatches: DuplicateMatch[];

  totalClientRecords: number;

  matchedCount: number;

  unmatchedCount: number;

  duplicateCount: number;

  matchRate: number;

}