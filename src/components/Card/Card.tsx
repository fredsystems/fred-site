import type { ReactNode } from "react";
import styles from "./Card.module.scss";

type CardVariant = "default" | "info" | "success" | "warning" | "danger";

interface CardProps {
  title?: string;
  subtitle?: string;
  variant?: CardVariant;
  padded?: boolean;
  hoverable?: boolean;
  children: ReactNode;
  className?: string;
}

export function Card({
  title,
  subtitle,
  variant = "default",
  padded = true,
  hoverable = false,
  children,
  className,
}: CardProps): React.JSX.Element {
  const classNames = [
    styles.card,
    styles[`card--${variant}`],
    padded ? styles["card--padded"] : "",
    hoverable ? styles["card--hoverable"] : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classNames}>
      {(title || subtitle) && (
        <div className={styles.card__header}>
          {title && <h3 className={styles.card__title}>{title}</h3>}
          {subtitle && <p className={styles.card__subtitle}>{subtitle}</p>}
        </div>
      )}
      <div className={styles.card__body}>{children}</div>
    </div>
  );
}
