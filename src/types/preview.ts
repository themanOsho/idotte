export interface WorkbookPreview {

  fileName: string;

  sheetCount: number;

  totalRecords: number;

  uniqueCandidates: number;

  duplicateRecords: number;

  namesWithDuplicates: number;

  worksheets: {

    name: string;

    rowCount: number;

  }[];

}