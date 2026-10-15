import { expect, test } from "@playwright/test";

test("series opens through client navigation without missing route payloads", async ({ page }) => {
  const missing: string[] = [];
  page.on("response", (response) => {
    if (response.status() === 404 && response.url().includes("__next.")) missing.push(response.url());
  });
  await page.goto("/es/series");
  await page.locator('a[href="/es/series/porto-river-night"]').first().click();
  await expect(page, missing.join("\n")).toHaveURL(/\/es\/series\/porto-river-night$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Oporto, del río a la noche");
  expect(missing).toEqual([]);
});

for (const width of [390, 820]) {
  test(`archive filters remain available at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/es/archive");
    await page.getByRole("button", { name: "Filtros", exact: true }).click();
    const filters = page.getByRole("dialog", { name: "Filtros", exact: true });
    await expect(filters).toBeVisible();
    await filters.getByRole("button", { name: /Fauna/ }).click();
    await filters.getByRole("button", { name: "Ver 9 resultados" }).click();
    await expect(page).toHaveURL(/category=fauna/);
    await expect(filters).toBeHidden();
  });
}

for (const path of ["/es/work", "/en/work", "/es/archive", "/en/archive"]) {
  test(`skip link reaches the main content on ${path}`, async ({ page }) => {
    await page.goto(path);
    const main = page.locator("#main-content");
    await expect(main).toHaveCount(1);
    const skip = page.locator('a[href="#main-content"]');
    // Streamed SSR nodes exist while their Suspense container is still hidden.
    await expect(skip).toBeVisible();
    await skip.focus();
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(main).toBeFocused();
  });
}

test("contact preserves both drafts and focuses custom validation errors", async ({ page }) => {
  await page.goto("/es#contact");
  await page.locator("#contact-message").fill("Un borrador que debe conservarse.");
  await page.getByRole("button", { name: "Licencias", exact: true }).click();
  await page.locator("#license-description").fill("Un uso editorial que debe conservarse.");
  await page.getByRole("button", { name: "Mensaje", exact: true }).click();
  await expect(page.locator("#contact-message")).toHaveValue("Un borrador que debe conservarse.");
  await page.getByRole("button", { name: "Licencias", exact: true }).click();
  await expect(page.locator("#license-description")).toHaveValue("Un uso editorial que debe conservarse.");
  await page.locator("#license-name").fill("Prueba");
  await page.locator("#license-email").fill("prueba@example");
  await page.locator("#license-photo").fill("21");
  await page.locator("#license-usage").selectOption("editorial");
  await page.getByRole("button", { name: "Preparar solicitud de licencia", exact: true }).click();
  await expect(page.locator("#license-email")).toBeFocused();
});

test("photo licensing carries a localized catalogue reference", async ({ page }) => {
  await page.goto("/en/photo/21");
  await page.getByRole("link", { name: "Request a license", exact: true }).click();
  await expect(page.locator("#license-photo")).toHaveValue("21 — Last stop: night");
});

test("contact prepares a mailto draft without HTTP submission or clearing input", async ({ page }) => {
  await page.goto("/es#contact");
  const submissions: string[] = [];
  page.on("request", request => { if (request.method() === "POST") submissions.push(request.url()); });
  await page.locator("#contact-name").fill("Prueba");
  await page.locator("#contact-email").fill("prueba@example.com");
  await page.locator("#contact-message").fill("Un mensaje que no debe perderse.");
  await page.getByRole("button", { name: "Abrir correo", exact: true }).click();
  const draft = page.getByRole("status").getByRole("link");
  await expect(draft).toHaveAttribute("href", /^mailto:alexviclop@gmail.com\?subject=/);
  const url = new URL((await draft.getAttribute("href"))!);
  expect(url.searchParams.get("body")).toContain("Un mensaje que no debe perderse.");
  await expect(page.locator("#contact-message")).toHaveValue("Un mensaje que no debe perderse.");
  expect(submissions).toEqual([]);
});

test("policy and footer actions reach the promised destinations", async ({ page }) => {
  await page.goto("/es/politica-uso");
  await page.getByRole("link", { name: "Abrir formulario de licencias" }).click();
  await expect(page.locator("#license-photo")).toBeVisible();
  await page.locator('footer nav a[href="/es/archive"]').click();
  await expect(page).toHaveURL(/\/es\/archive$/);
});

test("fullscreen is named, closes with Escape and restores focus", async ({ page }) => {
  await page.goto("/es/photo/21");
  const trigger = page.getByRole("button", { name: "Pantalla completa", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: /Pantalla completa.*Última parada/ });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

for (const width of [320, 390, 820, 1440, 2560]) {
  test(`core pages fit ${width}px with reduced motion`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/es", "/es/archive", "/es/series/porto-river-night", "/en/photo/21", "/en/licencias"]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  });
}

test("forced colors preserves usable navigation and suppresses decorative WebGL", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active" });
  await page.goto("/es");
  await expect(page.getByRole("link", { name: "Explorar el archivo", exact: true })).toBeVisible();
  await expect(page.locator("[data-hero-webgl] canvas")).toHaveCount(0);
});

test("social images are real static assets and titles have one brand", async ({ page, request }) => {
  for (const path of ["/es", "/en", "/es/work", "/en/archive", "/es/series", "/en/licencias"]) {
    await page.goto(path);
    expect((await page.title()).match(/raw\.vives/g)).toHaveLength(1);
    const image = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(image).toBeTruthy();
    const response = await request.get(new URL(image!).pathname);
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toMatch(/^image\//);
  }
});
