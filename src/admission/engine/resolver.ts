import { AdmissionDatastream } from "../types/datastream";
import { normalizeTextToken } from "../utils/normalize-school-name";

interface ResolvedRoute {
  zone: string;
  school: string;
}

export function resolveRouteDirectly(
  clientChoice: string, 
  datastream: AdmissionDatastream
): ResolvedRoute | null {
  const inputClean = normalizeTextToken(clientChoice);
  const inputWords = inputClean.split(" ").filter(w => w.length > 1);

  let bestZone = "";
  let bestSchool = "";
  let maxMatchedWords = 0;

  // Extract keys directly from your actual student database stream
  for (const [zoneName, schoolsMap] of Object.entries(datastream)) {
    if (!schoolsMap) continue;
    
    for (const officialSchoolName of Object.keys(schoolsMap)) {
      const officialClean = normalizeTextToken(officialSchoolName);
      
      // Direct Match
      if (officialClean === inputClean) {
        return { zone: zoneName, school: officialSchoolName };
      }

      // Keyword intersection count
      const officialWords = officialClean.split(" ");
      const matchCount = inputWords.filter(w => officialWords.includes(w)).length;

      if (matchCount > maxMatchedWords) {
        maxMatchedWords = matchCount;
        bestZone = zoneName;
        bestSchool = officialSchoolName;
      }
    }
  }

  if (maxMatchedWords > 0) {
    return { zone: bestZone, school: bestSchool };
  }

  return null;
}
