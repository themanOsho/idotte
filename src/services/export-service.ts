import { buildPlacementWorkbook } from "@/engine/export/excel/workbook";

import type { WorkbookPreview } from "@/types/preview";
import type { ClientWorkbookSummary } from "@/types/client";
import type { MatchingResult } from "@/types/matching";

export async function exportPlacementWorkbook(
  allocation: WorkbookPreview,
  client: ClientWorkbookSummary,
  result: MatchingResult
) {
  const workbook =
    await buildPlacementWorkbook(
      allocation,
      client,
      result
    );

  const buffer =
    await workbook.xlsx.writeBuffer();

  const blob =
    new Blob(
      [buffer],
      {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  const now = new Date();

  const date =
    now.toISOString()
        .slice(0, 10)
        .replaceAll("-", "_");

  const time =
    now.toTimeString()
        .slice(0, 5)
        .replace(":", "");

  link.download =
    `Placement_Report_${date}_${time}.xlsx`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}