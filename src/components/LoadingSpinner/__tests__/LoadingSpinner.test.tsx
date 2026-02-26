import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingSpinner } from "../LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders a status role element", () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("uses the default label when none is provided", () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Loading…");
  });

  it("uses a custom label when provided", () => {
    render(<LoadingSpinner label="Loading projects…" />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Loading projects…");
  });

  it("renders the label text visibly", () => {
    render(<LoadingSpinner label="Fetching data" />);
    expect(screen.getByText("Fetching data")).toBeInTheDocument();
  });

  it("renders the animated ring element", () => {
    const { container } = render(<LoadingSpinner />);
    // The ring is a span with aria-hidden so it is decorative only
    const rings = container.querySelectorAll('[aria-hidden="true"]');
    expect(rings.length).toBeGreaterThan(0);
  });
});
