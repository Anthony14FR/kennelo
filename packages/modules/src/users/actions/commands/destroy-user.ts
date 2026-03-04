import { api } from "@workspace/common";

export async function destroyUser(): Promise<void> {
    const response = await api.delete("/user");

    if (response.status !== 200) {
        throw new Error("Failed to delete account");
    }
}
