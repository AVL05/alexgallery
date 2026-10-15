import { expect, test } from "@playwright/test";

for (const locale of ["es", "en"]) {
  test(`license draft includes localized photo and usage without sending (${locale})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${locale}?form=license&photo=21#contact`);
    await expect(page.locator("#license-photo")).toHaveValue(/^21 — /);
    const requests: string[] = [];
    page.on("request", request => { if (request.method() === "POST") requests.push(request.url()); });
    await page.locator("#license-name").fill("Alex & Studio");
    await page.locator("#license-email").fill("test@example.com");
    await page.locator("#license-company").fill("Editorial");
    await page.locator("#license-usage").selectOption("editorial");
    await page.locator("#license-description").fill("Portada & interior: una fotografía.");
    await page.locator('form:not([hidden]) button[type="submit"]').click();
    const draft = page.getByRole("status").getByRole("link");
    await expect(draft).toHaveAttribute("href", /^mailto:alexviclop@gmail.com\?subject=/);
    const url = new URL((await draft.getAttribute("href"))!);
    expect(url.searchParams.get("body")).toContain("21 — ");
    expect(url.searchParams.get("body")).toContain("Editorial");
    expect(url.searchParams.get("body")).toContain("Portada & interior: una fotografía.");
    await expect(page.locator("#license-description")).toHaveValue("Portada & interior: una fotografía.");
    expect(requests).toEqual([]);
  });
}
