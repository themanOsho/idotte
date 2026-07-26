export interface ClientRecord {
  serialNumber: string;

  fullName: string;

  sex?: string;

  dateOfBirth?: string;
}

export interface ClientWorksheet {
  name: string;

  rowCount: number;

  records: ClientRecord[];
}

export interface ClientWorkbookSummary {
  sheetCount: number;

  worksheets: ClientWorksheet[];
}