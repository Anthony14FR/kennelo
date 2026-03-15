"use client";

import { HeartPulse, Leaf, PawPrint } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PetAttributeModel, PetModel } from "@workspace/modules/pets";
import { PetGallery } from "@/features/pets/components/pet-gallery";
import { PetBadgesStrip } from "@/features/pets/components/pet-badges-strip";
import { PetSectionHeader } from "@/features/pets/components/pet-section-header";
import {
    PetAttributeBehaviorCard,
    PetAttributeCareCard,
} from "@/features/pets/components/pet-attribute-card";
import { PetHealthSection } from "@/features/pets/components/pet-health-section";
import { PetTypeIllustration } from "./pet-type-illustration";

type PetProfileInfoProps = {
    pet: PetModel;
    ageDisplay: string | null;
};

function isBooleanAttr(attr: PetAttributeModel): boolean {
    return typeof attr.value === "boolean";
}

function isNonBooleanAttr(attr: PetAttributeModel): boolean {
    return typeof attr.value !== "boolean";
}

function PetIdentityHeader({ pet }: { pet: PetModel }) {
    return (
        <div className="flex gap-3 items-center">
            <PetTypeIllustration
                code={pet.animalType?.code || ""}
                name={pet.name}
                className="size-12"
            />
            <div className="flex flex-col gap-1">
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
        </div>
    );
}

function PetAboutSection({ about, label }: { about: string; label: string }) {
    return (
        <div className="space-y-3">
            <PetSectionHeader
                icon={<PawPrint className="size-4 text-amber-600 dark:text-amber-400" />}
                title={label}
            />
            <p className="text-sm leading-relaxed text-foreground/80">{about}</p>
        </div>
    );
}

function PetBehaviorsSection({ attrs, label }: { attrs: PetModel["attributes"]; label: string }) {
    if (!attrs || attrs.length === 0) return null;
    return (
        <div className="space-y-4">
            <PetSectionHeader
                icon={<HeartPulse className="size-4 text-amber-600 dark:text-amber-400" />}
                title={label}
                count={attrs.length}
            />
            <div className="grid grid-cols-2 gap-3">
                {attrs.map((attr) => (
                    <PetAttributeBehaviorCard key={attr.id} attr={attr} />
                ))}
            </div>
        </div>
    );
}

function PetCareSection({ attrs, label }: { attrs: PetModel["attributes"]; label: string }) {
    if (!attrs || attrs.length === 0) return null;
    return (
        <div className="space-y-4">
            <PetSectionHeader
                icon={<Leaf className="size-4 text-amber-600 dark:text-amber-400" />}
                title={label}
                count={attrs.length}
            />
            <div className="grid grid-cols-2 gap-3">
                {attrs.map((attr) => (
                    <PetAttributeCareCard key={attr.id} attr={attr} />
                ))}
            </div>
        </div>
    );
}

export function PetProfileInfo({ pet, ageDisplay }: PetProfileInfoProps) {
    const t = useTranslations();

    const booleanAttrs = pet.attributes?.filter(isBooleanAttr) ?? [];
    const careAttrs = pet.attributes?.filter(isNonBooleanAttr) ?? [];

    return (
        <div className="space-y-6">
            <PetIdentityHeader pet={pet} />
            <PetGallery pet={pet} />
            <PetBadgesStrip pet={pet} ageDisplay={ageDisplay} />
            {pet.about && (
                <PetAboutSection about={pet.about} label={t("features.pets.profile.about")} />
            )}
            <PetBehaviorsSection
                attrs={booleanAttrs}
                label={t("features.pets.profile.behaviors")}
            />
            <PetCareSection attrs={careAttrs} label={t("features.pets.profile.care")} />
            <PetHealthSection pet={pet} />
        </div>
    );
}
