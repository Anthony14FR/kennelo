import { test, expect } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Login", () => {
    test("should login with valid credentials and redirect to home", async ({ page }) => {
        await page.goto("/s/accounts/login");

        await page.getByPlaceholder("Your email").fill("user@orus.com");
        await page.getByPlaceholder("Your password").fill("user");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 });
    });

    test("should show error with invalid credentials", async ({ page }) => {
        await page.goto("/s/accounts/login");

        await page.getByPlaceholder("Your email").fill("user@orus.com");
        await page.getByPlaceholder("Your password").fill("wrongpassword");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page.getByRole("alert")).toBeVisible({ timeout: 10000 });
    });

    test("should navigate to register page", async ({ page }) => {
        await page.goto("/s/accounts/login");

        await page.getByRole("link", { name: /register/i }).click();

        await expect(page).toHaveURL(/\/register/);
    });
});

test.describe("Register", () => {
    test("should register a new account and redirect to home", async ({ page }) => {
        const uniqueEmail = `test-${Date.now()}@example.com`;

        await page.goto("/s/accounts/register");

        await page.getByPlaceholder("John").fill("Test");
        await page.getByPlaceholder("Doe").fill("User");
        await page.getByPlaceholder("Your email").fill(uniqueEmail);
        await page.getByPlaceholder("Your password").first().fill("Password123!");
        await page.getByPlaceholder("Confirm your password").fill("Password123!");
        await page.getByRole("button", { name: /create account/i }).click();

        await expect(page).not.toHaveURL(/\/register/, { timeout: 15000 });
    });
});

test.describe("Logout", () => {
    test("should logout and redirect away from app", async ({ page }) => {
        await page.goto("/s/accounts/login");
        await page.getByPlaceholder("Your email").fill("user@orus.com");
        await page.getByPlaceholder("Your password").fill("user");
        await page.getByRole("button", { name: "Login" }).click();
        await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 });

        await page.getByRole("button", { name: /^(UA|U)$/i }).click();
        await page.getByRole("menuitem", { name: "Logout" }).click();

        await page.waitForTimeout(2000);
        const url = page.url();
        expect(url).not.toContain("/s/my/");
    });
});
