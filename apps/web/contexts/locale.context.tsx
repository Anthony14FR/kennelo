"use client";

import { createContext, useContext, ReactNode } from "react";

type LocaleContextType = {
    locale: string;
    setLocale?: (locale: string) => void;
};

const LocaleContext = createContext<LocaleContextType>({
    locale: "en",
});

export function LocaleProvider({ children, locale }: { children: ReactNode; locale: string }) {
    return <LocaleContext.Provider value={{ locale }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
    return useContext(LocaleContext);
}
