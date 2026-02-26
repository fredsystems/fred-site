import { IconExternalLink, IconGitHub } from "../../components/icons";
import styles from "./HomePage.module.scss";

export function HomePage(): React.JSX.Element {
  return (
    <main className={styles.page}>
      <header className={styles.page__header}>
        <h1 className={styles.page__title}>Fred Clausen</h1>
        <p className={styles.page__tagline}>Software Engineer</p>
      </header>

      <section className={styles.bio} aria-labelledby="bio-heading">
        <h2 id="bio-heading" className={styles.bio__heading}>
          About Me
        </h2>
        <div className={styles.bio__content}>
          <p className={styles.bio__text}>
            Hi, I&apos;m Fred — a software engineer passionate about open source, self-hosting, and
            building tools that solve real problems. I work across the full stack with a focus on
            reliability, clean architecture, and making systems that are actually enjoyable to run
            and maintain.
          </p>
          <p className={styles.bio__text}>
            In my spare time I tinker with home automation, ADS-B aircraft tracking, and various
            self-hosted services. Most of my projects live on GitHub.
          </p>
        </div>
      </section>

      <section className={styles.links} aria-labelledby="links-heading">
        <h2 id="links-heading" className={styles.links__heading}>
          Find Me Online
        </h2>
        <ul className={styles.links__list}>
          <li>
            <a
              href="https://github.com/fredclausen"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.links__item}
              aria-label="GitHub profile (opens in new tab)"
            >
              <IconGitHub className={styles.links__icon} aria-hidden="true" />
              <span className={styles.links__label}>GitHub</span>
              <span className={styles.links__sublabel}>fredclausen</span>
              <IconExternalLink className={styles.links__externalIcon} aria-hidden="true" />
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}
