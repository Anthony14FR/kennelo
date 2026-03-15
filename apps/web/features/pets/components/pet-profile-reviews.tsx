"use client";

import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

export function PetProfileReviews() {
    const t = useTranslations();

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Star className="size-5 text-muted-foreground/40" />
                <h3 className="text-lg font-semibold">{t("features.pets.profile.hostsReviews")}</h3>
            </div>
            <div className="rounded-2xl border bg-muted/30 p-10 flex flex-col items-center gap-3 text-center">
                <Star className="size-10 text-muted-foreground/20" />
                <div className="space-y-1">
                    <p className="font-medium text-sm">{t("features.pets.profile.reviewsEmpty")}</p>
                    <p className="text-xs text-muted-foreground">
                        {t("features.pets.profile.reviewsEmptyDescription")}
                    </p>
                </div>
            </div>
        </div>
    );
}
