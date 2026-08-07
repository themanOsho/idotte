import { FlatAdmissionMatch } from "../types/admission-result";
import {
  AdmissionReportData,
  AdmissionReportSchoolGroup,
} from "../types/admission-report";
import { DATASTREAM_META } from "../data";

function groupBySchool(
  matches: FlatAdmissionMatch[],
  getSchool: (m: FlatAdmissionMatch) => string,
  getLga: (m: FlatAdmissionMatch) => string
): AdmissionReportSchoolGroup[] {
  const map = new Map<string, AdmissionReportSchoolGroup>();

  for (const match of matches) {
    const schoolName = getSchool(match) || "UNKNOWN SCHOOL";
    const lga = getLga(match) || "N/A";
    const key = `${schoolName}::${lga}`;

    if (!map.has(key)) {
      map.set(key, { schoolName, lga, records: [] });
    }
    map.get(key)!.records.push(match);
  }

  return Array.from(map.values()).sort((a, b) =>
    a.schoolName.localeCompare(b.schoolName)
  );
}

export function buildAdmissionReportData(input: {
  matches: FlatAdmissionMatch[];
  clientFileName: string;
  clientSheetCount: number;
  clientRecordCount: number;
}): AdmissionReportData {
  const admitted = input.matches.filter((m) => (m as any).category === "ADMITTED");
  const redirected = input.matches.filter((m) => (m as any).category === "REDIRECTED");
  const notAdmitted = input.matches.filter((m) => (m as any).category === "NOT_ADMITTED");

  const generatedOn = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date());

  return {
    generatedOn,
    session: DATASTREAM_META.session,
    clientFileName: input.clientFileName,
    clientSheetCount: input.clientSheetCount,
    clientRecordCount: input.clientRecordCount,
    total: input.matches.length,
    admitted: admitted.length,
    redirected: redirected.length,
    notAdmitted: notAdmitted.length,

    // Same grouping as console ADMITTED block
    admittedGroups: groupBySchool(
      admitted,
      (m) => (m as any).matchedSchoolName || m.schoolName || "UNKNOWN SCHOOL",
      (m) => (m as any).actualSchoolLga || "N/A"
    ),

    // Same grouping as console REDIRECTED block
    redirectedGroups: groupBySchool(
      redirected,
      (m) => (m as any).matchedSchoolName || m.schoolName || "UNKNOWN SCHOOL",
      (m) => (m as any).actualSchoolLga || "N/A"
    ),

    // Same grouping as console NOT ADMITTED block
    notAdmittedGroups: groupBySchool(
      notAdmitted,
      (m) => (m as any).matchedSchoolName || "UNKNOWN SCHOOL",
      (m) => (m as any).matchedChoiceLga || "N/A"
    ),
  };
}