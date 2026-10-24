import { expect, test, type Page } from "@playwright/test";

// Smoke E2E over the static export: conversion paths, navigation landmarks
// and form contracts in a real browser. No network beyond the local server:
// validation tests stop before any external submit.
async function dismissIntro(page: Page) {
  const skip = page.getByRole("button", { name: /saltar introducción/i });
  try {
    if (await skip.isVisible({ timeout: 3000 })) await skip.click();
  } catch {
    // Intro already settled or absent on this route.
  }
}

test("hero exposes the archive CTA above the fold", async ({ page }) => {
  await page.goto("/es");
  await dismissIntro(page);
  const cta = page.getByRole("link", { name: "Explorar el archivo" });
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute("href", "/es/archive");
  const box = await cta.boundingBox();
  const viewport = page.viewportSize();
  expect(box).not.toBeNull();
  expect(box!.y).toBeLessThan(viewport!.height);
});

test("first visit opens the photographs without a blocking introduction", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
  });
  await page.goto("/es", { waitUntil: "domcontentloaded" });

  const main = page.locator("#main-content");
  await expect(page.locator("#hero")).toBeVisible();
  await expect(page.getByRole("link", { name: "Explorar el archivo", exact: true })).toBeInViewport();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(main).not.toHaveAttribute("inert", "");
  await expect(main).not.toHaveAttribute("aria-hidden", "true");
  await expect(page.locator("html")).not.toHaveAttribute("data-intro-pending", "true");
});

test("photo detail keeps breadcrumbs above the content", async ({ page }) => {
  await page.goto("/es/photo/21");
  const crumbs = page.getByRole("navigation", { name: "Migas de pan" });
  await expect(crumbs).toBeVisible();
  await expect(crumbs.getByRole("link", { name: "Archivo" })).toHaveAttribute(
    "href",
    "/es/archive",
  );
  await expect(
    crumbs.getByRole("link", { name: "Oporto, del río a la noche" }),
  ).toHaveAttribute("href", "/es/series/porto-river-night");
  const current = crumbs.locator('[aria-current="page"]');
  await expect(current).toHaveText("Última parada: la noche");
});

test("series detail links back through breadcrumbs", async ({ page }) => {
  await page.goto("/es/series/porto-river-night");
  const crumbs = page.getByRole("navigation", { name: "Migas de pan" });
  await expect(crumbs).toBeVisible();
  await expect(crumbs.getByRole("link", { name: /secuencias/i })).toHaveAttribute(
    "href",
    "/es/series",
  );
  await expect(crumbs.locator('[aria-current="page"]')).toHaveText(
    "Oporto, del río a la noche",
  );
});

test("licensing page funnels into the license form tab", async ({ page }) => {
  await page.goto("/es/licencias");
  await expect(
    page.getByRole("heading", { name: "Licenciar una fotografía" }),
  ).toBeVisible();
  const cta = page.getByRole("link", { name: "Solicitar licencia" });
  await expect(cta).toHaveAttribute("href", "/es?form=license#contact");
  await cta.click();
  await expect(page).toHaveURL(/\/es\?form=license#contact/);
  await expect(
    page.getByRole("button", { name: "Licencias" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#license-photo")).toBeVisible();
});

test("contact FAQ renders all answers with structured data", async ({ page }) => {
  await page.goto("/es");
  await dismissIntro(page);
  const faq = page.locator("#faq-title");
  await faq.scrollIntoViewIfNeeded();
  const summaries = page.locator("details > summary");
  await expect(summaries).toHaveCount(5);
  await expect(summaries.first()).toBeVisible();
  // hasText does not match script contents (not rendered text), so read
  // textContent directly.
  const structuredData = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((elements) => elements.map((element) => element.textContent ?? ""));
  expect(structuredData.some((json) => json.includes('"@type":"FAQPage"'))).toBe(true);
});

test("license form validates before any external submit", async ({ page }) => {
  await page.goto("/es?form=license#contact");
  let externalSubmit = false;
  page.on("request", (request) => {
    if (request.method() === "POST") externalSubmit = true;
  });
  await page.locator("#license-name").fill("Smoke Test");
  // Native-valid but custom-invalid email: passes the browser check so the
  // app-level validation runs and must stop before any external submit.
  await page.locator("#license-email").fill("smoke@test");
  await page.locator("#license-photo").fill("21");
  await page.locator("#license-usage").selectOption("editorial");
  await page.locator("#license-description").fill("Prueba de validación del formulario.");
  await page.getByRole("button", { name: "Preparar solicitud de licencia" }).click();
  await expect(page.locator("#license-email-error")).toBeVisible();
  expect(externalSubmit).toBe(false);
});
