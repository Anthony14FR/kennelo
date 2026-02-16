import { getDictionary, Locale, hasLocale } from "@/dictionaries";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    // Si la locale n'est pas valide, utiliser la locale par défaut
    if (!locale || !hasLocale(locale)) {
        locale = routing.defaultLocale;
    }

    return {
        locale,
        messages: await getDictionary(locale as Locale),
    };
});
