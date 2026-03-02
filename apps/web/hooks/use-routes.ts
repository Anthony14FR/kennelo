"use client";

import { routes } from "@/lib/routes";
import { useLocale } from "next-intl";

export function useRoutes() {
    const locale = useLocale();

    return new Proxy(routes, {
        get(target, prop: string) {
            const routeFunction = target[prop as keyof typeof target];

            if (typeof routeFunction !== "function") {
                return routeFunction;
            }

            return (params?: Record<string, string | number>) => {
                const mergedParams = params?.locale ? params : { ...params, locale };
                return routeFunction(mergedParams as unknown as never);
            };
        },
    }) as typeof routes;
}
