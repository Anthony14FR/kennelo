"use client";

import { useTranslations } from "next-intl";
import { CardContent } from "@workspace/ui/components/card";
import type { PetModel } from "@workspace/modules/pets";

type PetCardStatsProps = {
    pet: PetModel;
};

export function PetCardStats({ pet }: PetCardStatsProps) {
    const t = useTranslations();

    return (
        <CardContent className="p-3.5 space-y-2">
            <div>
                <h3 className="font-semibold text-base leading-tight truncate">{pet.name}</h3>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {pet.breed ?? pet.animalType?.name ?? ""}
                </p>
            </div>

            <div className="flex items-center justify-between">
                {pet.weight ? (
                    <span className="text-xs text-muted-foreground">{pet.weight} kg</span>
                ) : (
                    <span />
                )}

                <div className="flex items-center gap-1.5">
                    {pet.isSterilized && (
                        <span
                            className="size-2 rounded-full bg-emerald-400 shrink-0"
                            title={t("features.pets.badges.sterilized")}
                        />
                    )}
                    {pet.hasMicrochip && (
                        <span
                            className="size-2 rounded-full bg-sky-400 shrink-0"
                            title={t("features.pets.badges.microchipped")}
                        />
                    )}
                </div>
            </div>
        </CardContent>
    );
}
