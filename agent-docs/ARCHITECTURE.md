# Fred's Personal Website - Architecture

## Overview

This is a static single-page application (SPA) built with React and TypeScript, bundled by
Vite, and served by nginx inside a Docker container. There is no backend server, no database,
and no real-time communication layer.

## Technology Stack

| Layer      | Technology                | Notes                                       |
| ---------- | ------------------------- | ------------------------------------------- |
| Framework  | React 19                  | Component-based UI                          |
| Language   | TypeScript (strict)       | No `any`, explicit types throughout         |
| Build tool | Vite                      | Fast dev server, optimized production build |
| Styling    | SCSS modules              | `@use`/`@forward`, no CSS frameworks        |
| Theming    | Catppuccin Mocha          | Single dark theme, no switching             |
| Routing    | React Router v7           | Client-side routing, `BrowserRouter`        |
| Testing    | Vitest + RTL + Playwright | Unit, component, and E2E tests              |
| Deployment | Docker + nginx            | Static file serving only                    |

## Application Structure

### Pages / Routes

| Route       | Component      | Visibility | Description                                      |
| ----------- | -------------- | ---------- | ------------------------------------------------ |
| `/`         | `HomePage`     | Public     | About me, bio, social links                      |
| `/projects` | `ProjectsPage` | Public     | GitHub repositories fetched from public API      |
| `/services` | `ServicesPage` | Hidden     | Password-protected links to self-hosted services |

The `/services` route is **not linked from any public navigation**. It is accessible only to
those who know the URL exists. Once at the route, a password prompt gates the content.

### Directory Structure

```text
fred-site/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Nav/
│   │   ├── Footer/
│   │   └── ...
│   ├── pages/                # Page-level components
│   │   ├── HomePage/
│   │   ├── ProjectsPage/
│   │   └── ServicesPage/
│   ├── hooks/                # Custom React hooks
│   ├── styles/               # Global SCSS
│   │   ├── _variables.scss   # Catppuccin Mocha palette + CSS custom properties
│   │   ├── _reset.scss       # CSS reset / base styles
│   │   ├── _typography.scss  # Font definitions and body text
│   │   └── main.scss         # Root stylesheet — imports all partials
│   ├── types/                # Shared TypeScript interfaces
│   ├── utils/                # Pure utility functions
│   └── main.tsx              # Application entry point
├── public/                   # Static assets (favicon, images)
├── e2e/                      # Playwright end-to-end tests
├── agent-docs/               # Agent reference documentation
├── Dockerfile
├── nginx.conf
├── vite.config.ts
├── tsconfig.json
└── .env.example              # Documents required env vars (no real values)
```

## Routing Architecture

React Router `BrowserRouter` handles all routing client-side.

```text
<BrowserRouter>
  <App>
    <Nav />                    ← Only shows public links (/ and /projects)
    <Routes>
      <Route path="/"          element={<HomePage />} />
      <Route path="/projects"  element={<ProjectsPage />} />
      <Route path="/services"  element={<ServicesPage />} />
      <Route path="*"          element={<NotFoundPage />} />
    </Routes>
    <Footer />
  </App>
</BrowserRouter>
```

nginx is configured to redirect all requests to `index.html` (SPA fallback) so that deep
links and direct navigation to `/services` work correctly.

## Password Protection — Services Page

### Mechanism

The `ServicesPage` component manages an `unlocked` boolean in local component state.

1. User navigates to `/services`
2. If `unlocked === false`, render only the password form
3. User submits the password
4. Compare the entered value against `import.meta.env.VITE_SERVICES_PASSWORD`
5. Match → set `unlocked = true`, render service links
6. No match → show error message, reset input

### Why Client-Side

This is appropriate for the use case: the services are personal tools, not sensitive data.
The protection prevents casual discovery and search-engine indexing. It is not intended as
a cryptographic access-control system.

### Secret Management

The password is **never committed to the repository**.

**Local development** — create `.env.local` (gitignored):

```text
VITE_SERVICES_PASSWORD=your-secret-here
```

**Docker build** — pass as a build argument:

```bash
docker build --build-arg VITE_SERVICES_PASSWORD=your-secret-here -t fred-site .
```

The `Dockerfile` forwards the build argument to Vite:

```dockerfile
ARG VITE_SERVICES_PASSWORD
ENV VITE_SERVICES_PASSWORD=$VITE_SERVICES_PASSWORD
RUN npm run build
```

**`.env.example`** is committed to document which variables exist:

```text
VITE_SERVICES_PASSWORD=changeme
```

### Security Notes

- The compiled JavaScript bundle will contain the password as a plain string, because
  Vite inlines `import.meta.env.*` at build time. This is acceptable for personal use.
- Do not use this mechanism for protecting genuinely sensitive information.
- The route is not indexed by search engines because it is not linked from any public page.

## GitHub Projects Data Flow

The `ProjectsPage` fetches data from the GitHub public REST API at runtime:

```text
Component mounts
  → fetch("https://api.github.com/users/{username}/repos?sort=updated&per_page=100")
  → Parse JSON into typed RepoData[]
  → Render repo cards
  → Handle loading / error states
```

No API key is required for public repository data. GitHub allows 60 unauthenticated requests
per hour per IP, which is more than sufficient for a personal site.

## Styling Architecture

All styles use SCSS modules with the `@use` syntax. Global CSS custom properties (Catppuccin
Mocha) are defined once in `_variables.scss` and applied to `:root` in `main.scss`. Components
reference only CSS variables — never raw hex values.

```text
main.scss
  @use "_reset"
  @use "_variables"     ← Defines :root { --color-base: #1e1e2e; ... }
  @use "_typography"

ComponentName.module.scss
  @use "../../styles/variables" as *
  .container { background: var(--color-surface0); }
```

See `agent-docs/CATPPUCCIN.md` for the full Mocha palette and variable definitions.
See `agent-docs/DESIGN_LANGUAGE.md` for component and layout patterns.

## Deployment Architecture

### Docker

The `Dockerfile` uses a multi-stage build:

**Stage 1 — build**:

```text
node:22-alpine
  COPY package*.json
  RUN npm ci
  ARG VITE_SERVICES_PASSWORD
  ENV VITE_SERVICES_PASSWORD=$VITE_SERVICES_PASSWORD
  COPY src/ public/ vite.config.ts tsconfig.json index.html
  RUN npm run build          → outputs to /app/dist
```

**Stage 2 — serve**:

```text
nginx:alpine
  COPY --from=build /app/dist /usr/share/nginx/html
  COPY nginx.conf /etc/nginx/conf.d/default.conf
  EXPOSE 80
```

### nginx Configuration

nginx serves the static files and handles SPA routing:

- All routes fall back to `index.html` (`try_files $uri $uri/ /index.html`)
- Gzip compression enabled for text assets
- Cache headers set for static assets (CSS, JS, images)
- No reverse proxying — nginx serves files only

### Running Locally

```bash
npm install
cp .env.example .env.local
# Edit .env.local and set VITE_SERVICES_PASSWORD
npm run dev
```

### Building the Docker Image

```bash
docker build \
  --build-arg VITE_SERVICES_PASSWORD=your-secret \
  -t fred-site:latest \
  .

docker run -p 8080:80 fred-site:latest
```

## Testing Architecture

| Layer      | Tool                           | Location           |
| ---------- | ------------------------------ | ------------------ |
| Unit       | Vitest                         | `src/*/__tests__/` |
| Components | Vitest + React Testing Library | `src/*/__tests__/` |
| E2E        | Playwright                     | `e2e/`             |

See `agent-docs/TESTING.md` for patterns and strategies.

## Accessibility

WCAG 2.1 AA compliance is a baseline requirement:

- Colour contrast: 4.5:1 for normal text, 3:1 for large text (Mocha palette satisfies this)
- Touch targets: 44×44px minimum
- Keyboard navigation for all interactive elements
- ARIA labels on icon-only buttons and form elements
- Visible focus indicators on all focusable elements

## Future Considerations

- Additional self-hosted services can be added to the services list in `ServicesPage` without
  architectural changes — just add a new entry to the services array.
- If the project list outgrows the GitHub API response, introduce pagination or filtering
  client-side rather than adding a backend.
