export interface AllocationWorkbook {
  file: File;
  fileName: string;
  fileSize: number;
}

export interface ParsedWorksheet {
  name: string;
  headers: string[];
  rows: Record<string, unknown>[];
}