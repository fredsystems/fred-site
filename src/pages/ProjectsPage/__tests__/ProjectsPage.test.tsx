import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { GitHubRepo } from "../../../types";
import { ProjectsPage } from "../ProjectsPage";

const mockRepos: GitHubRepo[] = [
  {
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
  },
  {
    id: 2,
    name: "another-project",
    description: "Another cool project",
    language: "Python",
    stargazers_count: 5,
    html_url: "https://github.com/fredclausen/another-project",
    fork: false,
    archived: false,
    topics: [],
    updated_at: "2024-05-01T00:00:00Z",
  },
];

function renderProjectsPage() {
  return render(
    <MemoryRouter>
      <ProjectsPage />
    </MemoryRouter>,
  );
}

describe("ProjectsPage", () => {
  beforeEach(() => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockRepos),
    } as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows a loading state initially", () => {
    renderProjectsPage();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders the page heading", async () => {
    renderProjectsPage();
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /projects/i })).toBeInTheDocument();
    });
  });

  it("renders project cards after loading", async () => {
    renderProjectsPage();
    await waitFor(() => {
      expect(screen.getByText("fred-site")).toBeInTheDocument();
    });
  });

  it("renders all non-forked, non-archived repos", async () => {
    renderProjectsPage();
    await waitFor(() => {
      expect(screen.getByText("fred-site")).toBeInTheDocument();
      expect(screen.getByText("another-project")).toBeInTheDocument();
    });
  });

  it("does not render forked repos", async () => {
    const reposWithFork: GitHubRepo[] = [
      ...mockRepos,
      {
        id: 3,
        name: "forked-repo",
        description: "A fork",
        language: "Go",
        stargazers_count: 0,
        html_url: "https://github.com/fredclausen/forked-repo",
        fork: true,
        archived: false,
        topics: [],
        updated_at: "2024-01-01T00:00:00Z",
      },
    ];
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(reposWithFork),
    } as Response);

    renderProjectsPage();
    await waitFor(() => {
      expect(screen.getByText("fred-site")).toBeInTheDocument();
    });
    expect(screen.queryByText("forked-repo")).not.toBeInTheDocument();
  });

  it("does not render archived repos", async () => {
    const reposWithArchived: GitHubRepo[] = [
      ...mockRepos,
      {
        id: 4,
        name: "archived-repo",
        description: "Old project",
        language: "JavaScript",
        stargazers_count: 2,
        html_url: "https://github.com/fredclausen/archived-repo",
        fork: false,
        archived: true,
        topics: [],
        updated_at: "2022-01-01T00:00:00Z",
      },
    ];
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(reposWithArchived),
    } as Response);

    renderProjectsPage();
    await waitFor(() => {
      expect(screen.getByText("fred-site")).toBeInTheDocument();
    });
    expect(screen.queryByText("archived-repo")).not.toBeInTheDocument();
  });

  it("shows an error message when fetch fails", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network error"));
    renderProjectsPage();
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("shows an error message when the API returns a non-ok response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 403,
      statusText: "Forbidden",
    } as Response);
    renderProjectsPage();
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("shows a 'Try again' button on error", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network error"));
    renderProjectsPage();
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
    });
  });

  it("retries fetch when 'Try again' is clicked", async () => {
    const user = userEvent.setup();
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network error"));

    renderProjectsPage();
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
    });

    // Now make fetch succeed on the retry
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockRepos),
    } as Response);

    await user.click(screen.getByRole("button", { name: /try again/i }));

    await waitFor(() => {
      expect(screen.getByText("fred-site")).toBeInTheDocument();
    });
  });

  it("shows an empty state when no repos are returned", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    } as Response);
    renderProjectsPage();
    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
    expect(screen.queryByRole("list", { name: /github projects/i })).not.toBeInTheDocument();
  });

  it("renders the project list with accessible label", async () => {
    renderProjectsPage();
    await waitFor(() => {
      expect(screen.getByRole("list", { name: /github projects/i })).toBeInTheDocument();
    });
  });
});
