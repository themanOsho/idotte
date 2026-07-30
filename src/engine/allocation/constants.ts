/**
 * Official Allocation workbook header names.
 *
 * The parser relies on these values to locate
 * columns regardless of their position.
 */
export const ALLOCATION_HEADERS = {
  CANDIDATE_ID: "candidateid",
  FULL_NAME: "fullname",
  LED_NAME: "ledname",
  SCHOOL_NAME: "schoolname",
  CENTRE_NAME: "centrename",
} as const;