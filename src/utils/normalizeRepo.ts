import type { GitHubRepo, ProjectData } from "../types";

/**
 * Normalizes a raw GitHub API repository response into the internal
 * ProjectData shape used by the UI.
 *
 * Why a separate normalization step: the GitHub API returns dozens of fields
 * the UI doesn't need, and uses snake_case naming that differs from the
 * camelCase convention used throughout the TypeScript codebase. Centralizing
 * this mapping means components never reference raw API field names, making
 * future API changes a single-file fix.
 */
export function normalizeRepo(repo: GitHubRepo): ProjectData {
  return {
    id: repo.id,
    name: repo.name,
    description: repo.description ?? "",
    language: repo.language,
    stars: repo.stargazers_count,
    url: repo.html_url,
    topics: repo.topics,
    updatedAt: repo.updated_at,
  };
}

/**
 * Filters and normalizes a list of raw GitHub repos.
 *
 * Forks and archived repos are excluded because this page is intended to
 * showcase original, active work. The caller can override the filter by
 * passing `includeForksAndArchived: true`.
 */
export function normalizeRepos(
  repos: GitHubRepo[],
  options: { includeForksAndArchived?: boolean } = {},
): ProjectData[] {
  const filtered = options.includeForksAndArchived
    ? repos
    : repos.filter((r) => !r.fork && !r.archived);

  return filtered.map(normalizeRepo);
}

/**
 * Filters, normalizes, and sorts a list of raw GitHub repos for display in
 * the ProjectsPage.
 *
 * Excludes forks and archived repos, then sorts by:
 *   1. Star count descending (most popular first)
 *   2. Most recently updated (tiebreaker)
 *
 * This is the primary entry point used by ProjectsPage — `normalizeRepos` is
 * the lower-level helper for callers that need custom filter options.
 */
export function processRepos(repos: GitHubRepo[]): ProjectData[] {
  return repos
    .filter((repo) => !repo.fork && !repo.archived)
    .map(normalizeRepo)
    .sort((a, b) => {
      if (b.stars !== a.stars) return b.stars - a.stars;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
}
