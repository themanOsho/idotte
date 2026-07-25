/**
 * A single candidate extracted from the official
 * Allocation workbook.
 */
export interface AllocationRecord {
  candidateId: string;
  fullName: string;
  ledName: string;
  schoolName: string;
  centreName: string;
}

/**
 * Parsed worksheet.
 */
export interface AllocationWorksheet {
  name: string;
  rowCount: number;
  records: AllocationRecord[];
}

/**
 * Parsed allocation workbook.
 */
export interface AllocationWorkbookSummary {
  sheetCount: number;
  worksheets: AllocationWorksheet[];
}