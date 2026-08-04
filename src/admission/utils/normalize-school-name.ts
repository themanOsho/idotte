export function normalizeTextToken(text: string): string {
  if (!text) return "";

  return String(text)
    .toUpperCase()
    .replace(/["'''""\\]/g, "")
    .replace(/[\u00a0\s]+/g, " ")
    .replace(/\bCOMMUNITY\b/g, "COMMUNITY")
    .replace(/\bCOMM\b/g, "COMMUNITY")
    .replace(/\bJUNIOR\b/g, "")
    .replace(/\bJNR\b/g, "")
    .replace(/\bGRAMMAR\b/g, "")
    .replace(/\bGRAMM\b/g, "")
    .replace(/\bGRAM\b/g, "")
    .replace(/\bSECONDARY\b/g, "")
    .replace(/\bSEC\b/g, "")
    .replace(/\bPRIMARY\b/g, "")
    .replace(/\bPRY\b/g, "")
    .replace(/\bCOMPREHENSIVE\b/g, "")
    .replace(/\bCOMP\b/g, "")
    .replace(/\bHIGH\b/g, "")
    .replace(/\bHGH\b/g, "")
    .replace(/\bESTATE\b/g, "ESTATE")
    .replace(/\bEST\b/g, "ESTATE")
    .replace(/\bSENIOR\b/g, "")
    .replace(/\bSNR\b/g, "")
    .replace(/\bSCHOOL\b/g, "")
    .replace(/\bSCH\b/g, "")
    .replace(/\bCOLLEGE\b/g, "")
    .replace(/\bCOL\b/g, "")
    .replace(/\bCOLL\b/g, "")
    .replace(/\bGOVERNMENT\b/g, "")
    .replace(/\bGOVT\b/g, "")
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

  if (choiceTokens[0] !== actualTokens[0]) {
    return false;
  }

  const shorterTokens = choiceTokens.length <= actualTokens.length ? choiceTokens : actualTokens;
  const longerTokens = choiceTokens.length <= actualTokens.length ? actualTokens : choiceTokens;

  const isPrefixMatch = shorterTokens.every((token, index) => token === longerTokens[index]);
  if (isPrefixMatch) {
    return true;
  }

  const hasWordByWordValidation = shorterTokens.every((token, index) => {
    const alignedToken = longerTokens[index];
    return token === alignedToken;
  });

  if (!hasWordByWordValidation) {
    return false;
  }

  return true;
}
