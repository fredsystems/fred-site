import { Link } from "react-router";
import styles from "./NotFoundPage.module.scss";

export function NotFoundPage(): React.JSX.Element {
  return (
    <main className={styles.page}>
      <div className={styles.page__content}>
        <p className={styles.page__code} aria-hidden="true">
          404
        </p>
        <h1 className={styles.page__title}>Page Not Found</h1>
        <p className={styles.page__description}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link to="/" className={styles.page__homeLink}>
          Go back home
        </Link>
      </div>
    </main>
  );
}
