import { IconExternalLink, IconGitHub, IconNixOS } from "../../components/icons";
import styles from "./HomePage.module.scss";

export function HomePage(): React.JSX.Element {
  return (
    <main className={styles.page}>
      <header className={styles.page__header}>
        <h1 className={styles.page__title}>Fred Clausen</h1>
        <p className={styles.page__tagline}>Open source contributor</p>
      </header>

      <section className={styles.bio} aria-labelledby="bio-heading">
        <h2 id="bio-heading" className={styles.bio__heading}>
          About Me
        </h2>
        <div className={styles.bio__content}>
          <p className={styles.bio__text}>
            Hi, I&apos;m Fred — a passionate hobbyist and self-taught developer who spends too much
            time making computers do interesting things. I&apos;m not a professional software
            engineer, but I care deeply about building things that work well and are enjoyable to
            use and maintain.
          </p>
          <p className={styles.bio__text}>
            My biggest open source project is{" "}
            <a
              href="https://github.com/sdr-enthusiasts/docker-acarshub"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.bio__link}
            >
              ACARS Hub
            </a>
            , a full-stack application for receiving, decoding, and visualizing ACARS aircraft
            messages. I&apos;m a primary contributor to the{" "}
            <a
              href="https://github.com/sdr-enthusiasts"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.bio__link}
            >
              SDR-Enthusiasts
            </a>{" "}
            organization, where a community of hobbyists builds and maintains Docker-based tools for
            software-defined radio.
          </p>
          <p className={styles.bio__text}>
            I&apos;m also deeply passionate about{" "}
            <a
              href="https://nixos.org"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.bio__link}
            >
              NixOS
            </a>{" "}
            and run it on all my machines. My personal organization,{" "}
            <a
              href="https://github.com/fredsystems"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.bio__link}
            >
              FredSystems
            </a>
            , is home to my NixOS configuration and the other projects I&apos;m actively working on.
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
              href="https://github.com/fredsystems"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.links__item}
              aria-label="FredSystems GitHub organization (opens in new tab)"
            >
              <IconGitHub className={styles.links__icon} aria-hidden="true" />
              <span className={styles.links__text}>
                <span className={styles.links__label}>FredSystems</span>
                <span className={styles.links__sublabel}>github.com/fredsystems</span>
              </span>
              <IconExternalLink className={styles.links__externalIcon} aria-hidden="true" />
            </a>
          </li>
          <li>
            <a
              href="https://github.com/sdr-enthusiasts/docker-acarshub"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.links__item}
              aria-label="ACARS Hub project on GitHub (opens in new tab)"
            >
              <IconGitHub className={styles.links__icon} aria-hidden="true" />
              <span className={styles.links__text}>
                <span className={styles.links__label}>ACARS Hub</span>
                <span className={styles.links__sublabel}>sdr-enthusiasts/docker-acarshub</span>
              </span>
              <IconExternalLink className={styles.links__externalIcon} aria-hidden="true" />
            </a>
          </li>
          <li>
            <a
              href="https://github.com/sdr-enthusiasts"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.links__item}
              aria-label="SDR-Enthusiasts GitHub organization (opens in new tab)"
            >
              <IconGitHub className={styles.links__icon} aria-hidden="true" />
              <span className={styles.links__text}>
                <span className={styles.links__label}>SDR-Enthusiasts</span>
                <span className={styles.links__sublabel}>github.com/sdr-enthusiasts</span>
              </span>
              <IconExternalLink className={styles.links__externalIcon} aria-hidden="true" />
            </a>
          </li>
          <li>
            <a
              href="https://github.com/fredsystems/nixos"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.links__item} ${styles["links__item--nixos"]}`}
              aria-label="NixOS configuration on GitHub (opens in new tab)"
            >
              <IconNixOS className={styles.links__icon} aria-hidden="true" />
              <span className={styles.links__text}>
                <span className={styles.links__label}>NixOS Config</span>
                <span className={styles.links__sublabel}>fredsystems/nixos</span>
              </span>
              <IconExternalLink className={styles.links__externalIcon} aria-hidden="true" />
            </a>
          </li>
          <li>
            <a
              href="https://github.com/fredclausen"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.links__item}
              aria-label="Personal GitHub profile (opens in new tab)"
            >
              <IconGitHub className={styles.links__icon} aria-hidden="true" />
              <span className={styles.links__text}>
                <span className={styles.links__label}>GitHub</span>
                <span className={styles.links__sublabel}>fredclausen</span>
              </span>
              <IconExternalLink className={styles.links__externalIcon} aria-hidden="true" />
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}
