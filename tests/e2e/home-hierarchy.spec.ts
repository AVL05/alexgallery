import { expect, test } from "@playwright/test";

for (const locale of ["es", "en"]) {
  for (const width of [320, 1440]) {
    test(`home identifies the author and exposes the archive at ${width}px (${locale})`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`/${locale}`);
      const hero = page.locator("#hero");
      await expect(hero).toContainText("Alex Vicente");
      const archive = hero.getByRole("link", { name: locale === "es" ? "Explorar el archivo" : "Explore the archive" });
      await expect(archive).toBeInViewport({ ratio: 1 });
      const box = await archive.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      const email = page.locator('#contact a[href="mailto:alexviclop@gmail.com"]').first();
      await expect(email).toHaveText("alexviclop@gmail.com");
      await archive.click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/archive$`));
      await expect(page.locator("[data-archive-item]").first()).toBeVisible();
    });
  }
}
