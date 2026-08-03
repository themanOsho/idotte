export function normalizeTextToken(text: string): string {
  if (!text) return "";

  return String(text)
    .toUpperCase()
    .replace(/["'''""\\]/g, "")
    .replace(/[\u00a0\s]+/g, " ")
    .replace(/\bCOMMUNITY\b/g, "COMMUNITY")
    .replace(/\bCOMM\b/g, "COMMUNITY")
    .replace(/\bJUNIOR\b/g, "JUNIOR")
    .replace(/\bJNR\b/g, "JUNIOR")
    .replace(/\bGRAMMAR\b/g, "GRAMMAR")
    .replace(/\bGRAMM\b/g, "GRAMMAR")
    .replace(/\bGRAM\b/g, "GRAMMAR")
    .replace(/\bSECONDARY\b/g, "SECONDARY")
    .replace(/\bSEC\b/g, "SECONDARY")
    .replace(/\bPRIMARY\b/g, "PRIMARY")
    .replace(/\bPRY\b/g, "PRIMARY")
    .replace(/\bCOMPREHENSIVE\b/g, "COMPREHENSIVE")
    .replace(/\bCOMP\b/g, "COMPREHENSIVE")
    .replace(/\bHIGH\b/g, "HIGH")
    .replace(/\bHGH\b/g, "HIGH")
    .replace(/\bESTATE\b/g, "ESTATE")
    .replace(/\bEST\b/g, "ESTATE")
    .replace(/\bSENIOR\b/g, "SENIOR")
    .replace(/\bSNR\b/g, "SENIOR")
    .replace(/\bSCHOOL\b/g, "SCHOOL")
    .replace(/\bSCH\b/g, "SCHOOL")
    .replace(/\bCOLLEGE\b/g, "COLLEGE")
    .replace(/\bCOL\b/g, "COLLEGE")
    .replace(/\bCOLL\b/g, "COLLEGE")
    .replace(/\bGOVERNMENT\b/g, "GOVERNMENT")
    .replace(/\bGOVT\b/g, "GOVERNMENT")
    .replace(/[^A-Z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function getSchoolNameTokens(schoolName: string): string[] {
  const normalized = normalizeTextToken(schoolName);
  if (!normalized) return [];
  return normalized.split(" ").filter((token) => token.length > 0);
}

export function calculateSchoolNameSimilarity(choiceSchool: string, actualSchool: string): number {
  const choiceTokens = getSchoolNameTokens(choiceSchool);
  const actualTokens = getSchoolNameTokens(actualSchool);

  if (choiceTokens.length === 0 || actualTokens.length === 0) {
    return 0;
  }

  const matchedTokens = choiceTokens.filter((token) => actualTokens.includes(token));
  const matchRatio = matchedTokens.length / Math.max(choiceTokens.length, actualTokens.length);

  return matchRatio;
}

export function isDirectAdmission(choiceSchool: string, actualSchool: string): boolean {
  const choiceTokens = getSchoolNameTokens(choiceSchool);
  const actualTokens = getSchoolNameTokens(actualSchool);

  if (choiceTokens.length === 0 || actualTokens.length === 0) {
    return false;
  }

  const firstWordMatch = choiceTokens[0] === actualTokens[0];

  if (!firstWordMatch && choiceTokens.length > 1 && actualTokens.length > 1) {
    return false;
  }

  const matchedTokens = choiceTokens.filter((token) => actualTokens.includes(token));
  const minRequiredMatches = Math.ceil(Math.max(choiceTokens.length, actualTokens.length) * 0.6);

  return matchedTokens.length >= minRequiredMatches;
}
