import { describe, expect, it } from "vitest";
import { formatDate, formatISODate } from "../formatDate";

describe("formatDate", () => {
  it("formats a Date object as a human-readable string", () => {
    const result = formatDate(new Date("2024-01-15T12:00:00Z"));
    expect(result).toContain("2024");
    expect(result).toContain("15");
  });

  it("returns empty string for null", () => {
    expect(formatDate(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(formatDate(undefined)).toBe("");
  });

  it("returns a non-empty string for a valid date", () => {
    const result = formatDate(new Date("2023-06-01T00:00:00Z"));
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("formatISODate", () => {
  it("formats a valid ISO 8601 string as a human-readable date", () => {
    // Use noon UTC to avoid date boundary issues in any timezone
    const result = formatISODate("2024-01-15T12:00:00Z");
    expect(result).toContain("2024");
    expect(result).toContain("15");
  });

  it("returns empty string for an empty string", () => {
    expect(formatISODate("")).toBe("");
  });

  it("returns empty string for an invalid date string", () => {
    expect(formatISODate("not-a-date")).toBe("");
  });

  it("returns empty string for a malformed ISO string", () => {
    expect(formatISODate("9999-99-99")).toBe("");
  });

  it("returns a non-empty string for a valid ISO date", () => {
    const result = formatISODate("2023-12-25T00:00:00Z");
    expect(result.length).toBeGreaterThan(0);
  });
});
