import { defineConfig, devices } from "@playwright/test";

const isCI = Boolean(process.env.CI);
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? (isCI ? "http://127.0.0.1:3100" : "http://127.0.0.1:3000");

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer:
    isCI && !process.env.PLAYWRIGHT_BASE_URL
      ? {
          command: "npm run dev",
          env: {
            PORT: "3100",
          },
          url: baseURL,
          reuseExistingServer: false,
          timeout: 120_000,
        }
      : undefined,
});
