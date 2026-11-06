import { expect, test } from "@playwright/test";

const series = [
  { slug: "porto-river-night", title: { es: /Oporto/, en: /Porto/ } },
  { slug: "atlantic-stone", title: { es: /Piedra atlántica/, en: /Atlantic stone/ } },
  { slug: "small-encounters", title: { es: /Pequeños encuentros/, en: /Small encounters/ } },
] as const;

for (const locale of ["es", "en"] as const) {
  for (const entry of series) {
    // Regression: the first series carried `prefetch={true}`, which a static
    // export cannot serve, so clicking it did nothing. Every reel must open
    // its own series from the home and from the series index.
    for (const origin of [`/${locale}`, `/${locale}/series`]) {
      test(`${origin} opens ${entry.slug} (${locale})`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(origin);
        const link = page.locator(`a[href="/${locale}/series/${entry.slug}"]`).first();
        await link.scrollIntoViewIfNeeded();
        await link.click();
        await expect(page).toHaveURL(new RegExp(`/${locale}/series/${entry.slug}$`));
        await expect(page.locator("h1")).toContainText(entry.title[locale]);
      });
    }
  }
}

test("home anchors land on their section after the selection switches layout", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const id of ["series", "gallery", "about", "contact"]) {
    await page.goto(`/es#${id}`);
    await expect
      .poll(async () => Math.round((await page.locator(`#${id}`).boundingBox())!.y), { timeout: 6000 })
      .toBeLessThan(120);
    expect((await page.locator(`#${id}`).boundingBox())!.y).toBeGreaterThan(-120);
  }
});

test("returning from an archive-index photograph restores it on the home", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es");
  const link = page.locator('#gallery a[href="/es/photo/21"]');
  await link.scrollIntoViewIfNeeded();
  await link.click();
  await expect(page).toHaveURL(/\/es\/photo\/21$/);
  await page.getByRole("link", { name: /Volver/ }).first().click();
  await expect(page.locator('#gallery a[href="/es/photo/21"]')).toBeInViewport();
});

test("series photographs keep the series order for next and previous", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es/series/porto-river-night");
  const frame = page.locator('a[href*="/photo/19"]').first();
  await frame.scrollIntoViewIfNeeded();
  await frame.click();
  await expect(page).toHaveURL(/\/es\/photo\/19\?series=porto-river-night$/);
  await page.getByRole("link", { name: /Siguiente/ }).first().click();
  await expect(page).toHaveURL(/\/es\/photo\/26\?series=porto-river-night$/);
});
