import { useCallback, useState } from "react";

// Why a custom hook: the password gate logic (state, comparison, error messaging)
// is shared between ServicesPage and its tests. Extracting it keeps the page
// component focused on presentation and makes the unlock behaviour independently
// testable with renderHook.

interface UsePasswordGateResult {
  isUnlocked: boolean;
  error: string | null;
  tryPassword: (input: string) => void;
  reset: () => void;
}

/**
 * Manages the locked/unlocked state for the hidden /services page.
 *
 * @param correctPassword - The expected password (from import.meta.env.VITE_SERVICES_PASSWORD).
 *   Accepting it as a parameter rather than reading the env var inside the hook
 *   makes the hook testable without env stubbing in every test file.
 */
export function usePasswordGate(correctPassword: string): UsePasswordGateResult {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tryPassword = useCallback(
    (input: string): void => {
      if (input === correctPassword) {
        setIsUnlocked(true);
        setError(null);
      } else {
        setIsUnlocked(false);
        setError("Incorrect password. Please try again.");
      }
    },
    [correctPassword],
  );

  const reset = useCallback((): void => {
    setIsUnlocked(false);
    setError(null);
  }, []);

  return { isUnlocked, error, tryPassword, reset };
}
