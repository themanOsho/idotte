import { buildAllocationIndex } from "@/engine/allocation/indexer";
import { parseAllocationWorkbook } from "@/engine/allocation/parser";

import type { AllocationWorkbookSummary } from "@/types/allocation";
import type { WorkbookPreview } from "@/types/preview";
import type { AllocationIndexResult } from "@/engine/allocation/indexer";

export interface AllocationServiceProgress {
  stage:
  | "reading"
  | "parsing"
  | "indexing"
  | "preparing"
  | "complete";

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
    await parseAllocationWorkbook(
      file,
      progress=>{
        onProgress?.({
          stage:progress.stage,
          message:progress.message,
          progress:progress.progress,
        });
      }
    );

  onProgress?.({
    stage:"indexing",
    progress:82,
    message:"Building allocation index...",
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

  onProgress?.({
    stage:"preparing",
    progress:94,
    message:"Preparing workbook preview...",
  });

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
    stage:"complete",
    progress:100,
    message:"Allocation workbook imported.",
  });

  return {

    summary,

    preview,

    index,

  };

}