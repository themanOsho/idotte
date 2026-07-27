import { buildAllocationIndex } from "@/engine/allocation/indexer";
import { parseAllocationWorkbook } from "@/engine/allocation/parser";

import type { AllocationWorkbookSummary } from "@/types/allocation";
import type { WorkbookPreview } from "@/types/preview";
import type { AllocationIndexResult } from "@/engine/allocation/indexer";

export interface AllocationServiceProgress {
  stage: "reading" | "indexing" | "complete";

  message: string;

  progress: number;
}

export interface AllocationServiceResult {
  summary: AllocationWorkbookSummary;

  preview: WorkbookPreview;

  index: AllocationIndexResult;
}

/**
 * Coordinates the Allocation workflow.
 *
 * The UI only calls this service.
 * Internally it handles:
 *
 * - Workbook parsing
 * - Allocation indexing
 * - Workbook preview generation
 */
export async function processAllocationWorkbook(
  file: File,
  onProgress?: (
    progress: AllocationServiceProgress
  ) => void
): Promise<AllocationServiceResult> {

  onProgress?.({
    stage: "reading",
    message: "Reading workbook...",
    progress: 10,
  });

  const parsedWorkbook =
    await parseAllocationWorkbook(file);

  onProgress?.({
    stage: "indexing",
    message: "Building allocation index...",
    progress: 75,
  });

  const index =
    buildAllocationIndex(
      parsedWorkbook.worksheets.flatMap(
        (sheet) => sheet.records
      )
    );

  /**
   * Enrich the parsed workbook with
   * business-specific statistics.
   */
  const summary: AllocationWorkbookSummary = {

    sheetCount:
      parsedWorkbook.sheetCount,

    totalRecords:
      parsedWorkbook.totalRecords,

    uniqueCandidates:
      index.uniqueNames,

    duplicateRecords:
      index.duplicateRecords,

    namesWithDuplicates:
      index.namesWithDuplicates,

    worksheets:
      parsedWorkbook.worksheets,

  };

  const preview: WorkbookPreview = {

    fileName: file.name,

    sheetCount: summary.sheetCount,

    totalRecords: summary.totalRecords,

    uniqueCandidates: summary.uniqueCandidates,

    duplicateRecords: summary.duplicateRecords,

    namesWithDuplicates: summary.namesWithDuplicates,

    worksheets:
      summary.worksheets.map(
        (sheet) => ({
          name: sheet.name,
          rowCount: sheet.rowCount,
        })
      ),

  };

  onProgress?.({
    stage: "complete",
    message: "Upload completed.",
    progress: 100,
  });

  return {

    summary,

    preview,

    index,

  };

}