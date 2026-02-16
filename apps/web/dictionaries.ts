const dictionaries = {
    en: () => import("@workspace/translations/dist/en.json").then((m) => m.default),
    fr: () => import("@workspace/translations/dist/fr.json").then((m) => m.default),
};

export type Locale = keyof typeof dictionaries;

export const hasLocale = (locale: string): locale is Locale => locale in dictionaries;
export const getDictionary = (locale: Locale) => dictionaries[locale]();

export const LOCALES: readonly Locale[] = ["fr", "en"];
export const DEFAULT_LOCALE: Locale = "fr";
