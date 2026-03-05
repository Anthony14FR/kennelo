const dictionaries = {
    en: () => import("@workspace/translations/dist/en.json").then((m) => m.default),
    fr: () => import("@workspace/translations/dist/fr.json").then((m) => m.default),
    ar: () => import("@workspace/translations/dist/ar.json").then((m) => m.default),
};

export type Locale = keyof typeof dictionaries;
export type LocaleDirection = "ltr" | "rtl";

export const DEFAULT_LOCALE: Locale = "fr";
export const DEFAULT_LOCALE_DIR: LocaleDirection = "ltr";

export const LOCALE_INFO: Record<Locale, { name: string; flag: string }> = {
    en: { name: "English", flag: "🇬🇧" },
    fr: { name: "Français", flag: "🇫🇷" },
    ar: { name: "العربية", flag: "🇸🇦" },
} as const;

export const LOCALES: readonly Locale[] = Object.keys(dictionaries) as Locale[];

export const hasLocale = (locale: string): locale is Locale => locale in dictionaries;
export const getDictionary = (locale: Locale) => dictionaries[locale]();

export function localeOrDefault(locale?: string): Locale {
    if (locale && hasLocale(locale)) {
        return locale;
    }
    return DEFAULT_LOCALE;
}
