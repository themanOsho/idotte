import ExcelJS from "exceljs";

import type { UnmatchedRecord } from "@/types/matching";

import {
  styleWorksheet,
  styleTableHeader,
  styleTableRow,
  styleCenteredCell,
  freezeHeaderRow,
  addAutoFilter,
} from "./styles";

export function buildUnmatchedSheet(
  workbook: ExcelJS.Workbook,
  records: UnmatchedRecord[]
) {
  const worksheet =
    workbook.addWorksheet("Unmatched Candidates");

  styleWorksheet(worksheet);

  worksheet.columns = [
    {
      header: "S/N",
      key: "serialNumber",
      width: 10,
    },
    {
      header: "Candidate Name",
      key: "name",
      width: 40,
    },
    {
      header: "Status",
      key: "status",
      width: 25,
    },
  ];

  worksheet.addRow(
    worksheet.columns.map(
      (column) => column.header
    )
  );

  styleTableHeader(
    worksheet.getRow(1)
  );

  records.forEach(
    (record) => {

      const row =
        worksheet.addRow([
          record.client.serialNumber,

          record.client.name,

          "No allocation found",
        ]);

      styleTableRow(row);

      styleCenteredCell(
        row.getCell(1)
      );

    }
  );

  freezeHeaderRow(
    worksheet
  );

  addAutoFilter(
    worksheet,
    "C"
  );
}