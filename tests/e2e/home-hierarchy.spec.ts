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

for (const locale of ["es", "en"]) {
  test(`home selection preserves its destination and return label (${locale})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${locale}`);
    const selection = page.locator("#selected-work");
    await expect(selection.locator("article")).toHaveCount(4);
    await selection.scrollIntoViewIfNeeded();
    await selection.locator("article a").first().click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/photo/1$`));
    const back = page.getByRole("link", { name: locale === "es" ? "Volver a la selección" : "Back to selection", exact: true }).first();
    await expect(back).toHaveAttribute("href", `/${locale}#selected-work`);
    await back.click();
    await expect(page.locator("#selected-work")).toBeInViewport();
  });

  test(`home category links open the shared archive filters (${locale})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${locale}`);
    const categories = page.locator("#gallery nav");
    await expect(categories.getByRole("link")).toHaveCount(6);
    await categories.locator('a[href*="category=fauna"]').click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/archive\\?category=fauna$`));
    await expect(page.locator("[data-archive-item]")).toHaveCount(9);
  });
}

test("mobile navigation reaches contact and restores focus on Escape", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es");
  const menu = page.getByRole("button", { name: "Menú", exact: true });
  await menu.click();
  const dialog = page.getByRole("dialog", { name: "Navegación principal" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(menu).toBeFocused();
  await menu.click();
  await dialog.getByRole("link", { name: "Contacto", exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/\/es#contact$/);
  await expect(page.locator("#contact")).toBeInViewport();
});

for (const id of [1, 35, 37]) {
  test(`photo ${id} fits the viewport without changing its aspect ratio`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/es/photo/${id}`);
    const frame = page.locator(`[data-photo-detail-id="${id}"]`);
    await expect(frame).toBeInViewport({ ratio: 1 });
    const { width, height, ratio } = await frame.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const parts = getComputedStyle(element).aspectRatio.split("/").map(Number);
      return { width: rect.width, height: rect.height, ratio: parts[0] / parts[1] };
    });
    expect(Math.abs(width / height - ratio)).toBeLessThan(0.01);
  });
}

test("hero fallback updates the caption, destination and alt together", async ({ page }) => {
  await page.route("**/photos/optimized/*/3.webp", (route) => route.abort());
  await page.goto("/en");
  const hero = page.locator("#hero");
  await expect(hero).toHaveAttribute("data-image-state", "fallback");
  await expect(hero.locator('figure a[href="/en/photo/46"]')).toBeVisible();
  await expect(hero.locator("figcaption")).toContainText("The accordion and the abyss");
  await expect(hero.locator("img")).not.toHaveAttribute("alt", /lightning/i);
});

test("the static archive remains visible when JavaScript is unavailable", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/es");
  await expect(page.locator("#hero h1")).toBeVisible();
  await expect(page.locator("#hero img")).toBeVisible();
  await page.locator('#hero a[href="/es/archive"]').click();
  await expect(page.locator("[data-archive-item]").first()).toBeVisible();
  await context.close();
});

test("enlarged home titles wrap without clipping at 200% text size", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es");
  await page.evaluate(() => document.documentElement.style.fontSize = "200%");
  const lines = await page.locator("[data-hero-title-line]").evaluateAll(elements =>
    elements.map(element => ({ width: element.clientWidth, content: element.scrollWidth })),
  );
  expect(lines).toHaveLength(1);
  for (const line of lines) expect(line.content).toBeLessThanOrEqual(line.width + 1);
});

for (const width of [320, 1440]) {
  for (const motion of ["reduce", "no-preference"] as const) {
    test(`the exhibition preserves complete photographs and keyboard access at ${width}px (${motion})`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: motion });
      await page.goto("/es");
      const first = page.locator('[data-exhibition-photo="1"] a');
      await first.focus();
      for (const id of [1, 35, 37, 49]) {
        const link = page.locator(`[data-exhibition-photo="${id}"] a`);
        await expect(link).toBeFocused();
        await expect(link).toBeInViewport();
        const frame = link.locator("[data-image-state]");
        await expect(frame).toHaveAttribute("data-image-state", "loaded");
        const size = await frame.evaluate(element => {
          const box = element.getBoundingClientRect();
          const image = element.querySelector("img")!;
          return { ratio: box.width / box.height, natural: image.naturalWidth / image.naturalHeight };
        });
        expect(Math.abs(size.ratio - size.natural)).toBeLessThan(0.01);
        if (id !== 49) await page.keyboard.press("Tab");
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
  }
}

test("returning from a photograph restores focus and scroll in the exhibition", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es");
  await page.locator('[data-exhibition-photo="49"] a').click();
  await expect(page).toHaveURL(/\/es\/photo\/49$/);
  await page.getByRole("link", { name: "Volver a la selección", exact: true }).first().click();
  await expect(page.locator('[data-exhibition-photo="49"] a')).toBeInViewport();
  await expect(page.locator('[data-exhibition-photo="49"] a')).toBeFocused();
});

test("cached exhibition images settle at full opacity after reloading", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es");
  const frame = page.locator('[data-exhibition-photo="1"] [data-image-state]');
  await expect(frame).toHaveAttribute("data-image-state", "loaded");
  await page.reload();
  await expect(frame).toHaveAttribute("data-image-state", "loaded");
  await expect(frame.locator("img")).toHaveCSS("opacity", "1");
});
