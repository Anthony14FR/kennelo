import { api } from "@workspace/common";
import { authService } from "../../services/auth.service";

export async function logoutUser(): Promise<void> {
    const refreshToken = await authService.getRefreshToken();

    try {
        await api.post("/logout", {
            refresh_token: refreshToken,
        });
    } finally {
        await authService.clearTokens();
    }
}
