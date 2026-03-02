export interface JWTPayload {
    exp?: number;
    iat?: number;
    sub?: string;
    [key: string]: unknown;
}

export const jwtHelper = {
    decode<T extends JWTPayload = JWTPayload>(token: string): T | null {
        try {
            const cleanToken = token.replace(/^Bearer\s+/i, "");
            const parts = cleanToken.split(".");

            if (parts.length !== 3) {
                console.warn("Token JWT invalide: format incorrect");
                return null;
            }

            const payload = parts[1]!;
            const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));

            return JSON.parse(decoded) as T;
        } catch (error) {
            console.error("Erreur lors du décodage du token JWT:", error);
            return null;
        }
    },

    getProperty<T = unknown>(token: string, property: string): T | null {
        const payload = this.decode(token);
        if (!payload) return null;

        return (payload[property] as T) ?? null;
    },

    isExpired(token: string): boolean {
        const payload = this.decode(token);
        if (!payload || !payload.exp) return true;

        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;
    },

    isValid(token: string): boolean {
        if (!token) return false;

        const payload = this.decode(token);
        if (!payload) return false;

        return !this.isExpired(token);
    },

    getTimeUntilExpiration(token: string): number | null {
        const payload = this.decode(token);
        if (!payload || !payload.exp) return null;

        const currentTime = Math.floor(Date.now() / 1000);
        const timeRemaining = payload.exp - currentTime;

        return timeRemaining > 0 ? timeRemaining : 0;
    },

    getExpirationDate(token: string): Date | null {
        const payload = this.decode(token);
        if (!payload || !payload.exp) return null;

        return new Date(payload.exp * 1000);
    },

    getIssuedAtDate(token: string): Date | null {
        const payload = this.decode(token);
        if (!payload || !payload.iat) return null;

        return new Date(payload.iat * 1000);
    },

    getCustomData<T extends Record<string, unknown> = Record<string, unknown>>(
        token: string,
    ): T | null {
        const payload = this.decode(token);
        if (!payload) return null;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { exp, iat, sub, ...customData } = payload;
        return customData as T;
    },
} as const;
