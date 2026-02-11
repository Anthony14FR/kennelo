import { api } from "@workspace/common";
import { RefreshTokenResponseDto } from "../../models/dtos/auth.dto";

export async function refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
        throw new Error("No refresh token found");
    }

    const response = await api.post<RefreshTokenResponseDto>("/refresh", {
        refresh_token: refreshToken,
    });

    if (response.status !== 200) {
        throw new Error("Failed to refresh token");
    }

    if (!response.data) {
        throw new Error("No data returned from token refresh");
    }

    const newAccessToken = response.data.access_token;

    localStorage.setItem("access_token", newAccessToken);

    return newAccessToken;
}
