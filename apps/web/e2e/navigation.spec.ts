import { test, expect } from "@playwright/test";

test.describe("Desktop Navigation", () => {
    test("should navigate to pets page from nav", async ({ page }) => {
        await page.goto("/");

        await page.getByRole("link", { name: "Animals" }).first().click();

        await expect(page).toHaveURL(/\/s\/my\/pets/);
    });

    test("should open user menu", async ({ page }) => {
        await page.goto("/");
        const avatarButton = page.getByRole("button", { name: /^(UA|U)$/i });
        await expect(avatarButton).toBeVisible({ timeout: 10000 });

        await avatarButton.click();

        await expect(page.getByRole("menuitem", { name: "Settings" })).toBeVisible();
    });

    test("should navigate to settings from user menu", async ({ page }) => {
        await page.goto("/");
        const avatarButton = page.getByRole("button", { name: /^(UA|U)$/i });
        await expect(avatarButton).toBeVisible({ timeout: 10000 });

        await avatarButton.click();
        await page.getByRole("menuitem", { name: "Settings" }).click();

        await expect(page).toHaveURL(/\/s\/my\/profile\/about/);
    });

    test("should navigate between profile settings pages", async ({ page }) => {
        await page.goto("/s/my/profile/about");

        await page.getByRole("link", { name: "Change password" }).click();

        await expect(page).toHaveURL(/\/change-password/);
    });
});
