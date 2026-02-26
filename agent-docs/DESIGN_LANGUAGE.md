# Fred's Personal Website - Visual Design Language

This document defines the visual design patterns and component usage guidelines for the
personal website React application.

## Core Principles

1. **Consistency** - Use the same components and patterns throughout the application
2. **Catppuccin Mocha** - All colors come from the Catppuccin Mocha palette exclusively
3. **Mobile-First** - All layouts must be responsive and work on phones, tablets, and desktops
4. **Accessibility** - Minimum 44px touch targets, keyboard navigation, ARIA labels, proper contrast
5. **No Inline Styles** - All styling in SCSS files
6. **No Third-Party CSS** - Custom components only, no Bootstrap/Tailwind/Material-UI
7. **Single Theme** - No theme switcher, no `prefers-color-scheme` detection, always Mocha dark

## Component Hierarchy

### Card Component

The **Card** is the primary layout component for grouping related content.

#### When to Use Cards

- Grouping related information or options
- Displaying repository or project entries
- Creating visual sections within a page
- Any content that needs visual separation from the background

#### Card Variants

```tsx
<Card variant="default">    // Neutral, general content
<Card variant="info">       // Informational content (blue accent)
<Card variant="success">    // Positive/working status (green accent)
<Card variant="warning">    // Cautionary content (yellow accent)
<Card variant="danger">     // Error states (red accent)
```

#### Card Structure

```tsx
<Card
  title="Section Title"
  subtitle="Optional description of what this section contains"
  variant="default"
>
  {/* Card content goes here */}
</Card>
```

#### Card Props

- `title` - Optional header text
- `subtitle` - Optional description below title
- `variant` - Visual style (default, info, success, warning, danger)
- `padded` - Whether content is padded (default: true)
- `hoverable` - Adds hover effect (for clickable cards, e.g., project cards)

#### Example: Project Card

```tsx
<Card hoverable>
  <div className={styles.projectCard}>
    <h3 className={styles.projectCard__name}>{repo.name}</h3>
    <p className={styles.projectCard__description}>{repo.description}</p>
    <div className={styles.projectCard__meta}>
      <span className={styles.projectCard__language}>{repo.language}</span>
      <span className={styles.projectCard__stars}>★ {repo.stars}</span>
    </div>
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.projectCard__link}
    >
      View on GitHub
    </a>
  </div>
</Card>
```

### Button Component

Standard button with multiple variants.

```tsx
<Button variant="primary" onClick={handleClick}>
  Submit
</Button>
```

**Variants:**

- `primary` - Blue (`--color-primary`), main call to action
- `secondary` - Surface-colored, secondary action
- `danger` - Red (`--color-danger`), destructive action
- `ghost` - Transparent background, subtle action

**Props:**

- `variant` - Visual style (default: `"primary"`)
- `disabled` - Whether disabled
- `onClick` - Click handler
- `type` - HTML button type (`"button"` | `"submit"` | `"reset"`, default: `"button"`)
- `children` - Button label / content

#### Example

```tsx
<Button variant="primary" type="submit">
  Unlock
</Button>

<Button variant="ghost" onClick={handleCancel}>
  Cancel
</Button>
```

### Form Components

#### Input Component

Text input with label and optional help/error text.

```tsx
<Input
  id="password"
  label="Password"
  type="password"
  value={value}
  onChange={setValue}
  helpText="Enter the access password"
  error={errorMessage}
  required
/>
```

**Props:**

- `id` - Unique identifier (links label to input)
- `label` - Label text above the input
- `type` - HTML input type (default: `"text"`)
- `value` - Controlled value
- `onChange` - Change handler
- `helpText` - Optional hint text below input
- `error` - Optional error message (shown in red)
- `disabled` - Whether disabled
- `required` - Whether required (adds `*` to label)
- `placeholder` - Placeholder text
- `autoComplete` - HTML autocomplete attribute

### Loading State

Show a loading indicator while async data (e.g., GitHub API) is being fetched.

```tsx
{
  isLoading && <LoadingSpinner label="Loading projects…" />;
}
```

The `LoadingSpinner` component uses CSS animation and respects `prefers-reduced-motion`
(falls back to a simple text indicator).

**Do not** block the whole page — render the spinner inline where the content will appear.

### Error State

Display a user-friendly error when data fetching fails.

```tsx
{
  error && (
    <Card variant="danger">
      <p role="alert">{error}</p>
      <Button variant="secondary" onClick={retry}>
        Try again
      </Button>
    </Card>
  );
}
```

Always provide a retry mechanism for recoverable errors.

### Empty State

Display a helpful message when no content is available.

```tsx
{
  repos.length === 0 && !isLoading && (
    <div className={styles.emptyState}>
      <p>No projects found.</p>
    </div>
  );
}
```

## Icons

The site uses vendored inline SVG icon components. There is no icon library dependency —
just React components that render SVG paths directly. This keeps the bundle small and
removes any runtime icon registry.

### Why Vendored SVGs

Third-party icon packages ship hundreds of icons and a runtime wrapper. We need a small
handful. Vendoring only the paths we use eliminates that overhead with no visual difference.

### Using Icons

Every icon is a named export from `src/components/icons/index.tsx`. Import and use it
directly as a React component:

```tsx
import { IconGitHub, IconExternalLink, IconLock } from "../components/icons";

// Basic usage — aria-hidden by default, scales with font size
<IconGitHub />

// With a className for custom sizing
<IconGitHub className={styles.socialIcon} />
```

### Icon Sizing

The base `.icon` CSS class sets:

- `height: 1em` — scales with surrounding font size
- `vertical-align: -0.125em` — optical baseline alignment
- `display: inline-block`
- `fill: currentColor` — inherits text color automatically

Control icon size through `font-size` on the parent, or by overriding `height` in a
component-specific SCSS class. **Never set size via inline style.**

```scss
// ✅ Correct — control size through a class
.socialLinks__icon {
  height: 1.5em;
}
```

```tsx
// ❌ Wrong
<IconGitHub style={{ height: "24px" }} />
```

### Adding a New Icon

1. Find the icon SVG from a source such as [Heroicons](https://heroicons.com) or
   [Font Awesome Free](https://fontawesome.com) (solid style, CC BY 4.0 license).
2. Extract the `viewBox` and `<path d="...">` data.
3. Add a new export to `src/components/icons/index.tsx` using the `createIcon` factory:

```tsx
/** Description of the icon */
export const IconYourIcon = createIcon("0 0 24 24", "M... SVG path data ...");
```

### Anti-Patterns

❌ **Do not add icon library packages as dependencies**

```tsx
// WRONG
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
<FontAwesomeIcon icon={faStar} />;
```

✅ **Use the vendored component**

```tsx
// CORRECT
import { IconStar } from "../components/icons";
<IconStar />;
```

---

❌ **Do not set icon size inline**

```tsx
<IconStar style={{ height: "24px" }} /> // WRONG
```

✅ **Control size through CSS**

```scss
.myComponent__icon {
  height: 1.25em; // CORRECT
}
```

---

## Layout Patterns

### Page Layout

Every page follows the same structural shell:

```tsx
<main className={styles.page}>
  <header className={styles.page__header}>
    <h1 className={styles.page__title}>Page Title</h1>
    <p className={styles.page__subtitle}>Optional description</p>
  </header>

  <section className={styles.page__content}>{/* Page-specific content */}</section>
</main>
```

The global `<Nav>` and `<Footer>` are rendered outside of page components in `App.tsx`.

### Project Grid Layout

```tsx
<ul className={styles.projectGrid} role="list" aria-label="GitHub projects">
  {repos.map((repo) => (
    <li key={repo.id}>
      <ProjectCard repo={repo} />
    </li>
  ))}
</ul>
```

```scss
.projectGrid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Password Gate Layout

The services page password form should be centered and compact:

```tsx
<div className={styles.passwordGate}>
  <Card variant="default">
    <h2 className={styles.passwordGate__title}>Access Required</h2>
    <form onSubmit={handleSubmit} aria-label="Password form" className={styles.passwordGate__form}>
      <Input
        id="services-password"
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        required
        autoComplete="current-password"
      />
      {error && (
        <p role="alert" className={styles.passwordGate__error}>
          {error}
        </p>
      )}
      <Button type="submit" variant="primary">
        Unlock
      </Button>
    </form>
  </Card>
</div>
```

### Services List Layout

Once unlocked, services are displayed as a simple list of links:

```tsx
<ul className={styles.servicesList} role="list" aria-label="Personal services">
  {services.map((service) => (
    <li key={service.name} className={styles.servicesList__item}>
      <a
        href={service.url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.servicesList__link}
      >
        <IconExternalLink className={styles.servicesList__icon} />
        {service.name}
      </a>
      {service.description && (
        <p className={styles.servicesList__description}>{service.description}</p>
      )}
    </li>
  ))}
</ul>
```

## Spacing System

Use SCSS variables for consistent spacing. Define a base scale:

```scss
// In _variables.scss
$space-xs: 0.25rem; // 4px
$space-sm: 0.5rem; // 8px
$space-md: 1rem; // 16px
$space-lg: 1.5rem; // 24px
$space-xl: 2rem; // 32px
$space-2xl: 3rem; // 48px
```

Use these variables in component SCSS rather than arbitrary values.

## Typography

### Headings

- Page title (`<h1>`): `2rem`, weight 700, color `--color-text`
- Section title (`<h2>`): `1.5rem`, weight 600, color `--color-text`
- Card title (`<h3>`): `1.25rem`, weight 600, color `--color-text`
- Sub-label: `0.875rem`, weight 500, color `--color-subtext1`

### Body Text

- Main content: `1rem` (16px)
- Secondary/help text: `0.875rem` (14px)
- Micro/muted: `0.8125rem` (13px)

### Text Colors

- Primary body copy: `var(--color-text)` — `#cdd6f4`
- Secondary labels: `var(--color-subtext1)` — `#bac2de`
- Muted/disabled: `var(--color-subtext0)` — `#a6adc8`

### Links

```scss
a {
  color: var(--color-primary);
  text-decoration: none;

  &:hover {
    color: var(--color-accent-mauve);
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
    border-radius: 2px;
  }
}
```

External links (`target="_blank"`) should always include:

```tsx
rel = "noopener noreferrer";
```

## Color Usage

All color references use CSS custom properties defined in `_variables.scss`. Never
hardcode hex values in component SCSS.

### Backgrounds

- Page background: `var(--color-base)` — `#1e1e2e`
- Cards/panels: `var(--color-surface0)` — `#313244`
- Elevated surfaces: `var(--color-surface1)` — `#45475a`
- Nav / sidebar: `var(--color-mantle)` — `#181825`
- Footer / deepest: `var(--color-crust)` — `#11111b`

### Borders & Dividers

- Subtle: `var(--color-overlay0)` — `#6c7086`
- Normal: `var(--color-overlay1)` — `#7f849c`
- Prominent: `var(--color-overlay2)` — `#9399b2`

### Interactive / Semantic

- Primary action (links, buttons): `var(--color-primary)` — blue `#89b4fa`
- Hover accent: `var(--color-accent-mauve)` — `#cba6f7`
- Success: `var(--color-success)` — green `#a6e3a1`
- Warning: `var(--color-warning)` — yellow `#f9e2af`
- Danger: `var(--color-danger)` — red `#f38ba8`

## Responsive Design

### Breakpoints

```scss
// Mobile first — base styles for mobile (320px+)
.component {
  // Mobile styles
}

// Tablet and up
@media (min-width: 768px) {
  .component {
    // Tablet styles
  }
}

// Desktop and up
@media (min-width: 1024px) {
  .component {
    // Desktop styles
  }
}
```

### Mobile Adaptations

- **Navigation**: Collapses to hamburger or compact layout at mobile widths
- **Project grid**: Single column on mobile, multi-column on wider screens
- **Cards**: Full-width on mobile, reduced padding
- **Buttons**: Full-width on mobile when in a form or action row
- **Modals / overlays**: Full-screen on mobile (`100vw × 100vh`, no border-radius)
- **Touch targets**: All interactive elements minimum 44×44px

### Test at These Widths

| Width  | Device class       |
| ------ | ------------------ |
| 320px  | Small phone        |
| 375px  | iPhone SE / common |
| 768px  | Tablet (portrait)  |
| 1024px | Tablet (landscape) |
| 1440px | Desktop            |

No horizontal scrolling is acceptable at any of these widths.

## Accessibility

### Focus States

All interactive elements must have visible focus indicators:

```scss
&:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 2px;
}
```

Do not suppress the outline with `outline: none` without providing a visible replacement.

### Touch Targets

Minimum 44×44 pixels for all interactive elements (buttons, links, inputs).

### ARIA Labels

```tsx
// Icon-only buttons must have an accessible label
<button aria-label="Open GitHub profile">
  <IconGitHub />
</button>

// Forms: link inputs to their labels
<label htmlFor="password">Password</label>
<input id="password" type="password" />

// Error messages: use role="alert" for screen-reader announcement
<p role="alert" className={styles.error}>{errorMessage}</p>

// Loading indicators
<div role="status" aria-label="Loading projects…">
  <LoadingSpinner />
</div>
```

### Keyboard Navigation

- All links and buttons reachable and activatable via keyboard
- Password form submittable via Enter
- External links open in new tab with visual indication (`target="_blank"`)
- No keyboard traps outside intentional modal patterns

### External Links

External links must communicate that they open in a new tab:

```tsx
<a href={url} target="_blank" rel="noopener noreferrer" aria-label={`${label} (opens in new tab)`}>
  {label}
  <IconExternalLink aria-hidden="true" />
</a>
```

## Animation Guidelines

### When to Animate

- Modal / overlay entry and exit
- Hover state transitions (subtle)
- Loading spinner

### When NOT to Animate

- Layout shifts
- Content loading in/out
- Critical state changes (error messages should appear immediately)

### Respecting User Preferences

Always respect `prefers-reduced-motion`:

```scss
.loadingSpinner {
  animation: spin 1s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
}
```

Do not tie animation state to a user-configurable setting — the OS/browser preference is
sufficient for this site.

## Anti-Patterns (DO NOT DO)

❌ **Inline styles**

```tsx
<div style={{ padding: "20px" }}>   // WRONG
```

✅ **SCSS class**

```tsx
<div className={styles.section}>    // CORRECT
```

---

❌ **Third-party CSS frameworks**

```tsx
<div className="flex items-center gap-4">  // WRONG (Tailwind)
<div className="container mx-auto">        // WRONG (Bootstrap)
```

✅ **Custom SCSS**

```tsx
<div className={styles.container}>   // CORRECT
```

---

❌ **Arbitrary hex values in SCSS**

```scss
background: #3498db; // WRONG — not from Catppuccin
color: #333333; // WRONG
```

✅ **Catppuccin CSS variables**

```scss
background: var(--color-primary); // CORRECT
color: var(--color-text); // CORRECT
```

---

❌ **Theme switching**

```tsx
// WRONG — there is exactly one theme: Mocha
<button onClick={toggleTheme}>Switch to Light</button>
```

✅ **Single theme, always Mocha**

---

❌ **Missing mobile responsiveness**

```scss
.component {
  width: 800px; // WRONG — breaks on mobile
}
```

✅ **Mobile-first responsive**

```scss
.component {
  width: 100%; // CORRECT
  max-width: 800px;
}
```

---

❌ **External links without `rel`**

```tsx
<a href={url} target="_blank">
  {label}
</a> // WRONG — security issue
```

✅ **Proper external link**

```tsx
<a href={url} target="_blank" rel="noopener noreferrer">
  {label}
</a> // CORRECT
```

## Mobile UX Patterns

### Scrollable Containers

When a container can scroll (e.g., a long services list on a narrow screen):

**Desktop**: Thin scrollbar, show on hover

```scss
.scrollable {
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;

  &:hover {
    scrollbar-color: var(--color-surface2) transparent;
  }
}
```

**Mobile**: Always visible scrollbar

```scss
@media (max-width: 768px) {
  .scrollable {
    scrollbar-width: thin;
    scrollbar-color: var(--color-overlay0) var(--color-surface1);
  }
}
```

### Full-Screen Overlays on Mobile

Password gate and any modal-style UI should use the full viewport on small screens:

```scss
@media (max-width: 768px) {
  .overlay {
    position: fixed;
    inset: 0;
    border-radius: 0;
    padding: 1rem;
  }
}
```

### Button Sizing on Mobile

In form action rows, make all buttons full-width on mobile:

```scss
.formActions {
  display: flex;
  gap: 0.5rem;

  @media (max-width: 768px) {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
}
```

## Summary

The visual design language for this site centers on:

1. **Catppuccin Mocha** — the single, fixed dark color theme
2. **Card-based layout** — for grouping projects, services, and information
3. **Custom form components** — Input, Button (no third-party UI library)
4. **Mobile-first responsive design** — single column → multi-column as viewport grows
5. **Accessibility** — focus states, ARIA labels, keyboard navigation, touch targets
6. **Semantic HTML** — proper use of `<main>`, `<nav>`, `<h1>`–`<h3>`, `role="alert"`, etc.

### Key Principles at a Glance

| Topic          | Rule                                          |
| -------------- | --------------------------------------------- |
| Colors         | Catppuccin Mocha CSS variables only           |
| Theme          | Always Mocha — no switcher, no auto-detect    |
| Styling        | SCSS modules, no inline styles, no frameworks |
| Breakpoints    | Mobile-first: 768px tablet, 1024px desktop    |
| Touch targets  | 44×44px minimum                               |
| External links | Always `rel="noopener noreferrer"`            |
| Accessibility  | `focus-visible`, ARIA labels, `role="alert"`  |
| Icons          | Vendored SVG components only                  |

Use this document when building new components or pages to maintain consistent quality
throughout the site.
