/**
 * Converts a candidate name into a
 * consistent format for comparison.
 */
export function normalizeCandidateName(
  value: string
): string {

  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

}