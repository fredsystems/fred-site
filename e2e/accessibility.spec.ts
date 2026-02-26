import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Accessibility audits", () => {
  test("home page has no accessibility violations", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("projects page has no accessibility violations", async ({ page }) => {
    await page.goto("/projects");
    // Wait for the async GitHub fetch to either resolve or show an error
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("services page password gate has no accessibility violations", async ({ page }) => {
    await page.goto("/services");
    await page.waitForLoadState("domcontentloaded");

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("404 not found page has no accessibility violations", async ({ page }) => {
    await page.goto("/this-route-does-not-exist");
    await page.waitForLoadState("domcontentloaded");

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("services page unlocked state has no accessibility violations", async ({ page }) => {
    const password = process.env.VITE_SERVICES_PASSWORD ?? "";
    // Skip this test if no password is configured in the E2E environment
    test.skip(
      password === "",
      "VITE_SERVICES_PASSWORD not set — skipping unlocked services accessibility test",
    );

    await page.goto("/services");
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole("button", { name: /unlock/i }).click();

    // Wait for the services list to appear
    await expect(page.getByRole("list", { name: /personal services/i })).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
