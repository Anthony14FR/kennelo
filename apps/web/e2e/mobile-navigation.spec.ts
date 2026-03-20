import { test, expect } from "@playwright/test";

test.describe("Mobile Navigation", () => {
    test("should display bottom navigation on mobile", async ({ page }) => {
        await page.goto("/s/my/pets");

        await expect(page.getByRole("link", { name: "Animals" })).toBeVisible({ timeout: 10000 });
        await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
        await expect(page.getByRole("link", { name: "Messages" })).toBeVisible();
    });

    test("should highlight active nav item", async ({ page }) => {
        await page.goto("/s/my/pets");

        const animalsLink = page.getByRole("link", { name: "Animals" });
        await expect(animalsLink).toBeVisible({ timeout: 10000 });
        await expect(animalsLink).toHaveAttribute("href", /\/s\/my\/pets/);
    });
});
