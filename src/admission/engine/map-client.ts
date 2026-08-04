import { AdmissionDatastream } from "../types/datastream";
import { FlatAdmissionMatch } from "../types/admission-result";
import { schoolDirectory } from "../data";
import { normalizeTextToken } from "../utils/normalize-school-name";
import { classifyAdmission } from "./classification";
import { evaluateStudentDirectly } from "./matcher";

export interface ClientListInputRow {
  sN?: string | number;
  name: string;
  schoolOfChoice: string;
  sex?: string;
  sheetName?: string;
}

function formatLgaLabel(value?: string): string {
  if (!value) return "N/A";
  return value.replace(/\s+ZONEE?$/i, "").trim();
}

function formatValue(value?: string): string {
  if (!value || !String(value).trim()) return "N/A";
  return String(value).trim();
}

interface SchoolResolution {
  lga: string;
  schoolName: string;
}

function resolveSchoolNameAndLga(
  schoolName?: string,
  datastream?: AdmissionDatastream
): SchoolResolution {
  if (!schoolName) return { lga: "N/A", schoolName: "N/A" };

  const normalizedSearch = normalizeTextToken(schoolName);
  if (!normalizedSearch) return { lga: "N/A", schoolName: "N/A" };

  // 1. schoolDirectory
  for (const [zoneName, schools] of Object.entries(schoolDirectory)) {
    for (const directorySchool of schools) {
      if (normalizeTextToken(directorySchool) === normalizedSearch) {
        return {
          lga: formatLgaLabel(zoneName),
          schoolName: directorySchool,
        };
      }
    }
  }

  // 2. Datastream keys (clean official names)
  if (datastream) {
    for (const [zoneName, schoolsMap] of Object.entries(datastream)) {
      if (!schoolsMap) continue;
      for (const dsSchool of Object.keys(schoolsMap)) {
        if (normalizeTextToken(dsSchool) === normalizedSearch) {
          return {
            lga: formatLgaLabel(zoneName),
            schoolName: dsSchool,
          };
        }
      }
    }
  }

  return { lga: "N/A", schoolName: "N/A" };
}

function getSchoolLga(schoolName?: string, datastream?: AdmissionDatastream): string {
  return resolveSchoolNameAndLga(schoolName, datastream).lga;
}

function printTable(title: string, rows: Array<Record<string, string | number>>) {
  console.log(`\n${title}`);
  console.table(rows);
}

export function generateAndLogAdmissionReport(
  clientList: ClientListInputRow[],
  datastream: AdmissionDatastream
): FlatAdmissionMatch[] {
  const groupedRows = clientList.reduce<Record<string, ClientListInputRow[]>>((acc, row) => {
    const sheetKey = row.sheetName || "DEFAULT";
    acc[sheetKey] = acc[sheetKey] || [];
    acc[sheetKey].push(row);
    return acc;
  }, {});

  const allMatches: FlatAdmissionMatch[] = [];

  Object.entries(groupedRows).forEach(([sheetName, rows], index) => {
    const finalMatchesList = rows.map((row) => {
      const match = evaluateStudentDirectly(row.name, row.schoolOfChoice, datastream);
      const classified = classifyAdmission(match, datastream);
      return {
        ...classified,
        clientSerialNumber: row.sN,
        clientSex: row.sex,
        sex: classified.sex || row.sex || match.sex,
      } as FlatAdmissionMatch & {
        clientSerialNumber?: string | number;
        clientSex?: string;
        category?: string;
        matchedChoiceLga?: string;
        actualSchoolLga?: string;
        matchedSchoolChoice?: string;
        matchedSchoolName?: string;
      };
    });

    allMatches.push(...finalMatchesList);

    const totalCount = finalMatchesList.length;
    const admittedMatches = finalMatchesList.filter(
      (m) => (m as any).category === "ADMITTED"
    );
    const redirectedMatches = finalMatchesList.filter(
      (m) => (m as any).category === "REDIRECTED"
    );
    const notAdmittedMatches = finalMatchesList.filter(
      (m) => (m as any).category === "NOT_ADMITTED"
    );

    if (index > 0) console.log("\n");

    console.log("========================================================");
    console.log("ADMISSION REPORT");
    console.log("========================================================");
    console.log(`\nSUMMARY ${sheetName === "DEFAULT" ? "" : sheetName}`.trim());
    console.log(`Total Students : ${totalCount}`);
    console.log(`Admitted       : ${admittedMatches.length}`);
    console.log(`Redirected     : ${redirectedMatches.length}`);
    console.log(`Not Admitted   : ${notAdmittedMatches.length}`);

    // ---------- ADMITTED ----------
    console.log("\n--------------------------------------------------");
    console.log("ADMITTED");
    console.log("--------------------------------------------------");

    if (admittedMatches.length === 0) {
      console.log("(None)");
    } else {
      const admittedBySchool = admittedMatches.reduce<
        Record<string, FlatAdmissionMatch[]>
      >((acc, match) => {
        // Always the clean Datastream name
        const schoolName =
          (match as any).matchedSchoolName || match.schoolName || "UNKNOWN SCHOOL";
        acc[schoolName] = acc[schoolName] || [];
        acc[schoolName].push(match);
        return acc;
      }, {});

      Object.entries(admittedBySchool).forEach(([schoolName, matches]) => {
        const first = matches[0] as any;
        console.log(`\nSchool: ${schoolName}`);
        console.log(
          `LGA: ${first.actualSchoolLga || getSchoolLga(schoolName, datastream)}`
        );
        printTable(
          "",
          matches.map((match) => ({
            "S/N": formatValue(
              String((match as any).clientSerialNumber ?? "")
            ),
            "Admission No": formatValue(match.admissionNumber),
            "Full Name": formatValue(match.clientName),
            Sex: formatValue(match.sex),
          }))
        );
      });
    }

    // ---------- REDIRECTED (single section) ----------
    console.log("\n--------------------------------------------------");
    console.log("REDIRECTED ADMISSION(S)");
    console.log("--------------------------------------------------");

    if (redirectedMatches.length === 0) {
      console.log("(None)");
    } else {
      const redirectedBySchool = redirectedMatches.reduce<
        Record<string, typeof redirectedMatches>
      >((acc, match) => {
        // Group by the clean admitted-school name from Datastream
        const schoolName =
          (match as any).matchedSchoolName ||
          match.schoolName ||
          "UNKNOWN SCHOOL";
        acc[schoolName] = acc[schoolName] || [];
        acc[schoolName].push(match);
        return acc;
      }, {});

      Object.entries(redirectedBySchool).forEach(([schoolName, matches]) => {
        const first = matches[0] as any;
        // Header = clean admitted school + its LGA
        console.log(`\nSchool: ${first.matchedSchoolName || schoolName}`);
        console.log(`LGA: ${first.actualSchoolLga || "N/A"}`);
        printTable(
          "",
          matches.map((match) => {
            const m = match as any;
            // School of Choice column: ONLY the clean resolved name + LGA
            const choiceName =
              m.matchedSchoolChoice && m.matchedSchoolChoice !== "N/A"
                ? m.matchedSchoolChoice
                : "N/A";
            const choiceLga = m.matchedChoiceLga || "N/A";
            return {
              "S/N": formatValue(String(m.clientSerialNumber ?? "")),
              "Admission No": formatValue(match.admissionNumber),
              "Full Name": formatValue(match.clientName),
              Sex: formatValue(match.sex),
              "School of Choice": formatValue(`${choiceName}, ${choiceLga}`),
            };
          })
        );
      });
    }

    // ---------- NOT ADMITTED ----------
    console.log("\n--------------------------------------------------");
    console.log("NOT ADMITTED");
    console.log("--------------------------------------------------");

    if (notAdmittedMatches.length === 0) {
      console.log("(None)");
    } else {
      const notAdmittedBySchool = notAdmittedMatches.reduce<
        Record<string, typeof notAdmittedMatches>
      >((acc, match) => {
        const schoolName =
          (match as any).matchedSchoolName || "UNKNOWN SCHOOL";
        acc[schoolName] = acc[schoolName] || [];
        acc[schoolName].push(match);
        return acc;
      }, {});

      Object.entries(notAdmittedBySchool).forEach(([schoolName, matches]) => {
        const first = matches[0] as any;
        console.log(
          `\nSchool of Choice: ${first.matchedSchoolName || schoolName}`
        );
        console.log(`LGA: ${first.matchedChoiceLga || "N/A"}`);
        printTable(
          "",
          matches.map((match) => ({
            "S/N": formatValue(
              String((match as any).clientSerialNumber ?? "")
            ),
            "Full Name": formatValue(match.clientName),
            Sex: formatValue(
              (match as any).clientSex || match.sex
            ),
          }))
        );
      });
    }

    console.log("\n========================================================\n");
  });

  return allMatches;
}