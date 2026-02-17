"use client";

import { useLocale, useTranslations } from "next-intl";
import { GlobeIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import { LOCALE_INFO, type Locale } from "@/dictionaries";
import { LanguageSelectorItems, useLanguageSelector } from "@/components/language-selector";

export function LanguageSwitcher({
    variant = "ghost",
    size = "default",
    showDetails = false,
}: {
    variant?: "default" | "outline" | "ghost";
    size?: "default" | "sm" | "lg" | "icon";
    showDetails?: boolean;
}) {
    const locale = useLocale() as Locale;
    const { isPending } = useLanguageSelector();
    const t = useTranslations();

    const currentFlag = LOCALE_INFO[locale].flag;
    const currentLanguageName = t("settings.name");

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={variant} size={size} disabled={isPending} className="gap-2">
                    {showDetails ? (
                        <>
                            <span className="text-base">{currentFlag}</span>
                            <span className="hidden sm:inline">{currentLanguageName}</span>
                        </>
                    ) : (
                        <GlobeIcon className="size-4" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-48">
                <LanguageSelectorItems />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
