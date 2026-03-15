"use client";

import Image from "next/image";
import { PawPrint } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@workspace/ui/components/badge";
import type { PetModel } from "@workspace/modules/pets";
import { isIllustratedType } from "@/features/pets/lib/pet-illustrations";

export type PetCardMediaProps = {
    avatarUrl: string | null;
    typeCode: string;
    animalType: PetModel["animalType"];
    ageDisplay: string | null;
    sex: PetModel["sex"];
};

export function PetCardMedia({
    avatarUrl,
    typeCode,
    animalType,
    ageDisplay,
    sex,
}: PetCardMediaProps) {
    const t = useTranslations();
    const hasIllustration = isIllustratedType(typeCode);

    return (
        <div className="relative aspect-[4/3] bg-muted flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
                <Image
                    src={avatarUrl}
                    alt={animalType?.name ?? ""}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
            ) : hasIllustration ? (
                <Image
                    src={`/illustrations/pets/${typeCode}.svg`}
                    alt={animalType?.name ?? ""}
                    fill
                    className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                />
            ) : (
                <PawPrint className="size-16 text-muted-foreground/20 group-hover:scale-110 transition-transform duration-300" />
            )}

            {animalType && (
                <div className="absolute top-2.5 start-2.5">
                    <Badge
                        variant="secondary"
                        className="rounded-4xl text-xs bg-background/85 backdrop-blur-sm"
                    >
                        {animalType.name}
                    </Badge>
                </div>
            )}

            {ageDisplay && (
                <div className="absolute bottom-2.5 start-2.5">
                    <span className="text-xs font-medium bg-background/85 backdrop-blur-sm rounded-4xl px-2 py-0.5">
                        {ageDisplay}
                    </span>
                </div>
            )}

            {sex && sex !== "unknown" && (
                <div className="absolute bottom-2.5 end-2.5">
                    <span className="text-xs font-medium bg-background/85 backdrop-blur-sm rounded-4xl px-2 py-0.5 capitalize">
                        {t(`features.pets.sex.${sex}`)}
                    </span>
                </div>
            )}
        </div>
    );
}
