import { useCallback, useEffect, useState } from "react";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { ProjectCard } from "../../components/ProjectCard/ProjectCard";
import type { GitHubRepo, ProjectData } from "../../types";
import { processRepos } from "../../utils/normalizeRepo";
import styles from "./ProjectsPage.module.scss";

const GITHUB_USERNAME = "fredclausen";
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: ProjectData[] }
  | { status: "error"; message: string };

export function ProjectsPage(): React.JSX.Element {
  const [state, setState] = useState<FetchState>({ status: "idle" });

  // Why useCallback: fetchRepos is passed as a useEffect dependency and used in JSX
  // as the "Try again" button handler. Without useCallback it would be recreated on
  // every render, triggering the effect on every render and causing an infinite loop.
  const fetchRepos = useCallback((): void => {
    setState({ status: "loading" });

    fetch(GITHUB_API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`GitHub API returned ${res.status}: ${res.statusText}`);
        }
        return res.json() as Promise<GitHubRepo[]>;
      })
      .then((repos) => {
        setState({ status: "success", data: processRepos(repos) });
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while fetching projects.";
        setState({ status: "error", message });
      });
  }, []);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  return (
    <main className={styles.page}>
      <header className={styles.page__header}>
        <h1 className={styles.page__title}>Projects</h1>
        <p className={styles.page__subtitle}>Open-source and personal projects from GitHub.</p>
      </header>

      <section className={styles.page__content} aria-label="GitHub projects">
        {state.status === "loading" || state.status === "idle" ? (
          <div className={styles.page__loading}>
            <LoadingSpinner label="Loading projects…" />
          </div>
        ) : state.status === "error" ? (
          <Card variant="danger" className={styles.page__error}>
            <p role="alert" className={styles.page__errorText}>
              {state.message}
            </p>
            <Button variant="secondary" onClick={fetchRepos}>
              Try again
            </Button>
          </Card>
        ) : state.data.length === 0 ? (
          <div className={styles.page__empty}>
            <p>No projects found.</p>
          </div>
        ) : (
          <ul className={styles.projectGrid} aria-label="GitHub projects">
            {state.data.map((project) => (
              <li key={project.id}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
