"use client";

import { Cpu, HeartPulse, Scissors } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PetModel } from "@workspace/modules/pets";
import { PetSectionHeader } from "@/features/pets/components/pet-section-header";

type PetHealthSectionProps = {
    pet: PetModel;
};

export function PetHealthSection({ pet }: PetHealthSectionProps) {
    const t = useTranslations();

    const sterilizationStyle =
        pet.isSterilized === true
            ? {
                  bg: "bg-green-100 dark:bg-green-900/30",
                  color: "text-green-700 dark:text-green-400",
              }
            : { bg: "bg-muted", color: "text-muted-foreground" };

    const microchipStyle = pet.hasMicrochip
        ? { bg: "bg-blue-100 dark:bg-blue-900/30", color: "text-blue-700 dark:text-blue-400" }
        : { bg: "bg-muted", color: "text-muted-foreground" };

    const sterilizationLabel =
        pet.isSterilized === true
            ? t("features.pets.badges.sterilized")
            : pet.isSterilized === false
              ? t("features.pets.badges.notSterilized")
              : "—";

    return (
        <div className="space-y-5">
            <PetSectionHeader
                icon={<HeartPulse className="size-4 text-amber-600 dark:text-amber-400" />}
                title={t("features.pets.profile.healthTracking")}
            />

            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border p-3.5 space-y-1.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {t("features.pets.fields.sterilized")}
                    </p>
                    <div
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold rounded-xl px-2 py-1 ${sterilizationStyle.bg} ${sterilizationStyle.color}`}
                    >
                        <Scissors className="size-3" />
                        {sterilizationLabel}
                    </div>
                </div>
                <div className="rounded-2xl border p-3.5 space-y-1.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {t("features.pets.fields.microchip")}
                    </p>
                    {pet.hasMicrochip ? (
                        <div
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold rounded-xl px-2 py-1 ${microchipStyle.bg} ${microchipStyle.color}`}
                        >
                            <Cpu className="size-3" />
                            {pet.microchipNumber ?? t("features.pets.badges.microchipped")}
                        </div>
                    ) : (
                        <span className="text-xs text-muted-foreground">
                            {t("features.pets.badges.noMicrochip")}
                        </span>
                    )}
                </div>
            </div>

            {pet.healthNotes && (
                <div className="space-y-2.5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {t("features.pets.profile.medicalNotes")}
                    </p>
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/10 p-4">
                        <p className="text-sm text-amber-800/80 dark:text-amber-300/80 leading-relaxed">
                            {pet.healthNotes}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
