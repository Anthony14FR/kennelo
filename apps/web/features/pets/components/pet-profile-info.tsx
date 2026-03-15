"use client";

import { HeartPulse, Leaf, PawPrint } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PetModel } from "@workspace/modules/pets";
import { PetGallery } from "@/features/pets/components/pet-gallery";
import { PetBadgesStrip } from "@/features/pets/components/pet-badges-strip";
import { PetSectionHeader } from "@/features/pets/components/pet-section-header";
import {
    PetAttributeBehaviorCard,
    PetAttributeCareCard,
} from "@/features/pets/components/pet-attribute-card";
import { PetHealthSection } from "@/features/pets/components/pet-health-section";

type PetProfileInfoProps = {
    pet: PetModel;
    ageDisplay: string | null;
};

export function PetProfileInfo({ pet, ageDisplay }: PetProfileInfoProps) {
    const t = useTranslations();

    const booleanAttrs = pet.attributes?.filter((attr) => typeof attr.value === "boolean") ?? [];
    const careAttrs = pet.attributes?.filter((attr) => typeof attr.value !== "boolean") ?? [];

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">{pet.name}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {pet.animalType && <span>{pet.animalType.name}</span>}
                    {pet.breed && (
                        <>
                            {pet.animalType && <span>·</span>}
                            <span>{pet.breed}</span>
                        </>
                    )}
                </div>
            </div>

            <PetGallery pet={pet} />

            <PetBadgesStrip pet={pet} ageDisplay={ageDisplay} />

            {pet.about && (
                <div className="space-y-3">
                    <PetSectionHeader
                        icon={<PawPrint className="size-4 text-amber-600 dark:text-amber-400" />}
                        title={t("features.pets.profile.about")}
                    />
                    <p className="text-sm leading-relaxed text-foreground/80">{pet.about}</p>
                </div>
            )}

            {booleanAttrs.length > 0 && (
                <div className="space-y-4">
                    <PetSectionHeader
                        icon={<HeartPulse className="size-4 text-amber-600 dark:text-amber-400" />}
                        title={t("features.pets.profile.behaviors")}
                        count={booleanAttrs.length}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        {booleanAttrs.map((attr) => (
                            <PetAttributeBehaviorCard key={attr.id} attr={attr} />
                        ))}
                    </div>
                </div>
            )}

            {careAttrs.length > 0 && (
                <div className="space-y-4">
                    <PetSectionHeader
                        icon={<Leaf className="size-4 text-amber-600 dark:text-amber-400" />}
                        title={t("features.pets.profile.care")}
                        count={careAttrs.length}
                    />
                    <div className="grid grid-cols-2 gap-3">
                        {careAttrs.map((attr) => (
                            <PetAttributeCareCard key={attr.id} attr={attr} />
                        ))}
                    </div>
                </div>
            )}

            <PetHealthSection pet={pet} />
        </div>
    );
}
