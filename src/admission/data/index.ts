import datastreamRaw from "./admission_datastream.json";
import directoryRaw from "./school-directory.json";
import { AdmissionDatastream } from "../types/datastream";
import { SchoolDirectory } from "../types/school-directory";

export const admissionDatastream = datastreamRaw as unknown as AdmissionDatastream;
export const schoolDirectory = directoryRaw as unknown as SchoolDirectory;
