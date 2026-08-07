import { AdmissionUploadStage } from "../types/admission-upload-stage";
import {
  AdmissionUploadProgress,
  AdmissionProgressCallback,
} from "../types/admission-upload-progress";

/** Approximate weight of each stage (sums to 100) */
const STAGE_WEIGHTS: Record<Exclude<AdmissionUploadStage, "idle" | "complete" | "error">, number> = {
  reading: 10,
  resolving: 20,
  "preferred-search": 40,
  "global-search": 20,
  "building-report": 10,
};

const STAGE_MESSAGES: Record<AdmissionUploadStage, string> = {
  idle: "Waiting to start…",
  reading: "Reading client workbook…",
  resolving: "Resolving school locations…",
  "preferred-search": "Searching intended schools…",
  "global-search": "Searching other schools…",
  "building-report": "Preparing report…",
  complete: "Admission report generated.",
  error: "Something went wrong.",
};

/** Running base % before the current stage */
function baseBefore(stage: AdmissionUploadStage): number {
  const order: AdmissionUploadStage[] = [
    "reading",
    "resolving",
    "preferred-search",
    "global-search",
    "building-report",
  ];
  let total = 0;
  for (const s of order) {
    if (s === stage) break;
    total += STAGE_WEIGHTS[s as keyof typeof STAGE_WEIGHTS] ?? 0;
  }
  return total;
}

/**
 * Emit a progress update.
 * `fraction` is 0–1 progress *within* the current stage.
 */
export function emitProgress(
  onProgress: AdmissionProgressCallback | undefined,
  stage: AdmissionUploadStage,
  fraction: number = 0,
  overrideMessage?: string
) {
  if (!onProgress) return;

  if (stage === "complete") {
    onProgress({
      stage,
      progress: 100,
      message: overrideMessage ?? STAGE_MESSAGES.complete,
      complete: true,
    });
    return;
  }

  if (stage === "error") {
    onProgress({
      stage,
      progress: 0,
      message: overrideMessage ?? STAGE_MESSAGES.error,
      complete: false,
      error: overrideMessage,
    });
    return;
  }

  if (stage === "idle") {
    onProgress({
      stage,
      progress: 0,
      message: STAGE_MESSAGES.idle,
      complete: false,
    });
    return;
  }

  const weight = STAGE_WEIGHTS[stage as keyof typeof STAGE_WEIGHTS] ?? 0;
  const base = baseBefore(stage);
  const clamped = Math.max(0, Math.min(1, fraction));
  const progress = Math.min(99, Math.round(base + weight * clamped));

  onProgress({
    stage,
    progress,
    message: overrideMessage ?? STAGE_MESSAGES[stage],
    complete: false,
  });
}

/** Friendly error messages mapped from common failure reasons */
export function friendlyErrorMessage(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err ?? "");

  if (/no valid data|missing required columns/i.test(raw)) {
    return "Client workbook could not be processed.\nPlease ensure every sheet contains S/N, Name and School of Choice columns.";
  }
  if (/directory|school.?directory/i.test(raw)) {
    return "School directory could not be resolved.";
  }
  if (/datastream|admission dataset|dataset is missing/i.test(raw)) {
    return "Admission dataset is missing.";
  }
  if (/report/i.test(raw)) {
    return "Admission report generation failed.";
  }

  return raw || "An unexpected error occurred while processing the admission workbook.";
}