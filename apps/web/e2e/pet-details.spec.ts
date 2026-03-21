import { test, expect } from "@playwright/test";

test.describe("Pet Details", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/s/my/pets");
        await expect(page.getByRole("heading", { level: 3 }).first()).toBeVisible({
            timeout: 15000,
        });
        await page.getByRole("heading", { level: 3 }).first().click();
        await expect(page).toHaveURL(/\/s\/my\/pets\/[a-f0-9-]+/);
    });

    test("should display pet name as heading", async ({ page }) => {
        await expect(page.locator("h1")).toBeVisible({ timeout: 15000 });
        const name = await page.locator("h1").textContent();
        expect(name?.trim().length).toBeGreaterThan(0);
    });

    test("should display back button linking to pets list", async ({ page }) => {
        await expect(page.locator("h1")).toBeVisible({ timeout: 15000 });

        const backButton = page.getByText("My Pets").first();
        await expect(backButton).toBeVisible();
    });

    test("should display edit and save buttons for owner", async ({ page }) => {
        await expect(page.locator("h1")).toBeVisible({ timeout: 15000 });

        await expect(page.getByRole("button", { name: /edit/i })).toBeVisible();
        await expect(page.getByRole("button", { name: /save/i })).toBeVisible();
    });

    test("should display quick info card", async ({ page }) => {
        await expect(page.locator("h1")).toBeVisible({ timeout: 15000 });

        await expect(page.getByRole("heading", { name: "Quick Info" })).toBeVisible();
    });

    test("should display owner card", async ({ page }) => {
        await expect(page.locator("h1")).toBeVisible({ timeout: 15000 });

        await expect(page.getByRole("heading", { name: "Owner" })).toBeVisible();
        await expect(page.getByText("User Account")).toBeVisible();
    });

    test("should navigate back to pets list", async ({ page }) => {
        await expect(page.locator("h1")).toBeVisible({ timeout: 15000 });

        await page.getByText("My Pets").first().click();

        await expect(page).toHaveURL(/\/s\/my\/pets$/);
    });
});
