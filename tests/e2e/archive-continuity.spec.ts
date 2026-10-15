import { expect, test } from "@playwright/test";

for (const locale of ["es", "en"]) {
  test(`shared photo preserves archive filters without session storage (${locale})`, async ({ page }) => {
    await page.goto(`/${locale}/archive?category=fauna&sort=newest`);
    await expect(page.locator("[data-archive-item] a").first()).toHaveAttribute("href", /category=fauna/);
    const photoHref = await page.locator("[data-archive-item] a").first().getAttribute("href");
    expect(photoHref).toContain("category=fauna");
    await page.goto(photoHref!);
    await expect(page.locator('a[href*="/archive?category=fauna&sort=newest"]').first()).toBeVisible();
    await page.locator('a[href*="/archive?category=fauna&sort=newest"]').first().click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/archive\\?category=fauna&sort=newest`));
    await expect(page.locator("[data-archive-item]")).toHaveCount(9);
  });
}

test("2G connections retain the photographic hero without downloading the decorative model", async ({ page }) => {
  const models: string[] = [];
  page.on("request", request => { if (request.url().endsWith(".glb")) models.push(request.url()); });
  await page.addInitScript(() => Object.defineProperty(navigator, "connection", { value: { effectiveType: "2g", saveData: false }, configurable: true }));
  await page.goto("/es");
  await expect(page.locator("#hero h1")).toBeVisible();
  await page.waitForLoadState("networkidle");
  await expect(page.locator("[data-hero-entry-media] img")).toBeVisible();
  await expect(page.locator("[data-hero-webgl] canvas")).toHaveCount(0);
  expect(models).toEqual([]);
});

for (const mode of ["reduce", "no-preference"] as const) {
test(`archive restores loaded batch, focus and position after photo reload (${mode})`, async ({ page }) => {
  await page.emulateMedia({ reducedMotion: mode });
  await page.goto("/es/archive?page=2&sort=newest");
  await expect(page.locator("[data-archive-item]")).toHaveCount(20);
  const photo = page.locator("[data-archive-item]").nth(14);
  const photoId = await photo.getAttribute("data-photo-id");
  const link = photo.locator("a");
  await link.scrollIntoViewIfNeeded();
  await link.click();
  await expect(page).toHaveURL(/\/es\/photo\//);
  await page.reload();
  const back = page.locator('a[href="/es/archive?page=2&sort=newest#archive"], a[href="/es/archive?sort=newest&page=2#archive"]').first();
  await expect(back).toBeVisible();
  const storedPosition = await page.evaluate(() => JSON.parse(sessionStorage.getItem("raw-vives:archive-context:es")!).scrollY);
  await back.click();
  await expect(page.locator("[data-archive-item]")).toHaveCount(20);
  await expect(page.locator(`#archive-photo-${photoId} a`)).toBeFocused();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(storedPosition - 100);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(storedPosition + 100);
});
}

test("shared series photo returns to its editorial position", async ({ page }) => {
  await page.goto("/en/photo/21?series=porto-river-night");
  const back = page.locator('a[href="/en/series/porto-river-night#series-photo-21"]').first();
  await expect(back).toBeVisible();
  await back.click();
  await expect(page).toHaveURL(/\/en\/series\/porto-river-night#series-photo-21$/);
  await expect(page.locator("#series-photo-21")).toBeInViewport();
});
