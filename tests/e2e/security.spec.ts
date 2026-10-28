import { expect, test } from "@playwright/test";

test("locale redirect carries its own security headers", async ({ request }) => {
  const response = await request.get("/", { maxRedirects: 0, headers: { "Accept-Language": "es" } });
  expect(response.status()).toBe(307);
  expect(response.headers()["location"]).toMatch(/\/es$/);
  expect(response.headers()["content-security-policy"]).toContain("default-src 'none'");
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
});

for (const path of ["/es", "/en/archive", "/es/photo/1", "/en/series/porto-river-night"]) {
  test(`static CSP allows hydration and blocks unapproved inline scripts on ${path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('head > meta[http-equiv="Content-Security-Policy"]')).toHaveAttribute("content", /script-src 'self' 'sha256-/);
    const injected = await page.evaluate(() => {
      const script = document.createElement("script");
      script.textContent = 'document.documentElement.dataset.injected = "yes"';
      document.body.append(script);
      return document.documentElement.dataset.injected;
    });
    expect(injected).toBeUndefined();
    expect(errors).toEqual([]);
    if (path === "/es") {
      await page.getByRole("link", { name: "Explorar el archivo", exact: true }).click();
      await expect(page.locator("[data-archive-item]").first()).toBeVisible();
    }
  });
}
