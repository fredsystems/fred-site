import { NavLink } from "react-router";
import styles from "./Nav.module.scss";

export function Nav(): React.JSX.Element {
  return (
    <header className={styles.nav}>
      <nav className={styles.nav__inner} aria-label="Main navigation">
        <NavLink to="/" className={styles.nav__logo} aria-label="Fred Clausen — home">
          Fred Clausen
        </NavLink>

        <ul className={styles.nav__links}>
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${styles.nav__link}${isActive ? ` ${styles["nav__link--active"]}` : ""}`
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `${styles.nav__link}${isActive ? ` ${styles["nav__link--active"]}` : ""}`
              }
            >
              Projects
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
