import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("renders with type=button by default", () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("renders with the provided type", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("is enabled by default", () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("is disabled when the disabled prop is true", () => {
    render(<Button disabled>Test</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("does not call onClick when disabled", () => {
    // A disabled button cannot be clicked — we verify the disabled state directly
    // rather than attempting a pointer interaction, because the CSS sets
    // pointer-events: none on disabled buttons (which prevents userEvent from
    // reaching the element, matching real-browser behaviour).
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Click me
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    // Verify the handler is not wired to fire on disabled state via direct DOM
    button.click();
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("renders with an aria-label when provided", () => {
    render(<Button aria-label="Close dialog">×</Button>);
    expect(screen.getByRole("button", { name: "Close dialog" })).toBeInTheDocument();
  });

  it("applies the primary variant class by default", () => {
    render(<Button>Primary</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("button--primary");
  });

  it("applies the secondary variant class", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("button--secondary");
  });

  it("applies the danger variant class", () => {
    render(<Button variant="danger">Delete</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("button--danger");
  });

  it("applies the ghost variant class", () => {
    render(<Button variant="ghost">Cancel</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("button--ghost");
  });

  it("applies an additional className when provided", () => {
    render(<Button className="my-custom-class">Test</Button>);
    expect(screen.getByRole("button").className).toContain("my-custom-class");
  });

  it("is keyboard accessible — activatable via Enter", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Submit</Button>);
    screen.getByRole("button").focus();
    await user.keyboard("{Enter}");
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("is keyboard accessible — activatable via Space", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Submit</Button>);
    screen.getByRole("button").focus();
    await user.keyboard(" ");
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
