import type { ReactNode } from "react";
import styles from "./Button.module.scss";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonType = "button" | "submit" | "reset";

interface ButtonProps {
  variant?: ButtonVariant;
  type?: ButtonType;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}

export function Button({
  variant = "primary",
  type = "button",
  disabled = false,
  onClick,
  children,
  className,
  "aria-label": ariaLabel,
}: ButtonProps): React.JSX.Element {
  const classNames = [styles.button, styles[`button--${variant}`], className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classNames}
      disabled={disabled}
      onClick={onClick}
      type={type}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
