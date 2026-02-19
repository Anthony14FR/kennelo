"use client";

import { useEffect } from "react";
import { LocaleDirection } from "@/dictionaries";

interface LocaleUpdaterProps {
    locale: string;
    direction: LocaleDirection;
}

export default function LocaleUpdater({ locale, direction }: LocaleUpdaterProps) {
    useEffect(() => {
        const htmlElement = document.documentElement;
        htmlElement.lang = locale;
        htmlElement.dir = direction;
    }, [locale, direction]);

    return null;
}
