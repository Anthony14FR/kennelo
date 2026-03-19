import { test, expect } from "@playwright/test";

test.describe("Profile About Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/s/my/profile/about");
        await expect(page.getByRole("textbox", { name: "First Name" })).toHaveValue(/.+/, {
            timeout: 15000,
        });
    });

    test("should display user full name", async ({ page }) => {
        await expect(page.getByText("User Account")).toBeVisible();
    });

    test("should display member since info", async ({ page }) => {
        await expect(page.getByText(/Member since/)).toBeVisible();
    });

    test("should display personal information section", async ({ page }) => {
        await expect(page.getByRole("heading", { name: /personal informations/i })).toBeVisible();
    });

    test("should display account email section", async ({ page }) => {
        await expect(page.getByRole("heading", { name: /account email/i })).toBeVisible();
    });

    test("should display danger zone section", async ({ page }) => {
        await expect(page.getByRole("heading", { name: /danger zone/i })).toBeVisible();
    });

    test("should update profile name", async ({ page }) => {
        const firstNameInput = page.getByPlaceholder("John");
        await firstNameInput.clear();
        await firstNameInput.fill("User");

        const lastNameInput = page.getByPlaceholder("Doe");
        await lastNameInput.clear();
        await lastNameInput.fill("Account");

        await page
            .getByRole("button", { name: /update/i })
            .first()
            .click();

        await expect(page.getByText("User Account")).toBeVisible({ timeout: 10000 });
    });

    test("should show email form with current email prefilled", async ({ page }) => {
        const emailInput = page.getByRole("textbox", { name: "Email" });
        await expect(emailInput).toHaveValue("user@orus.com", { timeout: 10000 });
    });
});
