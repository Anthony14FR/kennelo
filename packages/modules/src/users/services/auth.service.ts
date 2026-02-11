export const authService = {
    getAccessToken(): string | null {
        if (typeof window === "undefined") return null;
        return localStorage.getItem("access_token");
    },

    getRefreshToken(): string | null {
        if (typeof window === "undefined") return null;
        return localStorage.getItem("refresh_token");
    },

    isAuthenticated(): boolean {
        return this.getAccessToken() !== null;
    },

    clearTokens(): void {
        if (typeof window === "undefined") return;
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    },

    setTokens(accessToken: string, refreshToken: string): void {
        if (typeof window === "undefined") return;
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);
    },
};
