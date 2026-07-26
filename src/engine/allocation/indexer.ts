import { AllocationRecord } from "@/types/allocation";
import { normalizeCandidateName } from "@/utils/normalize-candidate-name";

/**
 * Maps a normalized candidate name to one or more
 * allocation records.
 */
export type AllocationIndex = Map<
  string,
  AllocationRecord[]
>;

export interface AllocationIndexResult {
  index: AllocationIndex;

  uniqueNames: number;

  duplicateRecords: number;

  namesWithDuplicates: number;
}

/**
 * Builds a fast lookup index for Allocation records.
 */
export function buildAllocationIndex(
  records: AllocationRecord[],
  onProgress?: (progress: number) => void
): AllocationIndexResult {

  const index: AllocationIndex = new Map();

  const total = records.length;

  for (let i = 0; i < total; i++) {

    const record = records[i];

    const key = normalizeCandidateName(
      record.fullName
    );

    const existing = index.get(key);

    if (existing) {
      existing.push(record);
    } else {
      index.set(key, [record]);
    }

    if (onProgress) {
      onProgress(
        Math.round(((i + 1) / total) * 100)
      );
    }

  }

let duplicateRecords = 0;
let namesWithDuplicates = 0;

for (const records of index.values()) {
  if (records.length > 1) {
    namesWithDuplicates++;
    duplicateRecords += records.length - 1;
  }
}

return {
  index,

  uniqueNames: index.size,

  duplicateRecords,

  namesWithDuplicates,
};

}