export type AdmissionUploadStage =
  | "idle"
  | "reading"
  | "resolving"
  | "preferred-search"
  | "global-search"
  | "building-report"
  | "complete"
  | "error";