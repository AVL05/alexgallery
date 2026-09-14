import { defineConfig, devices } from "@playwright/test";

// Smoke E2E against the static export in out/. Requires `pnpm build` first;
// the webServer below serves out/ without extra dependencies.
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://127.0.0.1:8789",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "pnpm exec tsx scripts/serve-out.ts",
        port: 8789,
        reuseExistingServer: !process.env.CI,
      },
});
