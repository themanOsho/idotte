export type UploadStage =
  | "idle"
  | "reading"
  | "parsing"
  | "indexing"
  | "matching"
  | "complete"
  | "error";