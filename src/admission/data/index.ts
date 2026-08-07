import datastreamRaw from "./admission_datastream.json";
import directoryRaw from "./school-directory.json";
import { AdmissionDatastream } from "../types/datastream";
import { SchoolDirectory } from "../types/school-directory";

export const admissionDatastream = datastreamRaw as unknown as AdmissionDatastream;
export const schoolDirectory = directoryRaw as unknown as SchoolDirectory;

/** Update this whenever you replace admission_datastream.json */
export const DATASTREAM_META = {
  session: "2025/2026",
  lastUpdated: "4 Aug 2026",
} as const;