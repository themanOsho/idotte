export interface ClientRecord {
  serialNumber: string;
  rowNumber: number;
  worksheetName: string;
  name: string;
}

export interface ClientWorksheet {
  name: string;
  rowCount: number;
  records: ClientRecord[];
}

export interface ClientWorkbookSummary {
  sheetCount: number;
  totalRecords: number;
  worksheets: ClientWorksheet[];
}