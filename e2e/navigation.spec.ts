import { expect, test } from "@playwright/test";

test.describe("Navigation", () => {
  test("home page loads and shows the site owner name", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Fred Clausen");
  });

  test("home page has a main landmark", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("home page shows bio content", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /about me/i })).toBeVisible();
  });

  test("home page shows a GitHub link", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /github profile/i })).toBeVisible();
  });

  test("nav bar is visible on home page", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: /main navigation/i })).toBeVisible();
  });

  test("nav contains a Home link", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /home/i })).toBeVisible();
  });

  test("nav contains a Projects link", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /projects/i })).toBeVisible();
  });

  test("nav does NOT contain a Services link", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: /main navigation/i });
    await expect(nav.getByRole("link", { name: /services/i })).not.toBeVisible();
  });

  test("clicking Projects nav link navigates to /projects", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /projects/i }).click();
    await expect(page).toHaveURL("/projects");
  });

  test("clicking Home nav link navigates to /", async ({ page }) => {
    await page.goto("/projects");
    await page.getByRole("link", { name: /home/i }).click();
    await expect(page).toHaveURL("/");
  });

  test("projects page loads and shows a heading", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.getByRole("heading", { name: /projects/i })).toBeVisible();
  });

  test("projects page shows a loading state or project content", async ({ page }) => {
    await page.goto("/projects");
    // Either the loading spinner or actual project content should be present
    const hasStatus = await page
      .getByRole("status")
      .isVisible()
      .catch(() => false);
    const hasList = await page
      .getByRole("list", { name: /github projects/i })
      .isVisible()
      .catch(() => false);
    expect(hasStatus || hasList).toBe(true);
  });

  test("services page shows password gate, not service links", async ({ page }) => {
    await page.goto("/services");
    await expect(page.getByRole("form", { name: /password/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /tar1090/i })).not.toBeVisible();
  });

  test("services page password form has an unlock button", async ({ page }) => {
    await page.goto("/services");
    await expect(page.getByRole("button", { name: /unlock/i })).toBeVisible();
  });

  test("services page shows error on wrong password", async ({ page }) => {
    await page.goto("/services");
    await page.getByLabel(/password/i).fill("wrongpassword");
    await page.getByRole("button", { name: /unlock/i }).click();
    await expect(page.getByRole("alert")).toBeVisible();
  });

  test("services page unlocks with correct password", async ({ page }) => {
    const password = process.env.VITE_SERVICES_PASSWORD ?? "";
    test.skip(!password, "VITE_SERVICES_PASSWORD not set — skipping unlock test");

    await page.goto("/services");
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole("button", { name: /unlock/i }).click();
    await expect(page.getByRole("link", { name: /tar1090/i })).toBeVisible();
  });

  test("unknown route renders a 404 page", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await expect(page.getByRole("heading", { name: /not found/i })).toBeVisible();
  });

  test("404 page has a link back to home", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await expect(page.getByRole("link", { name: /go back home/i })).toBeVisible();
  });

  test("footer is visible on all public pages", async ({ page }) => {
    for (const path of ["/", "/projects"]) {
      await page.goto(path);
      await expect(page.getByRole("contentinfo")).toBeVisible();
    }
  });

  test("direct navigation to /services works (SPA routing)", async ({ page }) => {
    // A direct URL navigation (not via React Router link) must also work,
    // because nginx is configured to serve index.html for all routes.
    await page.goto("/services");
    await expect(page.getByRole("form", { name: /password/i })).toBeVisible();
  });
});

test.describe("Mobile Navigation", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("nav is visible on mobile", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: /main navigation/i })).toBeVisible();
  });

  test("home page does not overflow horizontally on mobile", async ({ page }) => {
    await page.goto("/");
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
  });

  test("projects page does not overflow horizontally on mobile", async ({ page }) => {
    await page.goto("/projects");
    await page.waitForLoadState("networkidle");
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
  });
});
