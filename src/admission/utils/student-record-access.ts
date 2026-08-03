import { StudentRecord } from "../types/datastream";

type StudentRecordLike = StudentRecord | Record<string, unknown>;

function readStringField(record: StudentRecordLike, keys: string[]): string {
  for (const key of keys) {
    const value = (record as Record<string, unknown>)[key];
    if (typeof value === "string") {
      const cleaned = value.trim();
      if (cleaned) return cleaned;
    }

    if (typeof value === "number") {
      return String(value);
    }
  }

  return "";
}

export function getStudentFullName(record: StudentRecordLike): string {
  return readStringField(record, ["fullName", "Full Name", "full name"]);
}

export function getStudentAdmissionNumber(record: StudentRecordLike): string {
  return readStringField(record, ["admissionNumber", "Admission No.", "Admission Number"]);
}

export function getStudentSex(record: StudentRecordLike): string {
  return readStringField(record, ["sex", "Sex"]);
}

export function getStudentFeederSchool(record: StudentRecordLike): string {
  return readStringField(record, ["feederSchool", "Feeder School"]);
}
