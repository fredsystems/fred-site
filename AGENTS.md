# Fred's Personal Website - AI Agent Guide

## READ THIS DOCUMENT BEFORE MAKING ANY CHANGES

## Overview

This is Fred's personal website — a small, static React application that serves as a personal homepage, links to GitHub projects, and provides a hidden password-protected page linking to personal self-hosted services.

- **Frontend**: React 19 + TypeScript, Catppuccin Mocha theming (single theme, no switching)
- **Styling**: SCSS modules — no CSS frameworks
- **Deployment**: Docker container with nginx serving the static Vite build

## Documentation Structure

**Start here**, then refer to specialized docs:

- **AGENTS.md** (this file) - Coding standards, quality requirements, workflow
- **agent-docs/ARCHITECTURE.md** - System design, routing, deployment architecture
- **agent-docs/DESIGN_LANGUAGE.md** - UI/UX patterns, component usage, accessibility
- **agent-docs/CATPPUCCIN.md** - Mocha color palette reference
- **agent-docs/FEATURES.md** - Feature documentation (pages, password protection)
- **agent-docs/TESTING.md** - Test strategy, patterns, and infrastructure

## Critical Rules

### 🚫 NO SUMMARIES

**Never create summary documents.** Only reference documentation. If you need to document something, create a standards document (like DESIGN_LANGUAGE.md).

Bad:

- "PHASE_X_SUMMARY.md"
- "IMPLEMENTATION_PROGRESS.md"
- "REFACTOR_NOTES.md"

Good:

- "ARCHITECTURE.md" (describes how the system works)
- "TESTING.md" (describes how to test)
- "FEATURES.md" (describes what features exist)

### 📋 Markdown Standards

- Always include language specifier for code blocks (e.g., `bash`, `typescript`, `json`)
- Use headings, not emphasis, for section titles
- No duplicate headings with same content in same document
- Blank lines around headings and code blocks
- GitHub-flavored markdown with strict linting

**Documentation Purpose**:

- Document **WHY**, not **WHAT** (code shows what)
- Document architectural decisions
- Document standards and patterns
- Document complex business logic
- Do NOT document implementation progress

## Code Quality Requirements

### TypeScript Standards

**Strict Mode Always**:

- ✅ No `any` type — use `unknown` with type guards
- ✅ Explicit function return types
- ✅ Explicit parameter types
- ✅ Leverage type inference only when obvious
- ✅ Create interfaces for complex objects
- ✅ Use generics where appropriate

**Example**:

```typescript
// ❌ Bad
function greet(data: any): any {
  return data.name;
}

// ✅ Good
interface PersonData {
  name: string;
  bio: string;
}

function greet(data: PersonData): string {
  return data.name;
}
```

### SCSS/Styling Standards

**Core Principles**:

- 🚫 **NO INLINE STYLES** — All styling in SCSS files
- 🚫 **NO CSS FRAMEWORKS** — No Bootstrap, Tailwind, Material-UI, etc.
- ✅ **Catppuccin Mocha only** — One theme, always dark, no switching
- ✅ **Mobile-first responsive design** — Critical, not optional
- ✅ **SCSS modules** — Use `@use`/`@forward`, not deprecated `@import`

**Catppuccin Colors**:

- Use CSS variables: `var(--color-text)`, `var(--color-primary)`, etc.
- CSS variables are defined once on `:root` using the Mocha palette
- See `agent-docs/CATPPUCCIN.md` for full palette and variable definitions

**Mobile-First Design** (CRITICAL):

- Base styles for mobile (320px+)
- `@media (min-width: 768px)` for tablet
- `@media (min-width: 1024px)` for desktop
- Touch targets minimum 44x44px
- No horizontal scrolling on any screen size
- Test at 320px, 375px, 768px, 1024px, 1920px

**Example**:

```scss
.button {
  // Mobile-first: base styles for small screens
  padding: 0.75rem 1rem;
  font-size: 1rem;

  // Tablet and up
  @media (min-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
}
```

### No Custom Logger Required

This is a frontend-only static site. Use `console` where logging is genuinely needed (e.g., unexpected errors in catch blocks). Do not add a custom logging framework.

## Development Environment

### Node / npm

All packages managed via `package.json`. To add a dependency:

```bash
npm install <package>
```

### Git Commands

Always use `--no-pager` for programmatic git usage:

```bash
git --no-pager diff
git --no-pager log --oneline -10
git --no-pager show HEAD
```

## Code Organization

### File Structure

```text
fred-site/
├── src/
│   ├── components/       # Reusable React components
│   ├── pages/            # Page-level components (Home, Projects, Services)
│   ├── hooks/            # Custom React hooks
│   ├── styles/           # Global SCSS (variables, reset, typography)
│   ├── types/            # TypeScript interfaces
│   └── utils/            # Utility functions
├── public/               # Static assets (favicon, images)
├── agent-docs/           # Agent reference documentation
├── Dockerfile
└── vite.config.ts
```

### Component Patterns

**See `agent-docs/DESIGN_LANGUAGE.md` for**:

- Component usage patterns
- Accessibility guidelines
- Mobile UX patterns
- Spacing, typography, colors

**Example Component**:

```typescript
import type { ReactNode } from "react";
import styles from "./Button.module.scss";

interface ButtonProps {
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  disabled = false,
  onClick,
  children,
}: ButtonProps): React.JSX.Element {
  return (
    <button
      className={`${styles.button} ${styles[`button--${variant}`]}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
```

### State Management

This is a small personal site — avoid over-engineering state. Use React's built-in `useState` and `useContext` for local and shared state. Only introduce an external state library (e.g., Zustand) if there is a clear need.

### Password-Protected Services Route

The hidden `/services` route is protected by a password stored in a build-time environment variable (`VITE_SERVICES_PASSWORD`). This variable is **never committed to the repository** — it lives in `.env.local` (gitignored) or is injected as a Docker build argument.

See `agent-docs/FEATURES.md` and `agent-docs/ARCHITECTURE.md` for full details on the implementation pattern.

## Testing Standards

### Test Types

**Unit Tests** (Vitest):

- `src/utils/__tests__/` — Utility function tests
- `src/hooks/__tests__/` — Custom hook tests

**Component Tests** (Vitest + React Testing Library):

- `src/components/__tests__/` — Component render and interaction tests
- `src/pages/__tests__/` — Page-level component tests

**E2E Tests** (Playwright):

- `e2e/` — Critical user flows, accessibility audits

### Coverage Goals

- Utilities: 90%+
- Components: 70%+

### Testing Mandate

- ✅ Every new utility function requires corresponding tests
- ✅ Every bug fix requires a **regression test** that fails without the fix and passes with it
- ✅ Tests are written alongside code, not deferred

## Accessibility Requirements

**WCAG 2.1 AA Compliance**:

- Color contrast: 4.5:1 for normal text, 3:1 for large text
- Touch targets: Minimum 44x44px
- Keyboard navigation: All interactive elements accessible
- Screen reader support: ARIA labels, roles, landmarks
- Focus management: Visible focus indicators

## Quality Gates

Before committing:

1. ✅ TypeScript compilation passes (`tsc --noEmit`)
2. ✅ Linting passes (Biome or ESLint, whichever is configured)
3. ✅ No `any` types introduced
4. ✅ No inline styles
5. ✅ Mobile responsiveness verified (DevTools at 375px, 768px, 1024px)
6. ✅ Accessibility checked (keyboard nav, color contrast)
7. ✅ Component patterns match DESIGN_LANGUAGE.md
8. ✅ Tests written for new utilities and components
9. ✅ Regression test written if this is a bug fix
10. ✅ `VITE_SERVICES_PASSWORD` is NOT hardcoded anywhere in source

## Agent Workflow

### Before Starting Work

1. Read AGENTS.md (this file)
2. Read DESIGN_LANGUAGE.md for UI patterns
3. Read ARCHITECTURE.md for system understanding
4. Understand current task scope

### During Development

1. Make incremental changes
2. Run quality checks frequently (`tsc --noEmit`, linter)
3. Follow DESIGN_LANGUAGE.md patterns
4. Ensure mobile responsiveness (test at 375px, 768px, 1024px)
5. Document complex logic with WHY, not WHAT
6. Ask clarifying questions if unclear
7. Write tests as you go — do not defer until the end

### Before Completing Work

1. Verify TypeScript compilation (`tsc --noEmit`)
2. Verify no `any` types introduced
3. Verify no inline styles
4. Verify mobile responsiveness
5. Check patterns match DESIGN_LANGUAGE.md
6. Confirm no secrets are hardcoded
7. Run `git --no-pager diff` to review changes
8. Suggest next steps or improvements

### Communication Style

- Be direct and technical
- Explain architectural decisions
- Highlight trade-offs when they exist
- Point out potential issues proactively
- Provide code examples when explaining concepts

## Getting Help

**For specific topics**:

- UI/UX questions → `agent-docs/DESIGN_LANGUAGE.md`
- Color usage → `agent-docs/CATPPUCCIN.md`
- Feature details → `agent-docs/FEATURES.md`
- Testing → `agent-docs/TESTING.md`
- System design → `agent-docs/ARCHITECTURE.md`

## Questions Before Making Changes

1. Does this follow TypeScript strict mode? (no `any`)
2. Is styling in SCSS files? (no inline styles)
3. Is it mobile-first responsive? (test at 320px+)
4. Does it match DESIGN_LANGUAGE.md patterns?
5. Does it use only Catppuccin Mocha colors? (no theme switching)
6. Is `VITE_SERVICES_PASSWORD` free from the source tree?
7. Are tests written for new code?
8. If this is a bug fix, is there a regression test?
9. Is documentation updated (if needed)?
