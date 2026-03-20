import { test, expect } from "@playwright/test";

test.describe("Change Password Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/s/my/profile/change-password");
    });

    test("should display change password form", async ({ page }) => {
        await expect(page.getByRole("textbox", { name: "Password", exact: true })).toBeVisible();
        await expect(page.getByRole("textbox", { name: "New Password" })).toBeVisible();
        await expect(page.getByRole("textbox", { name: "Confirm Password" })).toBeVisible();
    });

    test("should show validation errors for empty submit", async ({ page }) => {
        await page.getByRole("button", { name: /update/i }).click();

        const hasError = await page
            .locator("[data-slot='field-error']")
            .or(page.locator("[data-invalid]"))
            .first()
            .isVisible({ timeout: 5000 })
            .catch(() => false);

        expect(hasError).toBeTruthy();
    });

    test("should show error for wrong current password", async ({ page }) => {
        await page.getByRole("textbox", { name: "Password", exact: true }).fill("wrongcurrent");
        await page.getByRole("textbox", { name: "New Password" }).fill("NewPassword123!");
        await page.getByRole("textbox", { name: "Confirm Password" }).fill("NewPassword123!");
        await page.getByRole("button", { name: /update/i }).click();

        const hasError = await page
            .getByRole("alert")
            .or(page.locator("[data-sonner-toast]"))
            .or(page.locator("[data-slot='field-error']"))
            .first()
            .isVisible({ timeout: 10000 })
            .catch(() => false);

        expect(hasError).toBeTruthy();
    });
});
