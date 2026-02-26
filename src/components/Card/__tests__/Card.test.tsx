import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "../Card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("renders a title when provided", () => {
    render(<Card title="My Title">Content</Card>);
    expect(screen.getByText("My Title")).toBeInTheDocument();
  });

  it("renders a subtitle when provided", () => {
    render(
      <Card title="Title" subtitle="My subtitle">
        Content
      </Card>,
    );
    expect(screen.getByText("My subtitle")).toBeInTheDocument();
  });

  it("does not render a header when neither title nor subtitle is provided", () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.querySelector(".card__header")).not.toBeInTheDocument();
  });

  it("applies the default variant class", () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("card--default");
  });

  it("applies the info variant class", () => {
    const { container } = render(<Card variant="info">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("card--info");
  });

  it("applies the success variant class", () => {
    const { container } = render(<Card variant="success">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("card--success");
  });

  it("applies the warning variant class", () => {
    const { container } = render(<Card variant="warning">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("card--warning");
  });

  it("applies the danger variant class", () => {
    const { container } = render(<Card variant="danger">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("card--danger");
  });

  it("applies the padded modifier by default", () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("card--padded");
  });

  it("does not apply the padded modifier when padded=false", () => {
    const { container } = render(<Card padded={false}>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).not.toContain("card--padded");
  });

  it("applies the hoverable modifier when hoverable=true", () => {
    const { container } = render(<Card hoverable>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("card--hoverable");
  });

  it("does not apply the hoverable modifier by default", () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).not.toContain("card--hoverable");
  });

  it("applies an additional className when provided", () => {
    const { container } = render(<Card className="extra-class">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("extra-class");
  });

  it("renders title as an h3 element", () => {
    render(<Card title="Section">Content</Card>);
    expect(screen.getByRole("heading", { level: 3, name: "Section" })).toBeInTheDocument();
  });
});
