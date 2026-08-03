import { AdmissionDatastream } from "../types/datastream";
import { FlatAdmissionMatch } from "../types/admission-result";
import { schoolDirectory } from "../data";
import { classifyAdmission } from "./classification";
import { evaluateStudentDirectly } from "./matcher";

export interface ClientListInputRow {
  sN?: string | number;
  name: string;
  schoolOfChoice: string;
}

function formatLgaLabel(value?: string): string {
  if (!value) return "N/A";

  return value.replace(/\s+ZONE$/i, "").trim();
}

function formatValue(value?: string): string {
  if (!value || !String(value).trim()) return "N/A";
  return String(value).trim();
}

function getSchoolLga(schoolName?: string): string {
  if (!schoolName) return "N/A";

  for (const [zoneName, schools] of Object.entries(schoolDirectory)) {
    if (schools.includes(schoolName)) {
      return formatLgaLabel(zoneName);
    }
  }

  return "N/A";
}

function printTable(title: string, rows: Array<Record<string, string | number>>) {
  console.log(`\n${title}`);
  console.table(rows);
}

export function generateAndLogAdmissionReport(
  clientList: ClientListInputRow[],
  datastream: AdmissionDatastream
): FlatAdmissionMatch[] {
  const finalMatchesList: FlatAdmissionMatch[] = clientList.map((row) => {
    const match = evaluateStudentDirectly(row.name, row.schoolOfChoice, datastream);
    const classified = classifyAdmission(match, datastream);
    return {
      ...classified,
      clientSerialNumber: row.sN,
    } as FlatAdmissionMatch & { clientSerialNumber?: string | number; category?: string; matchedChoiceLga?: string; actualSchoolLga?: string; matchedSchoolChoice?: string };
  });

  const totalCount = finalMatchesList.length;
  const admittedMatches = finalMatchesList.filter((match) => (match as FlatAdmissionMatch & { category?: string }).category === "ADMITTED");
  const redirectedMatches = finalMatchesList.filter((match) => (match as FlatAdmissionMatch & { category?: string }).category === "REDIRECTED");
  const notAdmittedMatches = finalMatchesList.filter((match) => (match as FlatAdmissionMatch & { category?: string }).category === "NOT_ADMITTED");
  const admittedCount = admittedMatches.length;
  const redirectedCount = redirectedMatches.length;
  const missingCount = notAdmittedMatches.length;

  console.log("\n========================================================");
  console.log("ADMISSION REPORT");
  console.log("========================================================");
  console.log("\nSUMMARY");
  console.log(`Total Students : ${totalCount}`);
  console.log(`Admitted       : ${admittedCount}`);
  console.log(`Redirected     : ${redirectedCount}`);
  console.log(`Not Admitted   : ${missingCount}`);

  console.log("\n--------------------------------------------------");
  console.log("ADMITTED");
  console.log("--------------------------------------------------");

  if (admittedMatches.length === 0) {
    console.log("(None)");
  } else {
    const admittedBySchool = admittedMatches.reduce<Record<string, FlatAdmissionMatch[]>>((acc, match) => {
      const schoolName = match.schoolName || "UNKNOWN SCHOOL";
      acc[schoolName] = acc[schoolName] || [];
      acc[schoolName].push(match);
      return acc;
    }, {});

    Object.entries(admittedBySchool).forEach(([schoolName, matches]) => {
      console.log(`\nSchool: ${schoolName}`);
      console.log(`LGA: ${getSchoolLga(schoolName)}`);
      printTable(
        "",
        matches.map((match) => ({
          "S/N": formatValue(String((match as FlatAdmissionMatch & { clientSerialNumber?: string | number }).clientSerialNumber ?? "")),
          "Admission No": formatValue(match.admissionNumber),
          "Full Name": formatValue(match.clientName),
          "Sex": formatValue(match.sex),
          "Feeder School": formatValue(match.feederSchool),
        }))
      );
    });
  }

  console.log("\n--------------------------------------------------");
  console.log("REDIRECTED ADMISSION(S)");
  console.log("--------------------------------------------------");

  if (redirectedMatches.length === 0) {
    console.log("(None)");
  } else {
    const redirectedBySchool = redirectedMatches.reduce<Record<string, typeof redirectedMatches>>((acc, match) => {
      const schoolName = (match as FlatAdmissionMatch & { matchedSchoolChoice?: string }).matchedSchoolChoice || "UNKNOWN SCHOOL";
      acc[schoolName] = acc[schoolName] || [];
      acc[schoolName].push(match);
      return acc;
    }, {});

    Object.entries(redirectedBySchool).forEach(([schoolName, matches]) => {
      const firstMatch = matches[0] as FlatAdmissionMatch & { matchedChoiceLga?: string; actualSchoolLga?: string };
      console.log(`\nSchool of Choice: ${schoolName}`);
      console.log(`LGA: ${firstMatch.matchedChoiceLga || "N/A"}`);
      printTable(
        "",
        matches.map((match) => ({
          "S/N": formatValue(String((match as FlatAdmissionMatch & { clientSerialNumber?: string | number }).clientSerialNumber ?? "")),
          "Admission No": formatValue(match.admissionNumber),
          "Full Name": formatValue(match.clientName),
          "Sex": formatValue(match.sex),
          "Actual School": formatValue(match.schoolName),
          "Actual LGA": formatValue((match as FlatAdmissionMatch & { actualSchoolLga?: string }).actualSchoolLga),
        }))
      );
    });
  }

  console.log("\n--------------------------------------------------");
  console.log("NOT ADMITTED");
  console.log("--------------------------------------------------");

  if (notAdmittedMatches.length === 0) {
    console.log("(None)");
  } else {
    const notAdmittedBySchool = notAdmittedMatches.reduce<Record<string, typeof notAdmittedMatches>>((acc, match) => {
      const schoolName = (match as FlatAdmissionMatch & { matchedSchoolChoice?: string }).matchedSchoolChoice || "UNKNOWN SCHOOL";
      acc[schoolName] = acc[schoolName] || [];
      acc[schoolName].push(match);
      return acc;
    }, {});

    Object.entries(notAdmittedBySchool).forEach(([schoolName, matches]) => {
      const firstMatch = matches[0] as FlatAdmissionMatch & { matchedChoiceLga?: string; matchedSchoolName?: string };
      console.log(`\nSchool: ${firstMatch.matchedSchoolName || "N/A"}`);
      console.log(`LGA: ${firstMatch.matchedChoiceLga || "N/A"}`);
      printTable(
        "",
        matches.map((match) => ({
          "S/N": formatValue(String((match as FlatAdmissionMatch & { clientSerialNumber?: string | number }).clientSerialNumber ?? "")),
          "Full Name": formatValue(match.clientName),
          "Sex": formatValue(match.sex),
          "Feeder School": formatValue(match.feederSchool),
        }))
      );
    });
  }

  console.log("\n========================================================\n");

  return finalMatchesList;
}
