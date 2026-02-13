export const routesConfig = {
    mode: (process.env.NEXT_PUBLIC_ROUTE_MODE as "dynamic" | "static") || "dynamic",
    preservedParams: ["locale", "lang"],
} as const;
