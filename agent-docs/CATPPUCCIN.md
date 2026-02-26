# Catppuccin Color Reference

This document provides the complete Catppuccin Mocha color palette used in Fred's personal website.

**Official Reference**: <https://github.com/catppuccin/catppuccin>

## Theme Usage

This project uses **Catppuccin Mocha (Dark) exclusively**. There is no light theme, no theme
switcher, and no auto-detection of system preferences. The color scheme is always Mocha.

## Color Palette

### Mocha

| Color Name  | Hex Code  | Usage                          |
| ----------- | --------- | ------------------------------ |
| `rosewater` | `#f5e0dc` | Highlights, accents            |
| `flamingo`  | `#f2cdcd` | Accents, decorative highlights |
| `pink`      | `#f5c2e7` | Accents, highlights            |
| `mauve`     | `#cba6f7` | Primary purple accent          |
| `red`       | `#f38ba8` | Errors, danger                 |
| `maroon`    | `#eba0ac` | Secondary errors               |
| `peach`     | `#fab387` | Warnings, secondary accents    |
| `yellow`    | `#f9e2af` | Warnings, highlights           |
| `green`     | `#a6e3a1` | Success, positive indicators   |
| `teal`      | `#94e2d5` | Accents, info                  |
| `sky`       | `#89dceb` | Info, accents                  |
| `sapphire`  | `#74c7ec` | Info, links                    |
| `blue`      | `#89b4fa` | Primary actions, links         |
| `lavender`  | `#b4befe` | Accents, highlights            |
| `text`      | `#cdd6f4` | Primary text                   |
| `subtext1`  | `#bac2de` | Secondary text                 |
| `subtext0`  | `#a6adc8` | Tertiary text, muted           |
| `overlay2`  | `#9399b2` | Overlays, borders              |
| `overlay1`  | `#7f849c` | Overlays, borders              |
| `overlay0`  | `#6c7086` | Overlays, borders              |
| `surface2`  | `#585b70` | Surface elements               |
| `surface1`  | `#45475a` | Surface elements               |
| `surface0`  | `#313244` | Surface elements               |
| `base`      | `#1e1e2e` | Primary background             |
| `mantle`    | `#181825` | Secondary background           |
| `crust`     | `#11111b` | Tertiary background            |

## SCSS Variables

Define these in a shared `_variables.scss` partial and `@use` it wherever needed:

```scss
// Mocha palette
$mocha-rosewater: #f5e0dc;
$mocha-flamingo: #f2cdcd;
$mocha-pink: #f5c2e7;
$mocha-mauve: #cba6f7;
$mocha-red: #f38ba8;
$mocha-maroon: #eba0ac;
$mocha-peach: #fab387;
$mocha-yellow: #f9e2af;
$mocha-green: #a6e3a1;
$mocha-teal: #94e2d5;
$mocha-sky: #89dceb;
$mocha-sapphire: #74c7ec;
$mocha-blue: #89b4fa;
$mocha-lavender: #b4befe;
$mocha-text: #cdd6f4;
$mocha-subtext1: #bac2de;
$mocha-subtext0: #a6adc8;
$mocha-overlay2: #9399b2;
$mocha-overlay1: #7f849c;
$mocha-overlay0: #6c7086;
$mocha-surface2: #585b70;
$mocha-surface1: #45475a;
$mocha-surface0: #313244;
$mocha-base: #1e1e2e;
$mocha-mantle: #181825;
$mocha-crust: #11111b;
```

## CSS Custom Properties

Apply all colors once on `:root`. No theme class toggling, no media queries for color scheme.

```scss
@mixin theme-mocha {
  // Backgrounds
  --color-base: #{$mocha-base};
  --color-mantle: #{$mocha-mantle};
  --color-crust: #{$mocha-crust};
  --color-surface0: #{$mocha-surface0};
  --color-surface1: #{$mocha-surface1};
  --color-surface2: #{$mocha-surface2};

  // Text
  --color-text: #{$mocha-text};
  --color-subtext1: #{$mocha-subtext1};
  --color-subtext0: #{$mocha-subtext0};

  // Overlays / borders
  --color-overlay0: #{$mocha-overlay0};
  --color-overlay1: #{$mocha-overlay1};
  --color-overlay2: #{$mocha-overlay2};

  // Semantic
  --color-primary: #{$mocha-blue};
  --color-success: #{$mocha-green};
  --color-warning: #{$mocha-yellow};
  --color-danger: #{$mocha-red};
  --color-info: #{$mocha-sky};

  // Accents
  --color-accent-mauve: #{$mocha-mauve};
  --color-accent-lavender: #{$mocha-lavender};
  --color-accent-teal: #{$mocha-teal};
  --color-accent-pink: #{$mocha-pink};
  --color-accent-peach: #{$mocha-peach};
}
```

In the global stylesheet, apply once:

```scss
:root {
  @include theme-mocha;
}
```

That's it — no `[data-theme]` attribute, no `prefers-color-scheme` media query.

## Recommended Color Usage

### Backgrounds

- **Page background**: `--color-base`
- **Cards / panels**: `--color-surface0`
- **Elevated surfaces**: `--color-surface1`, `--color-surface2`
- **Sidebar / nav**: `--color-mantle`
- **Deepest recesses / footers**: `--color-crust`

### Text

- **Primary body copy**: `--color-text`
- **Secondary labels**: `--color-subtext1`
- **Muted / disabled**: `--color-subtext0`

### Borders & Dividers

- **Subtle**: `--color-overlay0`
- **Normal**: `--color-overlay1`
- **Prominent**: `--color-overlay2`

### Interactive Elements

- **Links, primary buttons**: `--color-primary` (`blue`)
- **Hover accent**: `--color-accent-mauve` (`mauve`)
- **Focus rings**: `--color-primary` or `--color-accent-lavender`

### Semantic

- **Success indicators**: `--color-success`
- **Warnings**: `--color-warning`
- **Errors / danger**: `--color-danger`
- **Informational**: `--color-info`

## Usage Example

```scss
@use "variables" as *;

.card {
  background-color: var(--color-surface0);
  border: 1px solid var(--color-overlay0);
  color: var(--color-text);
}

.link {
  color: var(--color-primary);

  &:hover {
    color: var(--color-accent-mauve);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
}

.badge--success {
  background-color: var(--color-success);
  color: var(--color-base);
}

.badge--danger {
  background-color: var(--color-danger);
  color: var(--color-base);
}
```

## Rules

1. **Every color MUST come from the Catppuccin Mocha palette** — no arbitrary hex values
2. **Use CSS custom properties** — reference `var(--color-*)` in all components
3. **No theme switching** — there is exactly one theme: Mocha
4. **No `prefers-color-scheme` media queries** — do not auto-detect system theme
5. **Semantic naming** — use `--color-primary`, not `--color-blue`
6. **Maintain contrast** — ensure WCAG AA compliance (4.5:1 for normal text, 3:1 for large text)
