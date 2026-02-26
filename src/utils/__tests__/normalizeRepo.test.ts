import { describe, expect, it } from "vitest";
import type { GitHubRepo } from "../../types";
import { normalizeRepo, processRepos } from "../normalizeRepo";

const baseRepo: GitHubRepo = {
  id: 1,
  name: "fred-site",
  description: "My personal website",
  language: "TypeScript",
  stargazers_count: 12,
  html_url: "https://github.com/fredclausen/fred-site",
  fork: false,
  archived: false,
  topics: ["react", "typescript"],
  updated_at: "2024-06-01T00:00:00Z",
};

describe("normalizeRepo", () => {
  it("maps snake_case API fields to camelCase UI fields", () => {
    const result = normalizeRepo(baseRepo);
    expect(result.stars).toBe(12);
    expect(result.url).toBe("https://github.com/fredclausen/fred-site");
    expect(result.updatedAt).toBe("2024-06-01T00:00:00Z");
  });

  it("uses an empty string when description is null", () => {
    const result = normalizeRepo({ ...baseRepo, description: null });
    expect(result.description).toBe("");
  });

  it("preserves a non-null description", () => {
    const result = normalizeRepo(baseRepo);
    expect(result.description).toBe("My personal website");
  });

  it("preserves null language as null", () => {
    const result = normalizeRepo({ ...baseRepo, language: null });
    expect(result.language).toBeNull();
  });

  it("preserves topics array", () => {
    const result = normalizeRepo(baseRepo);
    expect(result.topics).toEqual(["react", "typescript"]);
  });

  it("handles an empty topics array", () => {
    const result = normalizeRepo({ ...baseRepo, topics: [] });
    expect(result.topics).toEqual([]);
  });
});

describe("processRepos", () => {
  it("excludes forked repositories", () => {
    const repos: GitHubRepo[] = [baseRepo, { ...baseRepo, id: 2, name: "forked-repo", fork: true }];
    const result = processRepos(repos);
    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe("fred-site");
  });

  it("excludes archived repositories", () => {
    const repos: GitHubRepo[] = [
      baseRepo,
      { ...baseRepo, id: 2, name: "old-repo", archived: true },
    ];
    const result = processRepos(repos);
    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe("fred-site");
  });

  it("excludes both forked and archived repositories", () => {
    const repos: GitHubRepo[] = [
      baseRepo,
      { ...baseRepo, id: 2, name: "forked", fork: true },
      { ...baseRepo, id: 3, name: "archived", archived: true },
    ];
    const result = processRepos(repos);
    expect(result).toHaveLength(1);
  });

  it("sorts by star count descending", () => {
    const repos: GitHubRepo[] = [
      { ...baseRepo, id: 1, name: "low-stars", stargazers_count: 1 },
      { ...baseRepo, id: 2, name: "high-stars", stargazers_count: 100 },
      { ...baseRepo, id: 3, name: "mid-stars", stargazers_count: 10 },
    ];
    const result = processRepos(repos);
    expect(result[0]?.name).toBe("high-stars");
    expect(result[1]?.name).toBe("mid-stars");
    expect(result[2]?.name).toBe("low-stars");
  });

  it("uses most recently updated as a tiebreaker when stars are equal", () => {
    const repos: GitHubRepo[] = [
      {
        ...baseRepo,
        id: 1,
        name: "older",
        stargazers_count: 5,
        updated_at: "2023-01-01T00:00:00Z",
      },
      {
        ...baseRepo,
        id: 2,
        name: "newer",
        stargazers_count: 5,
        updated_at: "2024-06-01T00:00:00Z",
      },
    ];
    const result = processRepos(repos);
    expect(result[0]?.name).toBe("newer");
    expect(result[1]?.name).toBe("older");
  });

  it("returns an empty array when all repos are filtered out", () => {
    const repos: GitHubRepo[] = [
      { ...baseRepo, fork: true },
      { ...baseRepo, id: 2, archived: true },
    ];
    expect(processRepos(repos)).toEqual([]);
  });

  it("returns an empty array for an empty input", () => {
    expect(processRepos([])).toEqual([]);
  });
});
