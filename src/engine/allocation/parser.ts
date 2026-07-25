import ExcelJS from "exceljs";

import { ALLOCATION_HEADERS } from "./constants";

import {
  AllocationRecord,
  AllocationWorkbookSummary,
  AllocationWorksheet,
} from "@/types/allocation";

/**
 * Parses an uploaded Allocation workbook into
 * Idotte's internal data model.
 */
export async function parseAllocationWorkbook(
  file: File
): Promise<AllocationWorkbookSummary> {
  const workbook = new ExcelJS.Workbook();

  const buffer = await file.arrayBuffer();

  await workbook.xlsx.load(buffer);

  const worksheets: AllocationWorksheet[] = [];

  for (const worksheet of workbook.worksheets) {
    if (worksheet.rowCount === 0) continue;

    const records: AllocationRecord[] = [];

    // Read the header row.
    const headerRow = worksheet.getRow(1);

    // Build a map of header name -> column index.
    const headerMap = new Map<string, number>();

    headerRow.eachCell((cell, columnNumber) => {
      const header = String(cell.value ?? "").trim();

      if (header) {
        headerMap.set(header, columnNumber);
      }
    });

    // Validate required headers.
    const requiredHeaders = Object.values(ALLOCATION_HEADERS);

    const missingHeaders = requiredHeaders.filter(
      (header) => !headerMap.has(header)
    );

    if (missingHeaders.length > 0) {
      throw new Error(
        `Worksheet "${worksheet.name}" is missing required header(s): ${missingHeaders.join(
          ", "
        )}`
      );
    }

    // Safe because validation above guarantees they exist.
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

    // Parse every candidate row.
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      if (!row.hasValues) return;

      records.push({
        candidateId: String(row.getCell(candidateIdColumn).value ?? "").trim(),
        fullName: String(row.getCell(fullNameColumn).value ?? "").trim(),
        ledName: String(row.getCell(ledNameColumn).value ?? "").trim(),
        schoolName: String(row.getCell(schoolNameColumn).value ?? "").trim(),
        centreName: String(row.getCell(centreNameColumn).value ?? "").trim(),
      });
    });

    worksheets.push({
      name: worksheet.name,
      rowCount: records.length,
      records,
    });
  }

  return {
    sheetCount: worksheets.length,
    worksheets,
  };
}