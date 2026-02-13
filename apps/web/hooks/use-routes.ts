"use client";

import { useLocale } from "@/contexts/locale.context";
import { routes, routesWithDefaultLocale } from "@/lib/routes";

type MakeLocaleOptional<T> = T extends (params: infer P) => string
    ? P extends { locale: unknown }
        ? (params?: Omit<P, "locale"> & { locale?: P["locale"] }) => string
        : T
    : T;

type RoutesWithOptionalLocale = {
    [K in keyof typeof routes]: MakeLocaleOptional<(typeof routes)[K]>;
};

export function useRoutes(): RoutesWithOptionalLocale {
    const { locale } = useLocale();

    return new Proxy(routes, {
        get(target, prop: string) {
            const routeFunction = target[prop as keyof typeof target];

            if (typeof routeFunction !== "function") {
                return routeFunction;
            }

            if (prop in routesWithDefaultLocale) {
                return (params?: unknown) =>
                    routesWithDefaultLocale[prop as keyof typeof routesWithDefaultLocale](
                        params || {},
                        locale,
                    );
            }

            return routeFunction;
        },
    }) as RoutesWithOptionalLocale;
}
