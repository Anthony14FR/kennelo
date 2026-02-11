import { api } from "@workspace/common";

export async function logoutUser(): Promise<void> {
    const refreshToken = localStorage.getItem("refresh_token");

    try {
        await api.post("/logout", {
            refresh_token: refreshToken,
        });
    } finally {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    }
}
