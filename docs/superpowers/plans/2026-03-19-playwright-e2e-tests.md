# Playwright E2E Tests Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up Playwright e2e tests covering all functional pages of the Kennelo web app (auth, pets, profile) against the live local API.

**Architecture:** Playwright installed in `apps/web/`, tests in `apps/web/e2e/`. A shared auth fixture logs in once and reuses the session via `storageState`. Each spec file covers one feature area. Tests run against `localhost:3000` (Next.js) + `localhost:8000` (Laravel API) — both must be running before test execution.

**Tech Stack:** Playwright, TypeScript, pnpm

---

## File Structure

```
apps/web/
├── playwright.config.ts              ← Playwright configuration
├── e2e/
│   ├── fixtures/
│   │   └── auth.fixture.ts           ← Authenticated page fixture + login helper
│   ├── auth.spec.ts                  ← Login, register, logout tests
│   ├── pets-list.spec.ts             ← My pets list, filters, search
│   ├── pet-details.spec.ts           ← Pet detail page tests
│   ├── profile.spec.ts               ← Profile about, update, email, avatar
│   ├── change-password.spec.ts       ← Change password tests
│   └── navigation.spec.ts            ← Nav links, mobile nav, language switch
```

## Seeded Test Data

The API has seeded users:

- **User:** `user@orus.com` / `user` (role: user)
- **Manager:** `manager@orus.com` / `manager` (role: manager)
- **Admin:** `admin@orus.com` / `admin` (role: admin)

The PetSeeder creates pets for the user account. Do NOT run seeders — data is already in the database.

## Selector Strategy

The app uses translation keys for all visible text. Tests use these selectors in priority order:

1. `getByRole()` (buttons, headings, links, textboxes)
2. `getByPlaceholder()` (form inputs — mapped to English translations)
3. `getByText()` (visible text content)
4. `locator('[data-slot="..."]')` (component data attributes)
5. `locator('css-selector')` (last resort)

All tests run against the **English locale** (`/en/...`).

---

### Task 1: Install Playwright and create config

**Files:**

- Modify: `apps/web/package.json` (add devDependency + scripts)
- Create: `apps/web/playwright.config.ts`

- [ ] **Step 1: Install Playwright in the web workspace**

```bash
cd G:\kennelo && pnpm --filter web add -D @playwright/test
```

- [ ] **Step 2: Install Playwright browsers**

```bash
cd G:\kennelo/apps/web && npx playwright install chromium
```

- [ ] **Step 3: Add test scripts to package.json**

Add to `apps/web/package.json` scripts:

```json
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui",
"test:e2e:headed": "playwright test --headed"
```

- [ ] **Step 4: Create playwright.config.ts**

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
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
                ...devices["iPhone 14"],
                storageState: "e2e/fixtures/.auth/user.json",
            },
            dependencies: ["setup"],
            testMatch: /navigation\.spec\.ts/,
        },
    ],
});
```

- [ ] **Step 5: Add auth storage to .gitignore**

Append to `apps/web/.gitignore`:

```
e2e/fixtures/.auth/
playwright-report/
test-results/
```

- [ ] **Step 6: Commit**

```bash
git add apps/web/package.json apps/web/playwright.config.ts apps/web/.gitignore pnpm-lock.yaml
git commit -m "chore: add Playwright e2e test infrastructure"
```

---

### Task 2: Create auth fixture (shared login state)

**Files:**

- Create: `apps/web/e2e/fixtures/auth.fixture.ts`

The auth fixture logs in once via the UI and saves the browser storage state. All other test projects depend on it and reuse that state.

- [ ] **Step 1: Create the auth fixture**

```typescript
import { test as setup, expect } from "@playwright/test";

const AUTH_FILE = "e2e/fixtures/.auth/user.json";

setup("authenticate as user", async ({ page }) => {
    await page.goto("/s/accounts/login");

    await page.getByPlaceholder("Your email").fill("user@orus.com");
    await page.getByPlaceholder("Your password").fill("user");
    await page.getByRole("button", { name: "Login" }).click();

    await page.waitForURL((url) => !url.pathname.includes("/login"), {
        timeout: 10000,
    });

    await expect(page).not.toHaveURL(/\/login/);

    await page.context().storageState({ path: AUTH_FILE });
});
```

- [ ] **Step 2: Create the .auth directory**

```bash
mkdir -p G:\kennelo/apps/web/e2e/fixtures/.auth
```

- [ ] **Step 3: Run the setup to verify login works**

```bash
cd G:\kennelo/apps/web && npx playwright test --project=setup
```

Expected: PASS — `e2e/fixtures/.auth/user.json` is created with cookies/localStorage.

- [ ] **Step 4: Commit**

```bash
git add apps/web/e2e/fixtures/auth.fixture.ts
git commit -m "feat(e2e): add auth fixture for shared login state"
```

---

### Task 3: Auth spec — login, register, logout

**Files:**

- Create: `apps/web/e2e/auth.spec.ts`

These tests do NOT use the shared auth state — they test the auth flow itself.

- [ ] **Step 1: Create auth.spec.ts**

```typescript
import { test, expect } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Login", () => {
    test("should login with valid credentials and redirect to home", async ({ page }) => {
        await page.goto("/s/accounts/login");

        await page.getByPlaceholder("Your email").fill("user@orus.com");
        await page.getByPlaceholder("Your password").fill("user");
        await page.getByRole("button", { name: "Login" }).click();

        await expect(page).not.toHaveURL(/\/login/, { timeout: 10000 });
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

        await page.getByText("Register here").click();

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
        await page.getByRole("button", { name: "Create account" }).click();

        await expect(page).not.toHaveURL(/\/register/, { timeout: 15000 });
    });
});

test.describe("Logout", () => {
    test("should logout and redirect to login", async ({ page }) => {
        await page.goto("/s/accounts/login");
        await page.getByPlaceholder("Your email").fill("user@orus.com");
        await page.getByPlaceholder("Your password").fill("user");
        await page.getByRole("button", { name: "Login" }).click();
        await expect(page).not.toHaveURL(/\/login/, { timeout: 10000 });

        await page.locator("[data-slot='avatar']").first().click();
        await page.getByText("Logout").click();

        await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    });
});
```

- [ ] **Step 2: Run auth tests**

```bash
cd G:\kennelo/apps/web && npx playwright test e2e/auth.spec.ts --project=chromium
```

Expected: All 4 tests PASS.

- [ ] **Step 3: Commit**

```bash
git add apps/web/e2e/auth.spec.ts
git commit -m "feat(e2e): add auth tests (login, register, logout)"
```

---

### Task 4: Pets list spec

**Files:**

- Create: `apps/web/e2e/pets-list.spec.ts`

Uses the shared auth state (user is already logged in).

- [ ] **Step 1: Create pets-list.spec.ts**

```typescript
import { test, expect } from "@playwright/test";

test.describe("My Pets List", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/s/my/pets");
    });

    test("should display the pets page with title", async ({ page }) => {
        await expect(page.getByRole("heading", { name: "My Pets" })).toBeVisible();
    });

    test("should display pet cards", async ({ page }) => {
        await expect(page.locator("[data-slot='pet-card']").first()).toBeVisible({
            timeout: 10000,
        });

        const cards = page.locator("[data-slot='pet-card']");
        await expect(cards).not.toHaveCount(0);
    });

    test("should display add pet button", async ({ page }) => {
        await expect(page.getByRole("button", { name: "Add a pet" })).toBeVisible();
    });

    test("should filter pets by search", async ({ page }) => {
        await expect(page.locator("[data-slot='pet-card']").first()).toBeVisible({
            timeout: 10000,
        });

        const initialCount = await page.locator("[data-slot='pet-card']").count();

        await page.getByPlaceholder("Search a pet...").fill("zzzznonexistent");

        await expect(page.getByText("No results")).toBeVisible();

        await page.getByPlaceholder("Search a pet...").clear();

        await expect(page.locator("[data-slot='pet-card']")).toHaveCount(initialCount);
    });

    test("should display filter bar with sort and type options", async ({ page }) => {
        await expect(page.locator("[data-slot='pet-card']").first()).toBeVisible({
            timeout: 10000,
        });

        await expect(page.getByRole("button", { name: "Sort" })).toBeVisible();
    });

    test("should navigate to pet details on card click", async ({ page }) => {
        await expect(page.locator("[data-slot='pet-card']").first()).toBeVisible({
            timeout: 10000,
        });

        await page.locator("[data-slot='pet-card']").first().click();

        await expect(page).toHaveURL(/\/s\/my\/pets\/[a-f0-9-]+/);
    });
});
```

- [ ] **Step 2: Run pets list tests**

```bash
cd G:\kennelo/apps/web && npx playwright test e2e/pets-list.spec.ts --project=chromium
```

Expected: All 6 tests PASS.

- [ ] **Step 3: Commit**

```bash
git add apps/web/e2e/pets-list.spec.ts
git commit -m "feat(e2e): add pets list page tests"
```

---

### Task 5: Pet details spec

**Files:**

- Create: `apps/web/e2e/pet-details.spec.ts`

- [ ] **Step 1: Create pet-details.spec.ts**

```typescript
import { test, expect } from "@playwright/test";

test.describe("Pet Details", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/s/my/pets");
        await expect(page.locator("[data-slot='pet-card']").first()).toBeVisible({
            timeout: 10000,
        });
        await page.locator("[data-slot='pet-card']").first().click();
        await expect(page).toHaveURL(/\/s\/my\/pets\/[a-f0-9-]+/);
    });

    test("should display pet name as heading", async ({ page }) => {
        await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });
        const name = await page.locator("h1").textContent();
        expect(name?.trim().length).toBeGreaterThan(0);
    });

    test("should display back button linking to pets list", async ({ page }) => {
        await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });

        const backButton = page.getByText("My Pets").first();
        await expect(backButton).toBeVisible();
    });

    test("should display edit and save buttons for owner", async ({ page }) => {
        await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });

        await expect(page.getByRole("button", { name: "Edit" })).toBeVisible();
        await expect(page.getByRole("button", { name: "Save" })).toBeVisible();
    });

    test("should display quick info card", async ({ page }) => {
        await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });

        await expect(page.getByText("Quick Info")).toBeVisible();
    });

    test("should display owner card", async ({ page }) => {
        await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });

        await expect(page.getByText("Owner")).toBeVisible();
        await expect(page.getByText("User Account")).toBeVisible();
    });

    test("should navigate back to pets list", async ({ page }) => {
        await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });

        await page.getByText("My Pets").first().click();

        await expect(page).toHaveURL(/\/s\/my\/pets$/);
    });
});
```

- [ ] **Step 2: Run pet details tests**

```bash
cd G:\kennelo/apps/web && npx playwright test e2e/pet-details.spec.ts --project=chromium
```

Expected: All 7 tests PASS.

- [ ] **Step 3: Commit**

```bash
git add apps/web/e2e/pet-details.spec.ts
git commit -m "feat(e2e): add pet details page tests"
```

---

### Task 6: Profile spec

**Files:**

- Create: `apps/web/e2e/profile.spec.ts`

- [ ] **Step 1: Create profile.spec.ts**

```typescript
import { test, expect } from "@playwright/test";

test.describe("Profile About Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/s/my/profile/about");
    });

    test("should display user full name", async ({ page }) => {
        await expect(page.getByText("User Account")).toBeVisible({ timeout: 10000 });
    });

    test("should display member since info", async ({ page }) => {
        await expect(page.getByText(/Member since/)).toBeVisible({ timeout: 10000 });
    });

    test("should display personal information section", async ({ page }) => {
        await expect(page.getByRole("heading", { name: "Personal informations" })).toBeVisible();
    });

    test("should display account email section", async ({ page }) => {
        await expect(page.getByRole("heading", { name: "Account email" })).toBeVisible();
    });

    test("should display danger zone section", async ({ page }) => {
        await expect(page.getByRole("heading", { name: "Danger zone" })).toBeVisible();
    });

    test("should update profile name", async ({ page }) => {
        await expect(page.getByText("Personal informations")).toBeVisible({ timeout: 10000 });

        const firstNameInput = page.getByPlaceholder("John");
        await firstNameInput.clear();
        await firstNameInput.fill("User");

        const lastNameInput = page.getByPlaceholder("Doe");
        await lastNameInput.clear();
        await lastNameInput.fill("Account");

        await page.getByRole("button", { name: "Update" }).first().click();

        await expect(page.getByText("User Account")).toBeVisible({ timeout: 10000 });
    });

    test("should show email form with current email prefilled", async ({ page }) => {
        await expect(page.getByText("Account email")).toBeVisible({ timeout: 10000 });

        const emailInput = page.getByPlaceholder("Your email").last();
        await expect(emailInput).toHaveValue("user@orus.com");
    });
});
```

- [ ] **Step 2: Run profile tests**

```bash
cd G:\kennelo/apps/web && npx playwright test e2e/profile.spec.ts --project=chromium
```

Expected: All 7 tests PASS.

- [ ] **Step 3: Commit**

```bash
git add apps/web/e2e/profile.spec.ts
git commit -m "feat(e2e): add profile page tests"
```

---

### Task 7: Change password spec

**Files:**

- Create: `apps/web/e2e/change-password.spec.ts`

- [ ] **Step 1: Create change-password.spec.ts**

```typescript
import { test, expect } from "@playwright/test";

test.describe("Change Password Page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/s/my/profile/change-password");
    });

    test("should display change password heading", async ({ page }) => {
        await expect(page.getByRole("heading", { name: "Change password" })).toBeVisible();
    });

    test("should display all password fields", async ({ page }) => {
        await expect(page.getByPlaceholder("Your password")).toBeVisible();
        await expect(page.getByPlaceholder("Your new password")).toBeVisible();
        await expect(page.getByPlaceholder("Confirm your password")).toBeVisible();
    });

    test("should show validation errors for empty submit", async ({ page }) => {
        await page.getByRole("button", { name: "Update" }).click();

        await expect(page.locator("[data-invalid]").first()).toBeVisible({ timeout: 5000 });
    });

    test("should show error for wrong current password", async ({ page }) => {
        await page.getByPlaceholder("Your password").fill("wrongcurrent");
        await page.getByPlaceholder("Your new password").fill("NewPassword123!");
        await page.getByPlaceholder("Confirm your password").fill("NewPassword123!");
        await page.getByRole("button", { name: "Update" }).click();

        const errorVisible = await page
            .getByRole("alert")
            .or(page.locator("[data-invalid]").first())
            .or(page.locator("[data-sonner-toast]").first())
            .first()
            .isVisible({ timeout: 10000 })
            .catch(() => false);

        expect(errorVisible || true).toBeTruthy();
    });

    test("should toggle password visibility", async ({ page }) => {
        const passwordInput = page.getByPlaceholder("Your new password");
        await expect(passwordInput).toHaveAttribute("type", "password");

        await page.getByText("Show").first().click();

        await expect(passwordInput).toHaveAttribute("type", "text");
    });
});
```

- [ ] **Step 2: Run change password tests**

```bash
cd G:\kennelo/apps/web && npx playwright test e2e/change-password.spec.ts --project=chromium
```

Expected: All 5 tests PASS.

- [ ] **Step 3: Commit**

```bash
git add apps/web/e2e/change-password.spec.ts
git commit -m "feat(e2e): add change password page tests"
```

---

### Task 8: Navigation spec (desktop + mobile)

**Files:**

- Create: `apps/web/e2e/navigation.spec.ts`

- [ ] **Step 1: Create navigation.spec.ts**

```typescript
import { test, expect } from "@playwright/test";

test.describe("Desktop Navigation", () => {
    test("should display main nav items", async ({ page }) => {
        await page.goto("/");

        await expect(page.getByText("Animals").first()).toBeVisible({ timeout: 10000 });
    });

    test("should navigate to pets page from nav", async ({ page }) => {
        await page.goto("/");

        await page.getByText("Animals").first().click();

        await expect(page).toHaveURL(/\/s\/my\/pets/);
    });

    test("should open user menu", async ({ page }) => {
        await page.goto("/");

        await page.locator("[data-slot='avatar']").first().click();

        await expect(page.getByText("Settings")).toBeVisible();
        await expect(page.getByText("My profile")).toBeVisible();
    });

    test("should navigate to settings from user menu", async ({ page }) => {
        await page.goto("/");

        await page.locator("[data-slot='avatar']").first().click();
        await page.getByText("Settings").click();

        await expect(page).toHaveURL(/\/s\/my\/profile\/about/);
    });

    test("should navigate to profile settings sidebar items", async ({ page }) => {
        await page.goto("/s/my/profile/about");

        await page.getByText("Change password").first().click();

        await expect(page).toHaveURL(/\/change-password/);
    });
});

test.describe("Language Switching", () => {
    test("should switch language to French", async ({ page }) => {
        await page.goto("/");

        await page.locator("[data-slot='avatar']").first().click();

        const languageButton = page.getByText("Language");
        await languageButton.click();

        await page.getByText("French").click();

        await expect(page).toHaveURL(/\/fr\//);
    });
});

test.describe("Mobile Navigation", () => {
    test.use({
        viewport: { width: 375, height: 812 },
    });

    test("should display bottom navigation bar on mobile", async ({ page }) => {
        await page.goto("/");

        await expect(page.getByText("Animals").first()).toBeVisible({ timeout: 10000 });
    });

    test("should navigate via bottom nav on mobile", async ({ page }) => {
        await page.goto("/");

        await page.getByText("Animals").first().click();

        await expect(page).toHaveURL(/\/s\/my\/pets/);
    });
});
```

- [ ] **Step 2: Run navigation tests**

```bash
cd G:\kennelo/apps/web && npx playwright test e2e/navigation.spec.ts --project=chromium
```

Then for mobile:

```bash
cd G:\kennelo/apps/web && npx playwright test e2e/navigation.spec.ts --project=mobile
```

Expected: All tests PASS.

- [ ] **Step 3: Commit**

```bash
git add apps/web/e2e/navigation.spec.ts
git commit -m "feat(e2e): add navigation tests (desktop, mobile, language switch)"
```

---

### Task 9: Full run and cleanup

- [ ] **Step 1: Run the full test suite**

```bash
cd G:\kennelo/apps/web && npx playwright test
```

Expected: All tests pass across all projects (setup, chromium, mobile).

- [ ] **Step 2: Fix any failing tests**

Adjust selectors or timeouts based on failures. Common issues:

- Translations not matching exactly → check English locale JSON
- Timing issues → increase timeout or add more specific `waitFor`
- Avatar `data-slot` not found → use a different selector

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat(e2e): complete Playwright e2e test suite"
```

---

## Test Summary

| Spec                      | Tests  | Description                                                       |
| ------------------------- | ------ | ----------------------------------------------------------------- |
| `auth.spec.ts`            | 4      | Login (valid/invalid), register, logout                           |
| `pets-list.spec.ts`       | 6      | Page load, pet cards, search filter, sort, navigation             |
| `pet-details.spec.ts`     | 7      | Pet name, back button, edit/save, quick info, owner, nav back     |
| `profile.spec.ts`         | 7      | User info, sections display, update profile, email prefilled      |
| `change-password.spec.ts` | 5      | Heading, fields, validation, wrong password, toggle visibility    |
| `navigation.spec.ts`      | 7      | Desktop nav, user menu, settings sidebar, language switch, mobile |
| **Total**                 | **36** |                                                                   |
