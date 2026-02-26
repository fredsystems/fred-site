import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { Nav } from "../Nav";

function renderNav(initialPath = "/") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Nav />
    </MemoryRouter>,
  );
}

describe("Nav", () => {
  it("renders the site logo / brand name", () => {
    renderNav();
    expect(screen.getByText("Fred Clausen")).toBeInTheDocument();
  });

  it("renders the Home navigation link", () => {
    renderNav();
    // Use exact text match to avoid matching the logo aria-label which also contains "home"
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
  });

  it("renders the Projects navigation link", () => {
    renderNav();
    expect(screen.getByRole("link", { name: "Projects" })).toBeInTheDocument();
  });

  it("does NOT render a link to /services — it is a hidden route", () => {
    renderNav();
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href")).filter(Boolean);
    expect(hrefs).not.toContain("/services");
  });

  it("renders a landmark navigation element", () => {
    renderNav();
    expect(screen.getByRole("navigation", { name: /main navigation/i })).toBeInTheDocument();
  });

  it("logo link has an accessible label pointing to home", () => {
    renderNav();
    const logoLink = screen.getByRole("link", {
      name: /fred clausen.*home/i,
    });
    expect(logoLink).toBeInTheDocument();
  });

  it("Home link points to /", () => {
    renderNav();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
  });

  it("Projects link points to /projects", () => {
    renderNav();
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute("href", "/projects");
  });

  it("applies the active class to the Home link when on /", () => {
    renderNav("/");
    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink.className).toContain("nav__link--active");
  });

  it("applies the active class to the Projects link when on /projects", () => {
    renderNav("/projects");
    const projectsLink = screen.getByRole("link", { name: "Projects" });
    expect(projectsLink.className).toContain("nav__link--active");
  });

  it("does not apply the active class to Home link when on /projects", () => {
    renderNav("/projects");
    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink.className).not.toContain("nav__link--active");
  });

  it("renders inside a <header> landmark", () => {
    renderNav();
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });
});
