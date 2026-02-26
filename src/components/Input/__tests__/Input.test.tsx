import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Input } from "../Input";

describe("Input", () => {
  it("renders a labeled input", () => {
    render(<Input id="name" label="Full Name" value="" onChange={() => {}} />);
    expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
  });

  it("renders the label text", () => {
    render(<Input id="name" label="Full Name" value="" onChange={() => {}} />);
    expect(screen.getByText("Full Name")).toBeInTheDocument();
  });

  it("renders with type=text by default", () => {
    render(<Input id="name" label="Name" value="" onChange={() => {}} />);
    expect(screen.getByLabelText("Name")).toHaveAttribute("type", "text");
  });

  it("renders with a custom type", () => {
    render(<Input id="pw" label="Password" type="password" value="" onChange={() => {}} />);
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  });

  it("renders with the provided value", () => {
    render(<Input id="name" label="Name" value="Fred" onChange={() => {}} />);
    expect(screen.getByLabelText("Name")).toHaveValue("Fred");
  });

  it("calls onChange with the new value when the user types", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input id="name" label="Name" value="" onChange={handleChange} />);

    await user.type(screen.getByLabelText("Name"), "F");
    expect(handleChange).toHaveBeenCalledWith("F");
  });

  it("is enabled by default", () => {
    render(<Input id="name" label="Name" value="" onChange={() => {}} />);
    expect(screen.getByLabelText("Name")).not.toBeDisabled();
  });

  it("is disabled when the disabled prop is true", () => {
    render(<Input id="name" label="Name" value="" onChange={() => {}} disabled />);
    expect(screen.getByLabelText("Name")).toBeDisabled();
  });

  it("renders a required indicator when required=true", () => {
    render(<Input id="name" label="Name" value="" onChange={() => {}} required />);
    // The label contains an aria-hidden asterisk which interferes with getByLabelText.
    // Query by role instead, then verify the required attribute is set.
    expect(screen.getByRole("textbox", { name: /name/i })).toHaveAttribute("required");
  });

  it("renders help text when provided", () => {
    render(
      <Input id="name" label="Name" value="" onChange={() => {}} helpText="Enter your full name" />,
    );
    expect(screen.getByText("Enter your full name")).toBeInTheDocument();
  });

  it("does not render help text when not provided", () => {
    render(<Input id="name" label="Name" value="" onChange={() => {}} />);
    // No extra descriptive text should appear
    expect(screen.queryByText("Enter your full name")).not.toBeInTheDocument();
  });

  it("renders an error message with role=alert when error is provided", () => {
    render(<Input id="name" label="Name" value="" onChange={() => {}} error="Name is required" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Name is required");
  });

  it("does not render an alert when there is no error", () => {
    render(<Input id="name" label="Name" value="" onChange={() => {}} />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("does not render help text when an error is present — error takes priority", () => {
    render(
      <Input
        id="name"
        label="Name"
        value=""
        onChange={() => {}}
        helpText="Some help"
        error="Something went wrong"
      />,
    );
    expect(screen.queryByText("Some help")).not.toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong");
  });

  it("sets aria-invalid=true when an error is present", () => {
    render(<Input id="name" label="Name" value="" onChange={() => {}} error="Required" />);
    expect(screen.getByLabelText("Name")).toHaveAttribute("aria-invalid", "true");
  });

  it("does not set aria-invalid when there is no error", () => {
    render(<Input id="name" label="Name" value="" onChange={() => {}} />);
    expect(screen.getByLabelText("Name")).not.toHaveAttribute("aria-invalid");
  });

  it("renders with a placeholder when provided", () => {
    render(
      <Input id="name" label="Name" value="" onChange={() => {}} placeholder="e.g. Jane Doe" />,
    );
    expect(screen.getByPlaceholderText("e.g. Jane Doe")).toBeInTheDocument();
  });

  it("associates the input with its help text via aria-describedby", () => {
    render(
      <Input id="name" label="Name" value="" onChange={() => {}} helpText="Your full legal name" />,
    );
    const input = screen.getByLabelText("Name");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    const helpElement = document.getElementById(describedBy ?? "");
    expect(helpElement).toHaveTextContent("Your full legal name");
  });

  it("associates the input with its error message via aria-describedby", () => {
    render(<Input id="name" label="Name" value="" onChange={() => {}} error="Invalid input" />);
    const input = screen.getByLabelText("Name");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    const errorElement = document.getElementById(describedBy ?? "");
    expect(errorElement).toHaveTextContent("Invalid input");
  });
});
