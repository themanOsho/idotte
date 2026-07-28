import ExcelJS from "exceljs";

import type { DuplicateMatch } from "@/types/matching";

import {
  styleWorksheet,
  styleTableHeader,
  styleTableRow,
  styleCenteredCell,
  styleMonospaceCell,
  freezeHeaderRow,
  addAutoFilter,
} from "./styles";

export function buildDuplicateSheet(
  workbook: ExcelJS.Workbook,
  records: DuplicateMatch[]
) {
  const worksheet =
    workbook.addWorksheet("Duplicate Candidates");

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
      width: 32,
    },
    {
      header: "Candidate ID",
      key: "candidateId",
      width: 24,
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
    (duplicate) => {

      duplicate.allocations.forEach(
        (allocation, index) => {

          const row =
            worksheet.addRow([
              index === 0
                ? duplicate.client.serialNumber
                : "",

              index === 0
                ? duplicate.client.name
                : "",

              allocation.candidateId,

              allocation.schoolName,

              allocation.centreName,
            ]);

          styleTableRow(row);

          styleCenteredCell(
            row.getCell(1)
          );

          styleMonospaceCell(
            row.getCell(3)
          );

        }
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