import { AllocationWorkbookSummary } from "./allocation";
import { WorkbookPreview } from "./preview";
import { AllocationIndexResult } from "@/engine/allocation/indexer";
import { ClientWorkbookSummary } from "./client";
import { MatchingResult } from "./matching";
import { UploadStage } from "./upload";

export interface WorkspaceState {
  allocationSummary: AllocationWorkbookSummary | null;

  allocationPreview: WorkbookPreview | null;

  allocationIndex: AllocationIndexResult | null;

  clientSummary: ClientWorkbookSummary | null;

  matchingResult: MatchingResult | null;

  uploadStage: UploadStage;

  uploadMessage: string;

  uploadProgress: number;

  isBusy: boolean;
}