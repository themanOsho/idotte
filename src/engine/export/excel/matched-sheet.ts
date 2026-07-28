import ExcelJS from "exceljs";

import type { MatchedRecord } from "@/types/matching";

import {
  styleWorksheet,
  styleTableHeader,
  styleTableRow,
  styleCenteredCell,
  styleMonospaceCell,
  freezeHeaderRow,
  addAutoFilter,
} from "./styles";

export function buildMatchedSheet(
  workbook: ExcelJS.Workbook,
  records: MatchedRecord[]
) {
  const worksheet =
    workbook.addWorksheet("Matched Candidates");

  styleWorksheet(worksheet);

  worksheet.columns = [
    {
      header: "S/N",
      key: "serialNumber",
      width: 10,
    },
    {
      header: "Candidate ID",
      key: "candidateId",
      width: 24,
    },
    {
      header: "Candidate Name",
      key: "name",
      width: 32,
    },
    {
      header: "Feeder School",
      key: "schoolName",
      width: 35,
    },
    {
      header: "Examination Centre",
      key: "centreName",
      width: 35,
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

          record.allocation.candidateId,

          record.client.name,

          record.allocation.schoolName,

          record.allocation.centreName,
        ]);

      styleTableRow(row);

      styleCenteredCell(
        row.getCell(1)
      );

      styleMonospaceCell(
        row.getCell(2)
      );

    }
  );

  freezeHeaderRow(
    worksheet
  );

  addAutoFilter(
    worksheet,
    "E"
  );
}