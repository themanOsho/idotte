import ExcelJS from "exceljs";

import { CLIENT_HEADERS } from "./constants";

import {
  ClientRecord,
  ClientWorkbookSummary,
  ClientWorksheet,
} from "@/types/client";

export interface ClientParserProgress {
  stage: "reading" | "parsing";
  message: string;
  progress: number;
}

/**
 * Parses a client workbook into Idotte's internal model.
 */
export async function parseClientWorkbook(
  file: File,
  onProgress?: (progress: ClientParserProgress) => void
): Promise<ClientWorkbookSummary> {
  const workbook = new ExcelJS.Workbook();

  const buffer = await file.arrayBuffer();

  await workbook.xlsx.load(buffer);

  onProgress?.({
    stage: "reading",
    message: "Workbook loaded.",
    progress: 10,
  });

  const worksheets: ClientWorksheet[] = [];

  let totalRecords = 0;

  for (const worksheet of workbook.worksheets) {
    if (worksheet.rowCount === 0) continue;

    const records: ClientRecord[] = [];

    const headerRow = worksheet.getRow(1);

    const headerMap = new Map<string, number>();

    headerRow.eachCell((cell, columnNumber) => {
      const header = String(cell.value ?? "").trim();

      if (header) {
        headerMap.set(header, columnNumber);
      }
    });

    const requiredHeaders = Object.values(CLIENT_HEADERS);

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

    const nameColumn =
      headerMap.get(CLIENT_HEADERS.NAME)!;

    const serialNumberColumn =
      headerMap.get(CLIENT_HEADERS.SERIAL_NUMBER)!;
    
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;

      if (!row.hasValues) return;

      records.push({
        serialNumber: String(
          row.getCell(serialNumberColumn).value ?? ""
        ).trim(),

        rowNumber: rowNumber,

        worksheetName: worksheet.name,

        name: String(
          row.getCell(nameColumn).value ?? ""
        ).trim(),
      });
    });

    totalRecords += records.length;

    worksheets.push({
      name: worksheet.name,
      rowCount: records.length,
      records,
    });
  }

  onProgress?.({
    stage: "parsing",
    message: "Workbook parsed.",
    progress: 100,
  });

  return {
    sheetCount: worksheets.length,
    totalRecords,
    worksheets,
  };
}