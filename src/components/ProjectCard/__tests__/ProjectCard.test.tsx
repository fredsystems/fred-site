import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ProjectData } from "../../../types";
import { ProjectCard } from "../ProjectCard";

const mockProject: ProjectData = {
  id: 1,
  name: "fred-site",
  description: "My personal website built with React and TypeScript",
  language: "TypeScript",
  stars: 12,
  url: "https://github.com/fredclausen/fred-site",
  topics: ["react", "typescript", "vite"],
  updatedAt: "2024-06-01T00:00:00Z",
};

describe("ProjectCard", () => {
  it("renders the project name", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText("fred-site")).toBeInTheDocument();
  });

  it("renders the project description", () => {
    render(<ProjectCard project={mockProject} />);
    expect(
      screen.getByText("My personal website built with React and TypeScript"),
    ).toBeInTheDocument();
  });

  it("renders the programming language", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders the star count", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByLabelText("12 stars")).toBeInTheDocument();
  });

  it("renders a link to the GitHub repository", () => {
    render(<ProjectCard project={mockProject} />);
    const links = screen.getAllByRole("link");
    const githubLinks = links.filter(
      (link) => link.getAttribute("href") === "https://github.com/fredclausen/fred-site",
    );
    expect(githubLinks.length).toBeGreaterThan(0);
  });

  it("renders external links with rel=noopener noreferrer", () => {
    render(<ProjectCard project={mockProject} />);
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      if (link.getAttribute("target") === "_blank") {
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      }
    });
  });

  it("renders external links that open in a new tab", () => {
    render(<ProjectCard project={mockProject} />);
    const links = screen.getAllByRole("link");
    links.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
    });
  });

  it("renders up to 5 topics", () => {
    const projectWithManyTopics: ProjectData = {
      ...mockProject,
      topics: ["react", "typescript", "vite", "scss", "testing", "extra-topic"],
    };
    render(<ProjectCard project={projectWithManyTopics} />);
    // Only first 5 topics should be rendered
    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("typescript")).toBeInTheDocument();
    expect(screen.getByText("vite")).toBeInTheDocument();
    expect(screen.getByText("scss")).toBeInTheDocument();
    expect(screen.getByText("testing")).toBeInTheDocument();
    expect(screen.queryByText("extra-topic")).not.toBeInTheDocument();
  });

  it("does not render a topics list when there are no topics", () => {
    const projectNoTopics: ProjectData = { ...mockProject, topics: [] };
    render(<ProjectCard project={projectNoTopics} />);
    expect(screen.queryByRole("list", { name: "Topics" })).not.toBeInTheDocument();
  });

  it("does not render description when it is an empty string", () => {
    const projectNoDesc: ProjectData = { ...mockProject, description: "" };
    const { container } = render(<ProjectCard project={projectNoDesc} />);
    expect(container.querySelector("p")).not.toBeInTheDocument();
  });

  it("does not render language badge when language is null", () => {
    const projectNoLang: ProjectData = { ...mockProject, language: null };
    render(<ProjectCard project={projectNoLang} />);
    expect(screen.queryByText("TypeScript")).not.toBeInTheDocument();
  });

  it("renders the article with an accessible label matching the project name", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByRole("article", { name: "fred-site" })).toBeInTheDocument();
  });
});
