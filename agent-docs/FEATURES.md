# Fred's Personal Website - Feature Documentation

This document describes the features of the personal website.

## Home / About Page

The landing page of the site. Introduces Fred and provides a brief personal bio.

### Home Page Content

- Name and title/tagline
- Short personal bio / "about me" section
- Links to social profiles (GitHub, etc.)
- Navigation to other sections of the site

### Home Page Design Notes

- Clean, minimal layout centered around the content
- Catppuccin Mocha theming throughout
- Fully responsive (mobile-first)

---

## GitHub Projects Page

Showcases Fred's open-source and personal GitHub projects.

### Projects Page Content

- List or grid of GitHub repositories
- Per-project display includes:
  - Repository name
  - Description
  - Primary language
  - Star count
  - Link to the GitHub repository page

### Data Source

GitHub public REST API (`https://api.github.com/users/{username}/repos`):

- Fetched client-side on page load
- Sorted by most recently updated or most stars
- No API key required for public repos (rate-limited at 60 req/hr unauthenticated)

### Projects Page Design Notes

- Card-based layout
- Responsive grid: single column mobile, multi-column on wider screens
- Loading and error states handled gracefully

---

## Hidden Services Page

A non-advertised route (`/services`) that provides a personal dashboard linking to
self-hosted services running at `fredclausen.com`. Not linked from any public navigation.

### Current Services

| Service | URL                       | Description        |
| ------- | ------------------------- | ------------------ |
| tar1090 | `fredclausen.com/tar1090` | ADS-B aircraft map |

New services can be added to the services list as they come online.

### Password Protection

The route is protected by a client-side password prompt before the service links
are revealed. This is security through obscurity — appropriate for personal services
that are not sensitive but should not be indexed or stumbled upon.

**Mechanism**:

- User navigates to `/services`
- A password entry form is shown before any service links are rendered
- The correct password is stored as a Vite build-time environment variable:
  `VITE_SERVICES_PASSWORD`
- The entered password is compared against this variable client-side
- On success, the services list is shown for the duration of the session
  (stored in component state — clears on page refresh)
- On failure, an error message is shown and the form resets

**Secret Management**:

- `VITE_SERVICES_PASSWORD` is set in a local `.env` file (`.env` is gitignored)
- During Docker builds, the value is passed as a Docker build argument:
  `--build-arg VITE_SERVICES_PASSWORD=<value>`
- The secret is **never committed to the repository**

**`.env.example`** (committed to repo, no real value):

```text
VITE_SERVICES_PASSWORD=changeme
```

### Services Page Design Notes

- The `/services` route is not rendered in any public navigation component
- Password form uses standard accessible form patterns
- Session state (unlocked/locked) lives in React component state only
- No localStorage persistence (intentional — clears on reload)
