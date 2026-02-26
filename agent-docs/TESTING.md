# Fred's Personal Website - Testing Guide

## Testing Mandate

- ✅ Every new utility function and custom hook requires corresponding tests
- ✅ Every bug fix requires a **regression test** that fails without the fix and passes with it
- ✅ Tests are written alongside code, not deferred until "later"
- ✅ A change that adds untested utility logic is incomplete

## Testing Overview

This is a frontend-only static React application. The test suite covers:

- **Unit tests**: Pure utility functions and custom hooks
- **Component tests**: React component rendering, interaction, and accessibility
- **E2E tests**: Critical user flows via Playwright

There is no backend, no database, and no Socket.IO to mock.

## Test Stack

| Layer      | Tool                           |
| ---------- | ------------------------------ |
| Unit       | Vitest                         |
| Components | Vitest + React Testing Library |
| E2E        | Playwright                     |
| A11y       | Playwright + axe-core          |

## Test Structure

```text
fred-site/
├── src/
│   ├── utils/
│   │   └── __tests__/          # Utility function unit tests
│   ├── hooks/
│   │   └── __tests__/          # Custom hook tests
│   ├── components/
│   │   └── __tests__/          # Component tests
│   └── pages/
│       └── __tests__/          # Page-level component tests
└── e2e/                        # Playwright E2E tests
```

## Running Tests

```bash
# Unit and component tests
npm test

# Unit tests in watch mode
npm run test:watch

# E2E tests (requires built app or dev server running)
npm run test:e2e

# E2E tests headed (visible browser)
npm run test:e2e -- --headed
```

## Coverage Goals

| Area       | Target |
| ---------- | ------ |
| Utilities  | 90%+   |
| Hooks      | 80%+   |
| Components | 70%+   |

## Unit Testing

### Testing Utility Functions

Utility tests are pure: given input, assert output. No React needed.

```typescript
// src/utils/__tests__/formatDate.test.ts
import { describe, expect, it } from "vitest";
import { formatDate } from "../formatDate";

describe("formatDate", () => {
  it("formats a timestamp as a human-readable date", () => {
    const result = formatDate(new Date("2024-01-15T00:00:00Z"));
    expect(result).toBe("January 15, 2024");
  });

  it("returns empty string for null input", () => {
    expect(formatDate(null)).toBe("");
  });
});
```

### Testing Custom Hooks

Use `renderHook` from React Testing Library for hooks that depend on React state.

```typescript
// src/hooks/__tests__/usePasswordGate.test.ts
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { usePasswordGate } from "../usePasswordGate";

describe("usePasswordGate", () => {
  it("starts locked", () => {
    const { result } = renderHook(() => usePasswordGate("secret"));
    expect(result.current.isUnlocked).toBe(false);
  });

  it("unlocks with the correct password", () => {
    const { result } = renderHook(() => usePasswordGate("secret"));
    act(() => {
      result.current.tryPassword("secret");
    });
    expect(result.current.isUnlocked).toBe(true);
  });

  it("stays locked with the wrong password", () => {
    const { result } = renderHook(() => usePasswordGate("secret"));
    act(() => {
      result.current.tryPassword("wrong");
    });
    expect(result.current.isUnlocked).toBe(false);
  });
});
```

## Component Testing

### Basic Render Test

```typescript
// src/components/__tests__/ProjectCard.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectCard } from "../ProjectCard";

const mockProject = {
  name: "fred-site",
  description: "My personal website",
  language: "TypeScript",
  stars: 12,
  url: "https://github.com/fredclausen/fred-site",
};

describe("ProjectCard", () => {
  it("renders the project name", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText("fred-site")).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText("My personal website")).toBeInTheDocument();
  });

  it("renders a link to the GitHub repo", () => {
    render(<ProjectCard project={mockProject} />);
    const link = screen.getByRole("link", { name: /fred-site/i });
    expect(link).toHaveAttribute("href", mockProject.url);
  });
});
```

### Testing User Interaction

```typescript
// src/pages/__tests__/ServicesPage.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ServicesPage } from "../ServicesPage";

// The component reads the password from the env variable
vi.stubEnv("VITE_SERVICES_PASSWORD", "hunter2");

describe("ServicesPage", () => {
  it("shows the password form initially", () => {
    render(<ServicesPage />);
    expect(screen.getByRole("form", { name: /password/i })).toBeInTheDocument();
  });

  it("hides service links until unlocked", () => {
    render(<ServicesPage />);
    expect(screen.queryByRole("link", { name: /tar1090/i })).not.toBeInTheDocument();
  });

  it("reveals services after correct password", async () => {
    const user = userEvent.setup();
    render(<ServicesPage />);

    await user.type(screen.getByLabelText(/password/i), "hunter2");
    await user.click(screen.getByRole("button", { name: /unlock/i }));

    expect(screen.getByRole("link", { name: /tar1090/i })).toBeInTheDocument();
  });

  it("shows an error after incorrect password", async () => {
    const user = userEvent.setup();
    render(<ServicesPage />);

    await user.type(screen.getByLabelText(/password/i), "wrong");
    await user.click(screen.getByRole("button", { name: /unlock/i }));

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /tar1090/i })).not.toBeInTheDocument();
  });
});
```

### Testing Async Data (GitHub API)

Mock `fetch` to avoid network calls in tests.

```typescript
// src/pages/__tests__/ProjectsPage.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectsPage } from "../ProjectsPage";

const mockRepos = [
  {
    id: 1,
    name: "fred-site",
    description: "My personal website",
    language: "TypeScript",
    stargazers_count: 12,
    html_url: "https://github.com/fredclausen/fred-site",
  },
];

describe("ProjectsPage", () => {
  beforeEach(() => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockRepos),
    } as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows a loading state initially", () => {
    render(<ProjectsPage />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders project cards after loading", async () => {
    render(<ProjectsPage />);
    await waitFor(() => {
      expect(screen.getByText("fred-site")).toBeInTheDocument();
    });
  });

  it("shows an error message when the fetch fails", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network error"));
    render(<ProjectsPage />);
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });
});
```

## E2E Testing

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Patterns

```typescript
// e2e/navigation.spec.ts
import { expect, test } from "@playwright/test";

test("home page loads and shows bio content", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("projects page loads and shows repo cards", async ({ page }) => {
  await page.goto("/projects");
  // Wait for async GitHub fetch to resolve
  await expect(page.getByRole("list", { name: /projects/i })).toBeVisible();
});

test("services page shows password gate, not service links", async ({ page }) => {
  await page.goto("/services");
  await expect(page.getByRole("form", { name: /password/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /tar1090/i })).not.toBeVisible();
});

test("services page unlocks after correct password", async ({ page }) => {
  // Password must be set in e2e environment via VITE_SERVICES_PASSWORD
  const password = process.env.VITE_SERVICES_PASSWORD ?? "";
  await page.goto("/services");
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /unlock/i }).click();
  await expect(page.getByRole("link", { name: /tar1090/i })).toBeVisible();
});
```

### Accessibility E2E Tests

```typescript
// e2e/accessibility.spec.ts
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("home page has no accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("projects page has no accessibility violations", async ({ page }) => {
  await page.goto("/projects");
  // Wait for content to load
  await page.waitForLoadState("networkidle");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("services page password form has no accessibility violations", async ({ page }) => {
  await page.goto("/services");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

## Regression Testing

When fixing a bug, write the regression test **before** the fix. The test must fail with the
broken code and pass after the fix.

```typescript
// Example regression test pattern
describe("regression", () => {
  it("password gate does not leak service URLs in the DOM when locked", () => {
    // This test must FAIL before the fix and PASS after
    render(<ServicesPage />);
    // Service URLs must not appear anywhere in the document while locked
    expect(document.body.innerHTML).not.toContain("tar1090");
  });
});
```

## Test Maintenance

### Adding Tests for a New Component

1. Create `__tests__/ComponentName.test.tsx` alongside the component
2. Write a render test first (does it mount without crashing?)
3. Add interaction tests for every user-facing behavior
4. Add an accessibility test if the component has interactive elements

### Adding Tests for a New Utility

1. Create `__tests__/utilName.test.ts` in the same directory
2. Cover the happy path
3. Cover edge cases (empty input, null, unexpected types)
4. Cover error paths (thrown errors, rejected promises)

### Debugging Failing Tests

```bash
# Run a single test file
npm test -- src/utils/__tests__/formatDate.test.ts

# Run tests matching a name pattern
npm test -- --reporter=verbose -t "password gate"

# Run E2E tests with visible browser
npm run test:e2e -- --headed --debug
```

## Best Practices

### Do

- Use `screen` queries from React Testing Library (`getByRole`, `getByText`, etc.)
- Prefer `getByRole` — it mirrors how assistive technologies find elements
- Use `userEvent` instead of `fireEvent` for realistic interaction simulation
- Mock `fetch` at the boundary in component tests, not inside components
- Keep test files colocated with the source they test

### Do Not

- Do not test implementation details (internal state, private methods)
- Do not use `getByTestId` unless no semantic query is possible
- Do not `import` from `@testing-library/react` and `@testing-library/user-event`
  simultaneously without `userEvent.setup()` — always call `setup()` first
- Do not write tests that depend on network requests; always mock `fetch`
- Do not skip writing tests and plan to "add them later"

## Troubleshooting

### Tests Failing Because of Missing `VITE_SERVICES_PASSWORD`

E2E tests that unlock the services page need the env variable set:

```bash
VITE_SERVICES_PASSWORD=yourpassword npm run test:e2e
```

For unit/component tests, use `vi.stubEnv` inside the test to set the variable
without touching the real environment.

### `act(...)` Warnings in Component Tests

Wrap state-updating interactions in `act()` or use `await userEvent.*` (which
handles `act` wrapping internally). Prefer `userEvent` over manual `act` calls.

### Playwright Cannot Find the Dev Server

Make sure the dev server is running on the expected port, or that `webServer` in
`playwright.config.ts` is configured to start it automatically.
