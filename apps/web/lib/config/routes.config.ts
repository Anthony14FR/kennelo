export const routesConfig = {
    mode: (process.env.NEXT_PUBLIC_ROUTE_MODE as "dynamic" | "static") || "dynamic",
    preservedParams: ["locale", "lang"],
} as const;

export function buildRoute(path: string, params?: Record<string, string | number>): string {
    if (!params || Object.keys(params).length === 0) {
        params = {};
    }

    if (path.includes("[locale]") && !params.locale) {
        path = path.replace("[locale]/", "");
    }

    const mode = routesConfig.mode;
    const preserved = routesConfig.preservedParams;
    const queryParams: Record<string, string> = {};
    let finalPath = path;

    Object.entries(params).forEach(([key, value]) => {
        if (mode === "static" && !(preserved as readonly string[]).includes(key)) {
            queryParams[key] = String(value);
        } else {
            finalPath = finalPath.replace(`[${key}]`, String(value));
        }
    });

    const query = new URLSearchParams(queryParams).toString();
    return query ? `${finalPath}?${query}` : finalPath;
}
