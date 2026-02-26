import { type FormEvent, useState } from "react";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import { Input } from "../../components/Input/Input";
import { IconExternalLink, IconLock, IconServer } from "../../components/icons";
import { usePasswordGate } from "../../hooks/usePasswordGate";
import type { ServiceLink } from "../../types";
import styles from "./ServicesPage.module.scss";

// Services list — add new entries here as self-hosted services come online.
// URLs are intentionally not linked from any public navigation or sitemap.
const SERVICES: ServiceLink[] = [
  {
    name: "tar1090",
    url: "https://fredclausen.com/tar1090",
    description: "ADS-B aircraft tracking map",
  },
];

export function ServicesPage(): React.JSX.Element {
  const correctPassword = (import.meta.env.VITE_SERVICES_PASSWORD as string) ?? "";
  const { isUnlocked, error, tryPassword } = usePasswordGate(correctPassword);

  const [passwordInput, setPasswordInput] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    tryPassword(passwordInput);
    // Clear the input on every attempt — correct or not — so the value
    // is never visible after submission
    setPasswordInput("");
  };

  if (isUnlocked) {
    return (
      <main className={styles.page}>
        <header className={styles.page__header}>
          <h1 className={styles.page__title}>
            <IconServer className={styles.page__titleIcon} aria-hidden="true" />
            Services
          </h1>
          <p className={styles.page__subtitle}>Personal self-hosted services.</p>
        </header>

        <section className={styles.page__content} aria-labelledby="services-heading">
          <h2 id="services-heading" className={styles.visually_hidden}>
            Available services
          </h2>
          <ul className={styles.servicesList} aria-label="Personal services">
            {SERVICES.map((service) => (
              <li key={service.name} className={styles.servicesList__item}>
                <a
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.servicesList__link}
                  aria-label={`${service.name} — ${service.description} (opens in new tab)`}
                >
                  <span className={styles.servicesList__name}>{service.name}</span>
                  <IconExternalLink className={styles.servicesList__icon} aria-hidden="true" />
                </a>
                {service.description && (
                  <p className={styles.servicesList__description}>{service.description}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.passwordGate}>
        <Card variant="default">
          <div className={styles.passwordGate__inner}>
            <div className={styles.passwordGate__icon} aria-hidden="true">
              <IconLock />
            </div>
            <h1 className={styles.passwordGate__title}>Access Required</h1>
            <p className={styles.passwordGate__description}>This page is password protected.</p>

            <form
              onSubmit={handleSubmit}
              aria-label="Password form"
              className={styles.passwordGate__form}
              noValidate
            >
              <Input
                id="services-password"
                label="Password"
                type="password"
                value={passwordInput}
                onChange={setPasswordInput}
                required
                autoComplete="current-password"
                error={error}
              />

              <div className={styles.passwordGate__actions}>
                <Button type="submit" variant="primary">
                  Unlock
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </main>
  );
}
