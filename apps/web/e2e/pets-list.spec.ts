import { test, expect } from "@playwright/test";

test.describe("My Pets List", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/s/my/pets");
    });

    test("should display the pets page with title", async ({ page }) => {
        await expect(page.getByRole("heading", { name: "My Pets" })).toBeVisible();
    });

    test("should display pet cards", async ({ page }) => {
        await expect(page.getByRole("heading", { level: 3 }).first()).toBeVisible({
            timeout: 15000,
        });

        const cards = page.getByRole("heading", { level: 3 });
        await expect(cards).not.toHaveCount(0);
    });

    test("should display add pet button", async ({ page }) => {
        await expect(page.getByRole("button", { name: /add a pet/i })).toBeVisible();
    });

    test("should filter pets by search", async ({ page }) => {
        await expect(page.getByRole("heading", { level: 3 }).first()).toBeVisible({
            timeout: 15000,
        });

        const initialCount = await page.getByRole("heading", { level: 3 }).count();

        await page.getByPlaceholder(/search/i).fill("zzzznonexistent");

        await expect(page.getByRole("heading", { level: 3 })).toHaveCount(0, { timeout: 5000 });

        await page.getByPlaceholder(/search/i).clear();

        await expect(page.getByRole("heading", { level: 3 })).toHaveCount(initialCount);
    });

    test("should display filter bar with sort options", async ({ page }) => {
        await expect(page.getByRole("heading", { level: 3 }).first()).toBeVisible({
            timeout: 15000,
        });

        await expect(page.getByRole("button", { name: /sort/i })).toBeVisible();
    });

    test("should navigate to pet details on card click", async ({ page }) => {
        await expect(page.getByRole("heading", { level: 3 }).first()).toBeVisible({
            timeout: 15000,
        });

        await page.getByRole("heading", { level: 3 }).first().click();

        await expect(page).toHaveURL(/\/s\/my\/pets\/[a-f0-9-]+/);
    });
});
