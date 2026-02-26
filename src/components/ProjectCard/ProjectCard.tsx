import type { ProjectData } from "../../types";
import { IconCode, IconExternalLink, IconGitHub, IconStar } from "../icons";
import styles from "./ProjectCard.module.scss";

interface ProjectCardProps {
  project: ProjectData;
}

export function ProjectCard({ project }: ProjectCardProps): React.JSX.Element {
  return (
    <article className={styles.projectCard} aria-label={project.name}>
      <div className={styles.projectCard__header}>
        <h3 className={styles.projectCard__name}>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.projectCard__nameLink}
            aria-label={`${project.name}${project.description ? ` — ${project.description}` : ""} (opens in new tab)`}
          >
            {project.name}
            {project.description && (
              <span className={styles.projectCard__description}>{` — ${project.description}`}</span>
            )}
            <IconExternalLink className={styles.projectCard__externalIcon} aria-hidden="true" />
          </a>
        </h3>
      </div>

      <div className={styles.projectCard__meta}>
        {project.language && (
          <span className={styles.projectCard__language}>
            <IconCode className={styles.projectCard__metaIcon} aria-hidden="true" />
            {project.language}
          </span>
        )}

        <span className={styles.projectCard__stars}>
          <IconStar className={styles.projectCard__metaIcon} aria-hidden="true" />
          <span role="img" aria-label={`${project.stars} stars`}>
            {project.stars}
          </span>
        </span>

        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.projectCard__githubLink}
          aria-label={`View ${project.name} on GitHub (opens in new tab)`}
        >
          <IconGitHub className={styles.projectCard__metaIcon} aria-hidden="true" />
          GitHub
        </a>
      </div>

      {project.topics.length > 0 && (
        <ul className={styles.projectCard__topics} aria-label="Topics">
          {project.topics.slice(0, 5).map((topic) => (
            <li key={topic} className={styles.projectCard__topic}>
              {topic}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
