import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./lib/i18n/routing";
import { hasLocale } from "next-intl";

export default async function proxy(request: NextRequest) {
    const acceptLanguage = request.headers.get("accept-language");
    const browserLocale = acceptLanguage?.split(",")[0]?.split("-")[0]?.trim() ?? "en";

    const defaultLocale = hasLocale(routing.locales, browserLocale)
        ? browserLocale
        : routing.defaultLocale;

    const handleI18nRouting = createMiddleware({
        ...routing,
        defaultLocale,
    });

    return handleI18nRouting(request);
}

export const config = {
    matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
