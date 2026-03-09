import { expect, test } from "@playwright/test";

test("admin login page renders", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Админка Welcome Sudak" })).toBeVisible();
});

test("not found page renders", async ({ page }) => {
  await page.goto("/definitely-not-existing-page");
  await expect(page.getByRole("heading", { name: "Страница не найдена" })).toBeVisible();
});
