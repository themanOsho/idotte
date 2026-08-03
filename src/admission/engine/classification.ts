import { AdmissionDatastream } from "../types/datastream";
import { schoolDirectory } from "../data";
import { normalizeTextToken, isDirectAdmission, getSchoolNameTokens } from "../utils/normalize-school-name";
import { FlatAdmissionMatch } from "../types/admission-result";

export type AdmissionCategory = "ADMITTED" | "REDIRECTED" | "NOT_ADMITTED";

export interface ClassifiedAdmission extends FlatAdmissionMatch {
  category: AdmissionCategory;
  matchedSchoolChoice?: string;
  matchedSchoolName?: string;
  matchedChoiceLga?: string;
  actualSchoolLga?: string;
}

function formatLgaLabel(value?: string): string {
  if (!value) return "N/A";
  return value.replace(/\s+ZONEUTF8/i, "").trim();
}

interface SchoolResolution {
  lga: string;
  schoolName: string;
}

function resolveSchoolChoiceLga(choiceSchool: string): SchoolResolution {
  if (!choiceSchool) return { lga: "N/A", schoolName: "N/A" };

  // First try exact match with normalization
  const normalizedChoice = normalizeTextToken(choiceSchool);
  if (!normalizedChoice) return { lga: "N/A", schoolName: "N/A" };

  for (const [zoneName, schools] of Object.entries(schoolDirectory)) {
    for (const schoolName of schools) {
      if (normalizeTextToken(schoolName) === normalizedChoice) {
        return { 
          lga: formatLgaLabel(zoneName),
          schoolName: schoolName
        };
      }
    }
  }

  // If exact match fails, try fuzzy matching
  for (const [zoneName, schools] of Object.entries(schoolDirectory)) {
    for (const schoolName of schools) {
      if (isDirectAdmission(choiceSchool, schoolName)) {
        return { 
          lga: formatLgaLabel(zoneName),
          schoolName: schoolName
        };
      }
    }
  }

  return { lga: "N/A", schoolName: "N/A" };
}

function resolveActualSchoolLga(actualSchool: string): SchoolResolution {
  if (!actualSchool) return { lga: "N/A", schoolName: "N/A" };

  const normalizedActual = normalizeTextToken(actualSchool);
  if (!normalizedActual) return { lga: "N/A", schoolName: "N/A" };

  // First try exact match with normalization
  for (const [zoneName, schools] of Object.entries(schoolDirectory)) {
    for (const schoolName of schools) {
      if (normalizeTextToken(schoolName) === normalizedActual) {
        return { 
          lga: formatLgaLabel(zoneName),
          schoolName: schoolName
        };
      }
    }
  }

  // If exact match fails, try fuzzy matching
  for (const [zoneName, schools] of Object.entries(schoolDirectory)) {
    for (const schoolName of schools) {
      if (isDirectAdmission(actualSchool, schoolName)) {
        return { 
          lga: formatLgaLabel(zoneName),
          schoolName: schoolName
        };
      }
    }
  }

  return { lga: "N/A", schoolName: "N/A" };
}

export function classifyAdmission(
  match: FlatAdmissionMatch,
  datastream: AdmissionDatastream
): ClassifiedAdmission {
  const result: ClassifiedAdmission = {
    ...match,
    category: "NOT_ADMITTED",
  };

  if (!match.isAdmitted) {
    // Even for not admitted, resolve the school choice LGA
    const resolvedChoice = resolveSchoolChoiceLga(match.clientSchoolChoice);
    result.matchedSchoolChoice = match.clientSchoolChoice;
    result.matchedSchoolName = resolvedChoice.schoolName;
    result.matchedChoiceLga = resolvedChoice.lga;
    return result;
  }

  const resolvedChoice = resolveSchoolChoiceLga(match.clientSchoolChoice);
  const resolvedActual = resolveActualSchoolLga(match.schoolName || "");

  result.matchedSchoolChoice = match.clientSchoolChoice;
  result.matchedSchoolName = resolvedChoice.schoolName;
  result.matchedChoiceLga = resolvedChoice.lga;
  result.actualSchoolLga = resolvedActual.lga;

  // Use fuzzy matching for direct admission check
  if (isDirectAdmission(match.clientSchoolChoice, match.schoolName || "")) {
    result.category = "ADMITTED";
    return result;
  }

  result.category = "REDIRECTED";
  return result;
}
