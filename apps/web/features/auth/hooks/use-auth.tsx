"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { UserModel } from "@workspace/modules/users";
import { getCurrentUser, logoutUser, authService } from "@workspace/modules/users";
import { useRouter } from "next/navigation";
import { logger } from "@/lib/logger";

interface AuthContextValue {
    user: UserModel | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserModel | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const loadUser = async () => {
        if (!authService.isAuthenticated()) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            logger.error("Failed to load user:", error);
            setUser(null);
            authService.clearTokens();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    const logout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            logger.error("Logout error:", error);
        } finally {
            setUser(null);
            router.push("/login");
        }
    };

    const refreshUser = async () => {
        await loadUser();
    };

    const value: AuthContextValue = {
        user,
        isLoading,
        isAuthenticated: user !== null,
        logout,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
