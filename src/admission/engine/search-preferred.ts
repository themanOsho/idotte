import { AdmissionDatastream, StudentRecord } from "../types/datastream";
import { normalizeTextToken } from "../utils/normalize-school-name";
import { getStudentFullName } from "../utils/student-record-access";

export function searchPreferred(
  clientName: string,
  zone: string,
  school: string,
  datastream: AdmissionDatastream
): StudentRecord | null {
  const zoneData = datastream[zone];
  if (!zoneData) return null;

  const schoolRecords = zoneData[school];
  if (!schoolRecords) return null;

  const targetName = normalizeTextToken(clientName);
  if (!targetName) return null;

  for (const record of schoolRecords) {
    const recordName = normalizeTextToken(getStudentFullName(record));
    if (!recordName) continue;

    if (recordName === targetName) {
      return record;
    }
  }

  return null;
}
