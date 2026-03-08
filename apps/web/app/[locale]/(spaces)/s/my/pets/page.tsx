"use client";

import { Input } from "@workspace/ui/components/input";
import { Separator } from "@workspace/ui/components/separator";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

export default function MyPets() {
    const t = useTranslations();

    return (
        <div className="min-h-screen bg-card">
            <Separator />

            <div className="h-18 flex items-center">
                <div className="flex items-center justify-between px-8 w-full">
                    <h1 className="text-3xl font-semibold tracking-tight">My pets</h1>
                    <div className="relative w-64">
                        <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input className="ps-9" placeholder={t("common.placeholders.search")} />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between px-8 w-full">...</div>
        </div>
    );
}
