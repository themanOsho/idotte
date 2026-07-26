import ExcelJS from "exceljs";

import { ALLOCATION_HEADERS } from "./constants";

import {
  AllocationRecord,
  AllocationWorkbookSummary,
  AllocationWorksheet,
} from "@/types/allocation";

export interface AllocationParserProgress {
  stage: "reading" | "parsing";
  message: string;
  progress: number;
}

/**
 * Parses an Allocation workbook into Idotte's
 * internal data model.
 */
export async function parseAllocationWorkbook(
  file: File,
  onProgress?: (
    progress: AllocationParserProgress
  ) => void
): Promise<AllocationWorkbookSummary> {

  onProgress?.({
    stage: "reading",
    message: "Reading workbook...",
    progress: 5,
  });

  const workbook = new ExcelJS.Workbook();

  const buffer = await file.arrayBuffer();

  await workbook.xlsx.load(buffer);

  onProgress?.({
    stage: "reading",
    message: "Workbook loaded.",
    progress: 20,
  });

  const worksheets: AllocationWorksheet[] = [];

  const totalSheets = workbook.worksheets.length;

  for (let sheetIndex = 0; sheetIndex < totalSheets; sheetIndex++) {

    const worksheet = workbook.worksheets[sheetIndex];

    if (worksheet.rowCount === 0) continue;

    const records: AllocationRecord[] = [];

    const headerRow = worksheet.getRow(1);

    const headerMap = new Map<string, number>();

    headerRow.eachCell((cell, columnNumber) => {

      const header = String(cell.value ?? "").trim();

      if (header) {
        headerMap.set(header, columnNumber);
      }

    });

    const requiredHeaders = Object.values(
      ALLOCATION_HEADERS
    );

    const missingHeaders = requiredHeaders.filter(
      (header) => !headerMap.has(header)
    );

    if (missingHeaders.length > 0) {

      throw new Error(
        `Worksheet "${worksheet.name}" is missing required header(s): ${missingHeaders.join(", ")}`
      );

    }

    const candidateIdColumn =
      headerMap.get(ALLOCATION_HEADERS.CANDIDATE_ID)!;

    const fullNameColumn =
      headerMap.get(ALLOCATION_HEADERS.FULL_NAME)!;

    const ledNameColumn =
      headerMap.get(ALLOCATION_HEADERS.LED_NAME)!;

    const schoolNameColumn =
      headerMap.get(ALLOCATION_HEADERS.SCHOOL_NAME)!;

    const centreNameColumn =
      headerMap.get(ALLOCATION_HEADERS.CENTRE_NAME)!;

    worksheet.eachRow((row, rowNumber) => {

      if (rowNumber === 1) return;

      if (!row.hasValues) return;

      records.push({

        candidateId: String(
          row.getCell(candidateIdColumn).value ?? ""
        ).trim(),

        fullName: String(
          row.getCell(fullNameColumn).value ?? ""
        ).trim(),

        ledName: String(
          row.getCell(ledNameColumn).value ?? ""
        ).trim(),

        schoolName: String(
          row.getCell(schoolNameColumn).value ?? ""
        ).trim(),

        centreName: String(
          row.getCell(centreNameColumn).value ?? ""
        ).trim(),

      });

    });

    worksheets.push({

      name: worksheet.name,

      rowCount: records.length,

      records,

    });

    onProgress?.({

      stage: "parsing",

      message: `Parsed worksheet ${sheetIndex + 1} of ${totalSheets}`,

      progress:
        20 +
        Math.round(
          ((sheetIndex + 1) / totalSheets) * 40
        ),

    });

  }

  onProgress?.({
    stage: "parsing",
    message: "Workbook parsed successfully.",
    progress: 60,
  });

  return {
    sheetCount: worksheets.length,

    totalRecords: worksheets.reduce(
      (total, sheet) => total + sheet.rowCount,
      0
    ),

    worksheets,
  };

}