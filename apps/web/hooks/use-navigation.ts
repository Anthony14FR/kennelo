"use client";

import { useRouter } from "next/navigation";
import { useRouteParams } from "./use-route-params";
import { useRoutes } from "./use-routes";

export function useNavigation<T extends Record<string, string>>() {
    const router = useRouter();
    const routes = useRoutes();
    const params = useRouteParams<T>();

    return {
        routes,
        router,
        params,
        push: (path: string) => router.push(path),
        replace: (path: string) => router.replace(path),
        back: () => router.back(),
    };
}
