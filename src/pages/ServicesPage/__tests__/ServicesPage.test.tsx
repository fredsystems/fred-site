import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ServicesPage } from "../ServicesPage";

vi.stubEnv("VITE_SERVICES_PASSWORD", "hunter2");

// Helper: query only the password <input> element, not the form's aria-label
function getPasswordInput() {
  return screen.getByLabelText(/password/i, { selector: "input" });
}

describe("ServicesPage", () => {
  describe("locked state", () => {
    it("shows the password form initially", () => {
      render(<ServicesPage />);
      expect(screen.getByRole("form", { name: /password/i })).toBeInTheDocument();
    });

    it("renders a password input", () => {
      render(<ServicesPage />);
      expect(getPasswordInput()).toBeInTheDocument();
    });

    it("renders an unlock button", () => {
      render(<ServicesPage />);
      expect(screen.getByRole("button", { name: /unlock/i })).toBeInTheDocument();
    });

    it("does not show service links when locked", () => {
      render(<ServicesPage />);
      expect(screen.queryByRole("link", { name: /tar1090/i })).not.toBeInTheDocument();
    });

    it("does not leak service URLs in the DOM when locked", () => {
      render(<ServicesPage />);
      expect(document.body.innerHTML).not.toContain("tar1090");
    });

    it("shows an error message after an incorrect password attempt", async () => {
      const user = userEvent.setup();
      render(<ServicesPage />);

      await user.type(getPasswordInput(), "wrongpassword");
      await user.click(screen.getByRole("button", { name: /unlock/i }));

      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("clears the password input after a failed attempt", async () => {
      const user = userEvent.setup();
      render(<ServicesPage />);

      await user.type(getPasswordInput(), "wrongpassword");
      await user.click(screen.getByRole("button", { name: /unlock/i }));

      expect(getPasswordInput()).toHaveValue("");
    });

    it("stays locked after an incorrect password", async () => {
      const user = userEvent.setup();
      render(<ServicesPage />);

      await user.type(getPasswordInput(), "wrong");
      await user.click(screen.getByRole("button", { name: /unlock/i }));

      expect(screen.getByRole("form", { name: /password/i })).toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /tar1090/i })).not.toBeInTheDocument();
    });

    it("allows submitting the form via the Enter key", async () => {
      const user = userEvent.setup();
      render(<ServicesPage />);

      await user.type(getPasswordInput(), "wrong{Enter}");

      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  describe("unlocked state", () => {
    async function unlockPage() {
      const user = userEvent.setup();
      render(<ServicesPage />);
      await user.type(getPasswordInput(), "hunter2");
      await user.click(screen.getByRole("button", { name: /unlock/i }));
      return user;
    }

    it("reveals service links after the correct password", async () => {
      await unlockPage();
      expect(screen.getByRole("link", { name: /tar1090/i })).toBeInTheDocument();
    });

    it("hides the password form after unlocking", async () => {
      await unlockPage();
      expect(screen.queryByRole("form", { name: /password/i })).not.toBeInTheDocument();
    });

    it("clears the password input after unlocking", async () => {
      await unlockPage();
      // The input should not be present at all in the unlocked state
      expect(screen.queryByLabelText(/password/i, { selector: "input" })).not.toBeInTheDocument();
    });

    it("renders service links that open in a new tab", async () => {
      await unlockPage();
      const link = screen.getByRole("link", { name: /tar1090/i });
      expect(link).toHaveAttribute("target", "_blank");
    });

    it("renders service links with rel=noopener noreferrer", async () => {
      await unlockPage();
      const link = screen.getByRole("link", { name: /tar1090/i });
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("does not show an error message in the unlocked state", async () => {
      await unlockPage();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("renders the services list landmark", async () => {
      await unlockPage();
      expect(screen.getByRole("list", { name: /personal services/i })).toBeInTheDocument();
    });
  });

  describe("regression", () => {
    it("service URLs are not present in the DOM while locked", () => {
      render(<ServicesPage />);
      // The service URL must not appear anywhere in the document while locked.
      // This guards against accidentally rendering unlocked content off-screen.
      expect(document.body.innerHTML).not.toContain("fredclausen.com/tar1090");
    });

    it("shows no error message on initial render before any submission", () => {
      render(<ServicesPage />);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });
});
