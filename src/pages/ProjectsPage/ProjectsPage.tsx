import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import { IconExternalLink, IconGitHub } from "../../components/icons";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { ProjectCard } from "../../components/ProjectCard/ProjectCard";
import type { GitHubRepo, ProjectData } from "../../types";
import { processRepos } from "../../utils/normalizeRepo";
import styles from "./ProjectsPage.module.scss";

const EXCLUDED_REPOS = new Set([".github", "zabbid"]);

const FREDSYSTEMS_API_URL =
  "https://api.github.com/orgs/fredsystems/repos?sort=updated&per_page=100";

interface FeaturedProject {
  name: string;
  description: string;
  url: string;
  org: string;
  role: string;
}

const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    name: "ACARS Hub",
    description:
      "A full-stack application for receiving, decoding, and visualizing ACARS aircraft messages. Used by hobbyists worldwide as part of the SDR-Enthusiasts Docker ecosystem.",
    url: "https://github.com/sdr-enthusiasts/docker-acarshub",
    org: "sdr-enthusiasts/docker-acarshub",
    role: "Primary contributor",
  },
  {
    name: "SDR-Enthusiasts",
    description:
      "A community organization building and maintaining Docker-based tools for software-defined radio hobbyists. Contributor across multiple repositories.",
    url: "https://github.com/sdr-enthusiasts",
    org: "github.com/sdr-enthusiasts",
    role: "Primary contributor",
  },
];

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

    fetch(FREDSYSTEMS_API_URL)
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

  const visibleProjects = useMemo(
    () => (state.status === "success" ? state.data.filter((p) => !EXCLUDED_REPOS.has(p.name)) : []),
    [state],
  );

  return (
    <main className={styles.page}>
      <header className={styles.page__header}>
        <h1 className={styles.page__title}>Projects</h1>
        <p className={styles.page__subtitle}>
          Open source work, hobby projects, and the things I spend my weekends on.
        </p>
      </header>

      <section className={styles.featured} aria-labelledby="featured-heading">
        <h2 id="featured-heading" className={styles.featured__heading}>
          Featured contributions
        </h2>
        <p className={styles.featured__intro}>
          The work I&apos;m most proud of lives outside my own org — as a primary contributor to
          SDR-Enthusiasts.
        </p>
        <ul className={styles.featured__list}>
          {FEATURED_PROJECTS.map((project) => (
            <li key={project.url}>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.featured__card}
                aria-label={`${project.name} — ${project.description} (opens in new tab)`}
              >
                <div className={styles.featured__cardHeader}>
                  <IconGitHub className={styles.featured__icon} aria-hidden="true" />
                  <span className={styles.featured__name}>{project.name}</span>
                  <span className={styles.featured__role}>{project.role}</span>
                  <IconExternalLink className={styles.featured__externalIcon} aria-hidden="true" />
                </div>
                <p className={styles.featured__description}>{project.description}</p>
                <span className={styles.featured__org}>{project.org}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.page__content} aria-labelledby="fredsystems-heading">
        <h2 id="fredsystems-heading" className={styles.section__heading}>
          FredSystems
        </h2>
        <p className={styles.section__subtitle}>
          My personal GitHub organization — NixOS configs, hobby tools, and experiments.
        </p>

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
          <ul className={styles.projectGrid} aria-label="FredSystems projects">
            {visibleProjects.map((project) => (
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
