import { AllocationWorksheet } from "./allocation";

/**
 * Raw workbook returned directly by the parser.
 *
 * No indexing.
 * No duplicate detection.
 * No business logic.
 */
export interface ParsedAllocationWorkbook {
  sheetCount: number;

  totalRecords: number;

  worksheets: AllocationWorksheet[];
}