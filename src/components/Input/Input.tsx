import styles from "./Input.module.scss";

type InputType = "text" | "password" | "email" | "search" | "url" | "tel";

interface InputProps {
  id: string;
  label: string;
  type?: InputType;
  value: string;
  onChange: (value: string) => void;
  helpText?: string;
  error?: string | null;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}

export function Input({
  id,
  label,
  type = "text",
  value,
  onChange,
  helpText,
  error,
  disabled = false,
  required = false,
  placeholder,
  autoComplete,
}: InputProps): React.JSX.Element {
  const helpId = helpText ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.field__label}>
        {label}
        {required && (
          <span className={styles.field__required} aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        className={`${styles.field__input}${error ? ` ${styles["field__input--error"]}` : ""}`}
      />

      {helpText && !error && (
        <p id={helpId} className={styles.field__help}>
          {helpText}
        </p>
      )}

      {error && (
        <p id={errorId} role="alert" className={styles.field__error}>
          {error}
        </p>
      )}
    </div>
  );
}
