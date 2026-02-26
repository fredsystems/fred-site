import styles from "./LoadingSpinner.module.scss";

interface LoadingSpinnerProps {
  label?: string;
}

export function LoadingSpinner({ label = "Loading…" }: LoadingSpinnerProps): React.JSX.Element {
  return (
    <output aria-label={label} className={styles.spinner}>
      <span className={styles.spinner__ring} aria-hidden="true" />
      <span className={styles.spinner__label}>{label}</span>
    </output>
  );
}
