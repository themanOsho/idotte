import { AdmissionDatastream, StudentRecord } from "../types/datastream";
import { getStudentFullName } from "../utils/student-record-access";
import { normalizeTextToken } from "../utils/normalize-school-name";

interface GlobalMatchResult {
  record: StudentRecord;
  actualZone: string;
  actualSchool: string;
}

export function searchGlobal(
  clientName: string,
  datastream: AdmissionDatastream
): GlobalMatchResult | null {
  const targetName = normalizeTextToken(clientName);
  if (!targetName) return null;

  for (const [zoneName, schoolsMap] of Object.entries(datastream)) {
    if (!schoolsMap) continue;

    for (const [schoolName, studentsList] of Object.entries(schoolsMap)) {
      if (!studentsList) continue;

      for (const record of studentsList) {
        const recordName = normalizeTextToken(getStudentFullName(record));
        if (!recordName) continue;

        if (recordName === targetName) {
          return { record, actualZone: zoneName, actualSchool: schoolName };
        }
      }
    }
  }

  return null;
}
