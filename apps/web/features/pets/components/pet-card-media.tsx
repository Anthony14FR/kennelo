"use client";

import Image from "next/image";
import { PawPrint, VenusAndMars } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@workspace/ui/components/badge";
import type { PetModel } from "@workspace/modules/pets";
import { isIllustratedType } from "@/features/pets/lib/pet-illustrations";

export type PetCardMediaProps = {
    avatarUrl: string | null;
    typeCode: string;
    animalType: PetModel["animalType"];
    isSterilized: boolean | null;
};

type PetCardImageProps = {
    avatarUrl: string | null;
    typeCode: string;
    animalTypeName: string;
    hasIllustration: boolean;
};

function PetCardImage({ avatarUrl, typeCode, animalTypeName, hasIllustration }: PetCardImageProps) {
    if (avatarUrl) {
        return (
            <Image
                src={avatarUrl}
                alt={animalTypeName}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
        );
    }
    if (hasIllustration) {
        return (
            <Image
                src={`/illustrations/pets/${typeCode}.svg`}
                alt={animalTypeName}
                fill
                className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
            />
        );
    }
    return (
        <PawPrint className="size-16 text-muted-foreground/20 group-hover:scale-110 transition-transform duration-300" />
    );
}

export function PetCardMedia({ avatarUrl, typeCode, animalType, isSterilized }: PetCardMediaProps) {
    const t = useTranslations();
    const hasIllustration = isIllustratedType(typeCode);

    return (
        <div className="relative aspect-[6/4] bg-muted flex items-center justify-center overflow-hidden">
            <PetCardImage
                avatarUrl={avatarUrl}
                typeCode={typeCode}
                animalTypeName={animalType?.name ?? ""}
                hasIllustration={hasIllustration}
            />

            {isSterilized && (
                <div className="absolute top-2.5 start-2.5">
                    <Badge className="rounded-4xl text-xs bg-emerald-500/90 backdrop-blur-sm text-white border-0 gap-1.5 hover:bg-emerald-500/90">
                        <VenusAndMars className="size-3 shrink-0" />
                        {t("features.pets.badges.sterilized")}
                    </Badge>
                </div>
            )}
        </div>
    );
}
