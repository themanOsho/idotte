import datastreamRaw from "./admission_datastream.json";
import directoryRaw from "./school-directory.json";
import { AdmissionDatastream } from "../types/datastream";
import { SchoolDirectory } from "../types/school-directory";

export const admissionDatastream = datastreamRaw as AdmissionDatastream;
export const schoolDirectory = directoryRaw as SchoolDirectory;
