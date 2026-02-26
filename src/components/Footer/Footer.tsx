import { IconGitHub } from "../icons";
import styles from "./Footer.module.scss";

export function Footer(): React.JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__inner}>
        <p className={styles.footer__copy}>&copy; {currentYear} Fred Clausen</p>

        <nav className={styles.footer__nav} aria-label="Footer navigation">
          <a
            href="https://github.com/fredclausen"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footer__link}
            aria-label="GitHub profile (opens in new tab)"
          >
            <IconGitHub aria-hidden="true" />
            <span>GitHub</span>
          </a>
        </nav>
      </div>
    </footer>
  );
}
