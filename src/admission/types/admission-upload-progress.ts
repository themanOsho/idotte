import { AdmissionUploadStage } from "./admission-upload-stage";

export interface AdmissionUploadProgress {
  stage: AdmissionUploadStage;
  /** 0 – 100 */
  progress: number;
  message: string;
  complete: boolean;
  error?: string;
}

export type AdmissionProgressCallback = (progress: AdmissionUploadProgress) => void;