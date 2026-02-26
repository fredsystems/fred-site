import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { HomePage } from "../HomePage";

function renderHomePage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );
}

describe("HomePage", () => {
  it("renders the site owner name as a heading", () => {
    renderHomePage();
    expect(screen.getByRole("heading", { level: 1, name: /fred clausen/i })).toBeInTheDocument();
  });

  it("renders a tagline / role description", () => {
    renderHomePage();
    // Use exact match to avoid matching the bio text which also mentions "software engineer"
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
  });

  it("renders the About Me section heading", () => {
    renderHomePage();
    expect(screen.getByRole("heading", { name: /about me/i })).toBeInTheDocument();
  });

  it("renders bio text content", () => {
    renderHomePage();
    // Bio section should contain some descriptive text
    expect(screen.getByText(/open source/i)).toBeInTheDocument();
  });

  it("renders the Find Me Online section heading", () => {
    renderHomePage();
    expect(screen.getByRole("heading", { name: /find me online/i })).toBeInTheDocument();
  });

  it("renders a GitHub profile link", () => {
    renderHomePage();
    expect(screen.getByRole("link", { name: /github profile/i })).toBeInTheDocument();
  });

  it("GitHub link points to the correct URL", () => {
    renderHomePage();
    const link = screen.getByRole("link", { name: /github profile/i });
    expect(link).toHaveAttribute("href", "https://github.com/fredclausen");
  });

  it("GitHub link opens in a new tab", () => {
    renderHomePage();
    const link = screen.getByRole("link", { name: /github profile/i });
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("GitHub link has rel=noopener noreferrer", () => {
    renderHomePage();
    const link = screen.getByRole("link", { name: /github profile/i });
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders a <main> landmark", () => {
    renderHomePage();
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("About Me section has an accessible region label", () => {
    renderHomePage();
    expect(screen.getByRole("region", { name: /about me/i })).toBeInTheDocument();
  });

  it("Find Me Online section has an accessible region label", () => {
    renderHomePage();
    expect(screen.getByRole("region", { name: /find me online/i })).toBeInTheDocument();
  });

  it("renders the GitHub username in the link area", () => {
    renderHomePage();
    expect(screen.getByText("fredclausen")).toBeInTheDocument();
  });
});
