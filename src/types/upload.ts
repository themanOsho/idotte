export type UploadStage =
  | "idle"
  | "reading"
  | "parsing"
  | "indexing"
  | "complete"
  | "error";