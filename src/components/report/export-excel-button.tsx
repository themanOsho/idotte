"use client";

import { useState } from "react";
import { Download } from "lucide-react";

import { exportPlacementWorkbook } from "@/services/export-service";

import type { WorkbookPreview } from "@/types/preview";
import type { ClientWorkbookSummary } from "@/types/client";
import type { MatchingResult } from "@/types/matching";

interface ExportExcelButtonProps {
  allocation: WorkbookPreview;
  client: ClientWorkbookSummary;
  result: MatchingResult;
}

export function ExportExcelButton({
  allocation,
  client,
  result,
}: ExportExcelButtonProps) {

  const [isExporting, setIsExporting] =
    useState(false);

  async function handleExport() {
    try {
      setIsExporting(true);

      await exportPlacementWorkbook(
        allocation,
        client,
        result
      );
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="btn-secondary inline-flex items-center gap-2 px-5 py-3 text-sm font-medium transition-opacity hover:opacity-90 cursor-printer"
    >
      <Download className="h-4 w-4" />

      {isExporting
        ? "Exporting..."
        : "Export Excel"}
    </button>
  );
}