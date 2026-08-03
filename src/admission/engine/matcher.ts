import { AdmissionDatastream } from "../types/datastream";
import { FlatAdmissionMatch } from "../types/admission-result";
import {
  getStudentAdmissionNumber,
  getStudentFeederSchool,
  getStudentFullName,
  getStudentSex,
} from "../utils/student-record-access";
import { normalizeTextToken } from "../utils/normalize-school-name";

function namesMatch(clientName: string, recordName: string): boolean {
  const normalizedClient = normalizeTextToken(clientName);
  const normalizedRecord = normalizeTextToken(recordName);

  if (!normalizedClient || !normalizedRecord) return false;

  return normalizedClient === normalizedRecord;
}

export function evaluateStudentDirectly(
  clientName: string,
  schoolChoice: string,
  datastream: AdmissionDatastream
): FlatAdmissionMatch {
  const searchName = normalizeTextToken(clientName);
  const rawChoice = normalizeTextToken(schoolChoice);

  const result: FlatAdmissionMatch = {
    clientName: searchName,
    clientSchoolChoice: rawChoice,
    isAdmitted: false,
  };

  if (!searchName) return result;

  for (const [zoneName, schoolsMap] of Object.entries(datastream)) {
    if (!schoolsMap) continue;

    for (const [schoolName, studentsList] of Object.entries(schoolsMap)) {
      if (!studentsList) continue;

      for (const record of studentsList) {
        if (!record) continue;

        const masterNameClean = getStudentFullName(record);
        if (!masterNameClean) continue;

        if (namesMatch(searchName, masterNameClean)) {
          result.isAdmitted = true;
          result.zoneName = zoneName;
          result.schoolName = schoolName;
          result.admissionNumber = getStudentAdmissionNumber(record);
          result.sex = getStudentSex(record);
          result.feederSchool = getStudentFeederSchool(record);

          return result;
        }
      }
    }
  }

  return result;
}
