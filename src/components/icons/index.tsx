import type React from "react";
import styles from "./icons.module.scss";

// Vendored inline SVG icon components.
//
// Why vendored: third-party icon packages ship hundreds of icons and a runtime
// registry. We need a small handful of icons. Vendoring only the paths we use
// eliminates that overhead entirely with no visual difference.
//
// Each icon is created with the `createIcon` factory which:
//   - Renders a semantically-neutral <svg> element
//   - Sets aria-hidden="true" by default (icons are decorative alongside text)
//   - Applies the base .icon class (height: 1em, fill: currentColor)
//   - Accepts an optional className for component-level size overrides

interface IconProps {
  className?: string;
  "aria-label"?: string;
  "aria-hidden"?: boolean | "true" | "false";
}

/**
 * Factory that creates a typed React icon component from a viewBox string and
 * an SVG path string. The resulting component inherits text color via
 * `fill: currentColor` and scales with the surrounding font-size.
 */
function createIcon(viewBox: string, pathData: string): React.FC<IconProps> {
  const Icon: React.FC<IconProps> = ({
    className,
    "aria-label": ariaLabel,
    "aria-hidden": ariaHidden = true,
  }: IconProps): React.JSX.Element => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      className={`${styles.icon}${className ? ` ${className}` : ""}`}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      focusable="false"
      role={ariaLabel ? "img" : undefined}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: controlled SVG path data from this file only
      dangerouslySetInnerHTML={{ __html: pathData }}
    />
  );

  return Icon;
}

// ─── Icons ───────────────────────────────────────────────────────────────────
// Source: Heroicons v2 (MIT License) — https://heroicons.com
// Source: Simple Icons (CC0) — https://simpleicons.org

/** GitHub mark (Simple Icons) */
export const IconGitHub = createIcon(
  "0 0 24 24",
  '<path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>',
);

/** External link arrow (Heroicons outline) */
export const IconExternalLink = createIcon(
  "0 0 24 24",
  '<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" style="fill:none;stroke:currentColor;stroke-width:1.5"/>',
);

/** Lock closed (Heroicons solid) */
export const IconLock = createIcon(
  "0 0 24 24",
  '<path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clip-rule="evenodd"/>',
);

/** Star (Heroicons solid) */
export const IconStar = createIcon(
  "0 0 24 24",
  '<path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd"/>',
);

/** Code bracket (Heroicons outline) */
export const IconCode = createIcon(
  "0 0 24 24",
  '<path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" style="fill:none;stroke:currentColor;stroke-width:1.5"/>',
);

/** Home (Heroicons outline) */
export const IconHome = createIcon(
  "0 0 24 24",
  '<path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" style="fill:none;stroke:currentColor;stroke-width:1.5"/>',
);

/** Chevron right (Heroicons solid) */
export const IconChevronRight = createIcon(
  "0 0 24 24",
  '<path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clip-rule="evenodd"/>',
);

/** Wrench / server icon for services (Heroicons solid) */
export const IconServer = createIcon(
  "0 0 24 24",
  '<path d="M4.08 5.227A3 3 0 0 1 6.979 3H17.02a3 3 0 0 1 2.9 2.227l.893 3.573a3.006 3.006 0 0 1-2.283 3.648l-.007.002a3 3 0 0 1-1.023.043A3.0013 3.0013 0 0 1 15 11.25a3 3 0 0 1-3 0 3 3 0 0 1-3 0 3.001 3.001 0 0 1-2.5 1.243 3 3 0 0 1-1.023-.043l-.007-.002a3.006 3.006 0 0 1-2.284-3.648l.893-3.573Z"/><path d="M4.431 9.933c.024.09.05.179.08.267A4.5 4.5 0 0 0 9 13.5a4.48 4.48 0 0 0 3-1.158A4.48 4.48 0 0 0 15 13.5a4.48 4.48 0 0 0 3-1.158A4.5 4.5 0 0 0 22.5 9v6.75a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9c0 .338.034.67.098.99L4.431 9.933Z"/>',
);
