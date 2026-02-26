// Date formatting utilities.
//
// Pure functions with no side effects — safe to use anywhere in the component
// tree, and straightforward to unit-test with deterministic inputs.

/**
 * Formats a Date object as a human-readable string.
 *
 * Returns an empty string for null/undefined rather than throwing, so callers
 * do not need to guard against missing dates in template expressions.
 *
 * @example
 * formatDate(new Date("2024-01-15T00:00:00Z")) // "January 15, 2024"
 * formatDate(null)                              // ""
 */
export function formatDate(date: Date | null | undefined): string {
  if (date == null) return "";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Formats an ISO 8601 date string as a human-readable string.
 *
 * Handles invalid strings gracefully by returning an empty string rather than
 * throwing or returning "Invalid Date". This makes it safe to use directly
 * with unvalidated API data.
 *
 * @example
 * formatISODate("2024-01-15T00:00:00Z") // "January 15, 2024"
 * formatISODate("")                      // ""
 * formatISODate("not-a-date")            // ""
 */
export function formatISODate(isoString: string): string {
  if (!isoString) return "";

  const date = new Date(isoString);

  // new Date() produces an "Invalid Date" when parsing fails — isNaN detects this
  if (Number.isNaN(date.getTime())) return "";

  return formatDate(date);
}
