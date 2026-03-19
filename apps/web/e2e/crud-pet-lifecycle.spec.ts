import { test, expect } from "@playwright/test";

const API_BASE = "http://localhost:8000/api";

const TEST_USER = {
    email: "user@orus.com",
    password: "user",
};

let authToken = "";
let createdPetId = "";
let animalTypeId = 0;

async function apiLogin(): Promise<string> {
    const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(TEST_USER),
    });
    const data = await response.json();
    return data.access_token;
}

async function apiRequest(
    method: string,
    path: string,
    token: string,
    body?: Record<string, unknown>,
) {
    const options: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };
    if (body) options.body = JSON.stringify(body);
    const response = await fetch(`${API_BASE}${path}`, options);
    if (response.status === 204) return { status: 204, data: null };
    const data = await response.json();
    return { status: response.status, data: data.data ?? data };
}

test.describe.serial("Pet Full Lifecycle (CRUD via API + UI verification)", () => {
    test("0. Setup - get auth token and animal types", async () => {
        authToken = await apiLogin();
        expect(authToken).toBeTruthy();

        const typesResponse = await apiRequest("GET", "/animal-types", authToken);
        expect(typesResponse.data.length).toBeGreaterThan(0);
        animalTypeId = typesResponse.data[0].id;
    });

    test("1. Create a pet via API", async () => {
        const response = await apiRequest("POST", "/pets", authToken, {
            animal_type_id: animalTypeId,
            name: "E2E-TestPet",
            breed: "Test Breed",
            sex: "male",
            weight: 5.5,
            is_sterilized: true,
            has_microchip: false,
            about: "Created by e2e test",
        });

        expect(response.status).toBe(201);
        expect(response.data.name).toBe("E2E-TestPet");
        createdPetId = response.data.id;
    });

    test("2. Read - verify pet appears in UI list", async ({ page }) => {
        await page.goto("/s/my/pets");
        await expect(page.getByRole("heading", { level: 3 }).first()).toBeVisible({
            timeout: 15000,
        });

        await expect(page.getByText("E2E-TestPet").first()).toBeVisible();
    });

    test("3. Read - verify pet details via API", async () => {
        const response = await apiRequest("GET", `/pets/${createdPetId}`, authToken);

        expect(response.status).toBe(200);
        expect(response.data.name).toBe("E2E-TestPet");
        expect(response.data.breed).toBe("Test Breed");
        expect(response.data.sex).toBe("male");
        expect(response.data.is_sterilized).toBe(true);
        expect(response.data.has_microchip).toBe(false);
        expect(response.data.about).toBe("Created by e2e test");
    });

    test("4. Read - verify pet details in UI", async ({ page }) => {
        await page.goto("/s/my/pets");
        await expect(page.getByText("E2E-TestPet").first()).toBeVisible({ timeout: 15000 });

        await page.getByText("E2E-TestPet").first().click();
        await expect(page).toHaveURL(/\/s\/my\/pets\/[a-f0-9-]+/);

        await expect(page.locator("h1")).toBeVisible({ timeout: 15000 });
        await expect(page.locator("h1")).toContainText("E2E-TestPet");
        await expect(page.getByText("Test Breed").first()).toBeVisible();
    });

    test("5. Update pet via API", async () => {
        const response = await apiRequest("PUT", `/pets/${createdPetId}`, authToken, {
            name: "E2E-Updated",
            breed: "Updated Breed",
            weight: 7.2,
            about: "Updated by e2e test",
        });

        expect(response.status).toBe(200);
        expect(response.data.name).toBe("E2E-Updated");
        expect(response.data.breed).toBe("Updated Breed");
    });

    test("6. Verify update reflected in UI", async ({ page }) => {
        await page.goto("/s/my/pets");
        await expect(page.getByRole("heading", { level: 3 }).first()).toBeVisible({
            timeout: 15000,
        });

        await expect(page.getByText("E2E-Updated").first()).toBeVisible();

        await page.getByText("E2E-Updated").first().click();
        await expect(page.locator("h1")).toBeVisible({ timeout: 15000 });
        await expect(page.locator("h1")).toContainText("E2E-Updated");
        await expect(page.getByText("Updated Breed").first()).toBeVisible();
    });

    test("7. Delete pet via API", async () => {
        const response = await apiRequest("DELETE", `/pets/${createdPetId}`, authToken);
        expect(response.status).toBe(204);
    });

    test("8. Verify pet removed from UI", async ({ page }) => {
        await page.goto("/s/my/pets");
        await expect(page.getByRole("heading", { level: 3 }).first()).toBeVisible({
            timeout: 15000,
        });

        await expect(page.getByText("E2E-Updated")).toHaveCount(0);
    });

    test("9. Verify deleted pet returns 404 via API", async () => {
        const response = await fetch(`${API_BASE}/pets/${createdPetId}`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        expect(response.status).toBe(404);
    });
});
