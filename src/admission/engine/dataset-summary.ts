import { AdmissionDatastream } from "../types/datastream";
import { admissionDatastream, DATASTREAM_META } from "../data";

export interface LgaSummary {
  name: string;
  schools: number;
  students: number;
}

export interface DatasetSummary {
  session: string;
  zoneCount: number;
  schoolCount: number;
  studentCount: number;
  lastUpdated: string;
  lgas: LgaSummary[];
}

function formatLgaName(zoneKey: string): string {
  return zoneKey
    .replace(/\s+ZONEE?$/i, "")
    .trim();
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Parses the admission datastream once and returns aggregate stats.
 * Safe to call on every render – the underlying JSON is static.
 */
export function buildDatasetSummary(
  datastream: AdmissionDatastream = admissionDatastream,
  options?: {
    session?: string;
    lastUpdated?: Date | string;
  }
): DatasetSummary {
  const lgas: LgaSummary[] = [];
  let schoolCount = 0;
  let studentCount = 0;

  for (const [zoneKey, schoolsMap] of Object.entries(datastream)) {
    if (!schoolsMap) continue;

    let zoneSchools = 0;
    let zoneStudents = 0;

    for (const students of Object.values(schoolsMap)) {
      if (!Array.isArray(students)) continue;
      zoneSchools += 1;
      zoneStudents += students.length;
    }

    schoolCount += zoneSchools;
    studentCount += zoneStudents;

    lgas.push({
      name: formatLgaName(zoneKey),
      schools: zoneSchools,
      students: zoneStudents,
    });
  }

  lgas.sort((a, b) => a.name.localeCompare(b.name));

  // update datastream metadata in for new academic sessions src\admission\data\index.ts
  const session = options?.session ?? DATASTREAM_META.session;

  let lastUpdated: string;
  if (typeof options?.lastUpdated === "string") {
    lastUpdated = options.lastUpdated;
  } else if (options?.lastUpdated instanceof Date) {
    lastUpdated = formatDate(options.lastUpdated);
  } else {
    lastUpdated = DATASTREAM_META.lastUpdated;
  }

  return {
    session,
    zoneCount: lgas.length,
    schoolCount,
    studentCount,
    lastUpdated,
    lgas,
  };
}

/** Singleton computed at module load – zero cost on subsequent imports */
export const datasetSummary = buildDatasetSummary();