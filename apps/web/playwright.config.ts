import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 1,
    workers: process.env.CI ? 1 : 4,
    timeout: 30000,
    reporter: "html",
    use: {
        baseURL: "http://localhost:3000/en",
        trace: "on-first-retry",
        screenshot: "only-on-failure",
    },
    projects: [
        {
            name: "setup",
            testMatch: /auth\.fixture\.ts/,
        },
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"],
                storageState: "e2e/fixtures/.auth/user.json",
            },
            dependencies: ["setup"],
        },
        {
            name: "mobile",
            use: {
                ...devices["Desktop Chrome"],
                viewport: { width: 375, height: 812 },
                storageState: "e2e/fixtures/.auth/user.json",
            },
            dependencies: ["setup"],
            testMatch: /mobile-navigation\.spec\.ts/,
        },
    ],
});
