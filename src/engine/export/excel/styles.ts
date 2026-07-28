import ExcelJS from "exceljs";

const BORDER_STYLE: Partial<ExcelJS.Borders> = {
  top: {
    style: "thin",
    color: { argb: "FFD1D5DB" },
  },
  left: {
    style: "thin",
    color: { argb: "FFD1D5DB" },
  },
  bottom: {
    style: "thin",
    color: { argb: "FFD1D5DB" },
  },
  right: {
    style: "thin",
    color: { argb: "FFD1D5DB" },
  },
};

export function styleWorksheet(
  worksheet: ExcelJS.Worksheet
) {
  worksheet.properties.defaultRowHeight = 22;
  worksheet.views = [
    {
      showGridLines: false,
    },
  ];
}

export function styleTitleRow(
  row: ExcelJS.Row
) {
  row.height = 28;

  row.font = {
    bold: true,
    size: 18,
  };

  row.alignment = {
    vertical: "middle",
    horizontal: "center",
  };
}

export function styleSubtitleRow(
  row: ExcelJS.Row
) {
  row.font = {
    bold: true,
    size: 12,
  };

  row.alignment = {
    vertical: "middle",
  };
}

export function styleTableHeader(
  row: ExcelJS.Row
) {
  row.height = 24;

  row.font = {
    bold: true,
    color: {
      argb: "FFFFFFFF",
    },
  };

  row.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: {
      argb: "FF15803D",
    },
  };

  row.alignment = {
    horizontal: "center",
    vertical: "middle",
    wrapText: true,
  };

  row.eachCell((cell) => {
    cell.border = BORDER_STYLE;
  });
}

export function styleTableRow(
  row: ExcelJS.Row
) {
  row.height = 22;

  row.alignment = {
    vertical: "middle",
    wrapText: true,
  };

  row.eachCell((cell) => {
    cell.border = BORDER_STYLE;
  });
}

export function styleCenteredCell(
  cell: ExcelJS.Cell
) {
  cell.alignment = {
    horizontal: "center",
    vertical: "middle",
  };
}

export function styleMonospaceCell(
  cell: ExcelJS.Cell
) {
  cell.font = {
    name: "Consolas",
  };
}

export function freezeHeaderRow(
  worksheet: ExcelJS.Worksheet
) {
  worksheet.views = [
    {
      state: "frozen",
      ySplit: 1,
    },
  ];
}

export function addAutoFilter(
  worksheet: ExcelJS.Worksheet,
  lastColumn: string,
  headerRow = 1
) {
  worksheet.autoFilter = {
    from: `A${headerRow}`,
    to: `${lastColumn}${headerRow}`,
  };
}