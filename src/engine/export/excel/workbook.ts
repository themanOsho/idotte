import ExcelJS from "exceljs";

import { buildSummarySheet } from "./summary-sheet";
import { buildDuplicateSheet } from "./duplicate-sheet";
import { buildMatchedSheet } from "./matched-sheet";
import { buildUnmatchedSheet } from "./unmatched-sheet";

import type { WorkbookPreview } from "@/types/preview";
import type { ClientWorkbookSummary } from "@/types/client";
import type { MatchingResult } from "@/types/matching";

export async function buildPlacementWorkbook(
  allocation: WorkbookPreview,
  client: ClientWorkbookSummary,
  result: MatchingResult
) {
  const workbook = new ExcelJS.Workbook();

  workbook.creator = "Idotte";
  workbook.company = "Mrs Olujobi";
  workbook.subject = "Primary Six Placement Report";
  workbook.title = "Placement Report";

  buildSummarySheet(
    workbook,
    allocation,
    client,
    result
  );

  buildMatchedSheet(
    workbook,
    result.matched
  );

  buildDuplicateSheet(
    workbook,
    result.duplicateMatches
  );

  buildUnmatchedSheet(
    workbook,
    result.unmatched
  );

  return workbook;
}