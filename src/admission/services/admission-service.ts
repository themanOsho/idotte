import { admissionDatastream } from "../data";
import { parseClientExcelFile } from "../engine/parse-client";
import { evaluateStudentDirectly } from "../engine/matcher";
import { classifyAdmission } from "../engine/classification";
import { FlatAdmissionMatch } from "../types/admission-result";
import { ClientListInputRow } from "../engine/map-client";
import {
  AdmissionProgressCallback,
} from "../types/admission-upload-progress";
import { emitProgress, friendlyErrorMessage } from "./admission-progress";

export interface AdmissionMatchingResult {
  matches: FlatAdmissionMatch[];
  total: number;
  admitted: number;
  redirected: number;
  notAdmitted: number;
  /** Workbook meta from the parse step */
  preview: {
    fileName: string;
    sheetCount: number;
    totalRecords: number;
  };
}

/**
 * Main entry point called immediately after the Client List is selected.
 * Reports continuous progress via `onProgress`.
 */
export async function processAdmissionMatching(
  file: File,
  onProgress?: AdmissionProgressCallback
): Promise<AdmissionMatchingResult> {
  try {
    // --------------------------------------------------------
    // 1. Reading workbook (~0-10 %)
    // --------------------------------------------------------
    emitProgress(onProgress, "reading", 0.05);
    await yieldToUI();

    emitProgress(onProgress, "reading", 0.35);
    const clientList = await parseClientExcelFile(file);
    const sheetNames = new Set(
      clientList.map((row) => row.sheetName || "Sheet1")
    );
    const sheetCount = sheetNames.size;
    emitProgress(onProgress, "reading", 0.85);
    await yieldToUI();

    if (!clientList.length) {
      throw new Error("No valid data found in any sheet. Missing required columns: S/N, Name, School of Choice.");
    }
    emitProgress(onProgress, "reading", 1);

    // --------------------------------------------------------
    // 2. Resolving intended schools (~10-30 %)
    // --------------------------------------------------------
    emitProgress(onProgress, "resolving", 0.1);
    await yieldToUI();

    // Light pre-pass: just let the UI breathe; actual resolve happens inside classify
    const total = clientList.length;
    for (let i = 0; i < Math.min(total, 8); i++) {
      emitProgress(onProgress, "resolving", (i + 1) / 8);
      await yieldToUI(8);
    }
    emitProgress(onProgress, "resolving", 1);

    // --------------------------------------------------------
    // 3 + 4. Preferred + Global search (~30-90 %)
    //    We walk every student once. The first half of the loop
    //    is reported under preferred-search, the second under
    //    global-search so the bar advances continuously.
    // --------------------------------------------------------
    const matches: FlatAdmissionMatch[] = [];
    const preferredEnd = Math.floor(total * 0.65); // ~40 % weight

    for (let i = 0; i < total; i++) {
      const row = clientList[i];
      const raw = evaluateStudentDirectly(row.name, row.schoolOfChoice, admissionDatastream);
      const classified = classifyAdmission(raw, admissionDatastream);

      matches.push({
        ...classified,
        clientSerialNumber: row.sN,
        clientSex: row.sex,
        sex: classified.sex || row.sex || raw.sex,
      } as FlatAdmissionMatch & {
        clientSerialNumber?: string | number;
        clientSex?: string;
      });

      if (i < preferredEnd) {
        const fraction = preferredEnd === 0 ? 1 : (i + 1) / preferredEnd;
        emitProgress(onProgress, "preferred-search", fraction);
      } else {
        const globalIndex = i - preferredEnd;
        const globalTotal = total - preferredEnd || 1;
        const fraction = (globalIndex + 1) / globalTotal;
        emitProgress(onProgress, "global-search", fraction);
      }

      // Keep UI responsive on large workbooks
      if (i % 12 === 0) await yieldToUI(4);
    }

    emitProgress(onProgress, "global-search", 1);

    // --------------------------------------------------------
    // 5. Building report (~90-100 %)
    // --------------------------------------------------------
    emitProgress(onProgress, "building-report", 0.2);
    await yieldToUI();

    const admitted = matches.filter((m) => (m as any).category === "ADMITTED").length;
    const redirected = matches.filter((m) => (m as any).category === "REDIRECTED").length;
    const notAdmitted = matches.filter((m) => (m as any).category === "NOT_ADMITTED").length;

    emitProgress(onProgress, "building-report", 0.7);
    await yieldToUI();

    // Final polish
    emitProgress(onProgress, "building-report", 1);
    await yieldToUI(30);

    emitProgress(onProgress, "complete");

    return {
      matches,
      total: matches.length,
      admitted,
      redirected,
      notAdmitted,
      preview: {
        fileName: file.name,
        sheetCount,
        totalRecords: clientList.length,
      },
    };
  } catch (err) {
    const message = friendlyErrorMessage(err);
    emitProgress(onProgress, "error", 0, message);
    throw new Error(message);
  }
}

/** Tiny delay so React can paint progress updates */
function yieldToUI(ms = 12): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}