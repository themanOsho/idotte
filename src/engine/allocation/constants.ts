/**
 * Official Allocation workbook header names.
 *
 * The parser relies on these values to locate
 * columns regardless of their position.
 */
export const ALLOCATION_HEADERS = {
  CANDIDATE_ID: "CandidateID",
  FULL_NAME: "FullName",
  LED_NAME: "LedName",
  SCHOOL_NAME: "SchoolName",
  CENTRE_NAME: "CentreName",
} as const;