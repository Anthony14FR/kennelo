"use client";

import { routesConfig } from "@/lib/config/routes.config";
import { useParams, useSearchParams } from "next/navigation";

export function useRouteParams<T extends Record<string, string>>(): T {
    const params = useParams();
    const searchParams = useSearchParams();
    const mode = routesConfig.mode;

    if (mode === "static") {
        const result: Record<string, string> = {};

        Object.entries(params).forEach(([key, value]) => {
            result[key] = Array.isArray(value) ? value[0] : value;
        });

        searchParams.forEach((value, key) => {
            result[key] = value;
        });

        return result as T;
    }

    const result: Record<string, string> = {};

    Object.entries(params).forEach(([key, value]) => {
        result[key] = Array.isArray(value) ? value[0] : value;
    });

    return result as T;
}
