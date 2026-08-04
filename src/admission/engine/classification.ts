import { AdmissionDatastream } from "../types/datastream";
import { schoolDirectory } from "../data";
import {
  normalizeTextToken,
  isDirectAdmission,
  getSchoolNameTokens,
} from "../utils/normalize-school-name";
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
  return value.replace(/\s+ZONEE?$/i, "").trim();
}

interface SchoolResolution {
  lga: string;
  schoolName: string;
}

/** Light clean-up only – never strips JNR / SEC / HIGH / SCH etc. */
function lightNormalize(text: string): string {
  if (!text) return "";
  return String(text)
    .toUpperCase()
    .replace(/["'''""\\]/g, "")
    .replace(/[\u00a0\s]+/g, " ")
    .replace(/[^A-Z0-9\s.]/g, "")   // keep dots so "MEM." stays distinguishable
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Score how well a candidate official name matches the client string.
 * Uses the same token logic that isDirectAdmission already trusts.
 * Called ONLY after exact-match step has failed.
 */
function scoreMatch(client: string, official: string): number {
  const clientTokens = getSchoolNameTokens(client);
  const officialTokens = getSchoolNameTokens(official);
  if (clientTokens.length === 0 || officialTokens.length === 0) return 0;

  // Prefer cases where the first significant token matches
  if (clientTokens[0] !== officialTokens[0]) return 0;

  const matched = clientTokens.filter((t) => officialTokens.includes(t)).length;
  return matched / clientTokens.length;
}

/**
 * Resolve any school string to a clean official name + LGA.
 *
 * STRICT PRIORITY:
 *   Step 1 – Exact 1:1 string match (light normalize only) against
 *            Datastream keys, then schoolDirectory.
 *            If found → return immediately, stop searching.
 *   Step 2 – Only when Step 1 yields zero hits: run full token
 *            normalization + fuzzy scoring.
 * Never returns the raw client string.
 */
function resolveSchool(
  schoolName: string,
  datastream?: AdmissionDatastream,
  zoneHint?: string
): SchoolResolution {
  if (!schoolName) return { lga: "N/A", schoolName: "N/A" };

  const light = lightNormalize(schoolName);
  if (!light) return { lga: "N/A", schoolName: "N/A" };

  // ============================================================
  // STEP 1 – Exact 1:1 match (no aggressive token stripping)
  // ============================================================

  // 1a. Exact against Datastream keys (preferred source of truth)
  if (datastream) {
    for (const [zoneName, schoolsMap] of Object.entries(datastream)) {
      if (!schoolsMap) continue;
      for (const dsSchool of Object.keys(schoolsMap)) {
        if (lightNormalize(dsSchool) === light) {
          return {
            lga: formatLgaLabel(zoneName),
            schoolName: dsSchool,          // clean Datastream name
          };
        }
      }
    }
  }

  // 1b. Exact against schoolDirectory
  for (const [zoneName, schools] of Object.entries(schoolDirectory)) {
    for (const dirSchool of schools) {
      if (lightNormalize(dirSchool) === light) {
        return {
          lga: formatLgaLabel(zoneName),
          schoolName: dirSchool,
        };
      }
    }
  }

  // ============================================================
  // STEP 2 – Fallback: full normalize + token scoring
  // (only reached when Step 1 returned zero hits)
  // ============================================================

  let bestScore = 0;
  let best: SchoolResolution = { lga: "N/A", schoolName: "N/A" };

  // Prefer Datastream
  if (datastream) {
    for (const [zoneName, schoolsMap] of Object.entries(datastream)) {
      if (!schoolsMap) continue;
      for (const dsSchool of Object.keys(schoolsMap)) {
        const score = scoreMatch(schoolName, dsSchool);
        if (score > bestScore) {
          bestScore = score;
          best = {
            lga: formatLgaLabel(zoneName),
            schoolName: dsSchool,
          };
        }
      }
    }
  }

  // Then directory
  for (const [zoneName, schools] of Object.entries(schoolDirectory)) {
    for (const dirSchool of schools) {
      const score = scoreMatch(schoolName, dirSchool);
      if (score > bestScore) {
        bestScore = score;
        best = {
          lga: formatLgaLabel(zoneName),
          schoolName: dirSchool,
        };
      }
    }
  }

  // Accept only a strong token match (every client token present)
  if (bestScore >= 1) {
    return best;
  }

  // Absolute last resort
  if (zoneHint) {
    return {
      lga: formatLgaLabel(zoneHint),
      schoolName: "N/A",
    };
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
    const resolvedChoice = resolveSchool(match.clientSchoolChoice, datastream);
    result.matchedSchoolChoice = resolvedChoice.schoolName;
    result.matchedSchoolName = resolvedChoice.schoolName;
    result.matchedChoiceLga = resolvedChoice.lga;
    return result;
  }

  // Choice (what the student selected) – now handles abbreviations
  const resolvedChoice = resolveSchool(match.clientSchoolChoice, datastream);

  // Actual school the student was placed in (already a clean Datastream key)
  const resolvedActual = resolveSchool(
    match.schoolName || "",
    datastream,
    match.zoneName
  );

  result.matchedSchoolChoice = resolvedChoice.schoolName; // clean only
  result.matchedSchoolName =
    resolvedActual.schoolName !== "N/A"
      ? resolvedActual.schoolName
      : match.schoolName || "N/A";
  result.matchedChoiceLga = resolvedChoice.lga;
  result.actualSchoolLga =
    resolvedActual.lga !== "N/A"
      ? resolvedActual.lga
      : formatLgaLabel(match.zoneName);

  if (isDirectAdmission(match.clientSchoolChoice, match.schoolName || "")) {
    result.category = "ADMITTED";
    return result;
  }

  result.category = "REDIRECTED";
  return result;
}