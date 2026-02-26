// Shared TypeScript interfaces for fred-site.
//
// Keep this file to data-shape types only. Component prop interfaces live
// alongside their components. Page-level data types live here because they
// are consumed by both page components and their tests.

// ─── GitHub API ─────────────────────────────────────────────────────────────

/**
 * A single repository returned by the GitHub public REST API.
 * Only the fields the UI actually uses are typed — the full API response
 * contains dozens more fields that we discard.
 */
export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  fork: boolean;
  archived: boolean;
  topics: string[];
  updated_at: string;
}

/**
 * The normalised project shape used within the UI.
 * Derived from GitHubRepo after filtering and mapping.
 */
export interface ProjectData {
  id: number;
  name: string;
  description: string;
  language: string | null;
  stars: number;
  url: string;
  topics: string[];
  updatedAt: string;
}

// ─── Services ────────────────────────────────────────────────────────────────

/**
 * A single self-hosted service link shown on the hidden /services page.
 */
export interface ServiceLink {
  /** Display name of the service */
  name: string;
  /** Full URL to the service */
  url: string;
  /** Short human-readable description */
  description: string;
}

// ─── Async state ─────────────────────────────────────────────────────────────

/**
 * Generic async fetch state used by page-level data hooks.
 * Keeps loading / error / data in one place and avoids prop-drilling
 * three separate booleans.
 */
export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };
