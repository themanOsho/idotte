export type UploadStage =
  | "idle"
  | "reading"
  | "parsing"
  | "indexing"
  | "preparing"
  | "matching"
  | "complete"
  | "error";