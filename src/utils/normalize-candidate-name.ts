/**
 * Normalizes candidate names so that
 * lookups are consistent.
 */
export function normalizeCandidateName(
  value: string
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}