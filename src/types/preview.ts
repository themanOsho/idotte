export interface WorkbookPreview {
  fileName: string;
  sheetCount: number;
  totalRecords: number;

  worksheets: {
    name: string;
    rowCount: number;
  }[];
}