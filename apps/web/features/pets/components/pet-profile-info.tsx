"use client";

import {
    Baby,
    Calendar,
    Camera,
    Cpu,
    Heart,
    PawPrint,
    Scissors,
    Star,
    Syringe,
    Tag,
    UtensilsCrossed,
    Users,
    Weight,
    Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { createElement, type ElementType } from "react";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import type { PetAttributeModel, PetModel } from "@workspace/modules/pets";
import { MOCK_AVG_RATING, MOCK_REVIEWS } from "@/features/pets/lib/mock-reviews";

type PetProfileInfoProps = {
    pet: PetModel;
    ageDisplay: string | null;
};

const ATTRIBUTE_ICON_MAP: Record<string, ElementType> = {
    vaccinated: Syringe,
    is_vaccinated: Syringe,
    sterilized: Scissors,
    is_sterilized: Scissors,
    microchipped: Cpu,
    has_microchip: Cpu,
    friendly_with_animals: Heart,
    friendly_animals: Heart,
    sociable_animals: Heart,
    friendly_with_children: Baby,
    friendly_children: Baby,
    sociable_children: Baby,
    friendly_with_strangers: Users,
    friendly_strangers: Users,
    sociable_strangers: Users,
    energy_level: Zap,
    diet: UtensilsCrossed,
    feeding: UtensilsCrossed,
    food: UtensilsCrossed,
    alimentation: UtensilsCrossed,
};

function getAttributeIcon(code: string): ElementType {
    return ATTRIBUTE_ICON_MAP[code.toLowerCase()] ?? Tag;
}

const YES_KEY = "features.pets.values.yes" as const;
const NO_KEY = "features.pets.values.no" as const;
const MUTED_TEXT = "text-muted-foreground";

function getAttrMeta(attr: PetAttributeModel) {
    return {
        code: attr.attributeDefinition?.code ?? "",
        label: attr.attributeDefinition?.label ?? `#${attr.attributeDefinitionId}`,
        valueType: attr.attributeDefinition?.valueType ?? "text",
    };
}

function getAttrDisplayValue(attr: PetAttributeModel, yesText: string, noText: string): string {
    if (attr.attributeOption?.label) {
        return attr.attributeOption.label;
    }
    if (typeof attr.value === "boolean") {
        return attr.value ? yesText : noText;
    }
    return String(attr.value ?? "—");
}

function getBooleanIconStyle(isBoolean: boolean, isTrue: boolean) {
    if (!isBoolean) {
        return { bg: "bg-muted", color: MUTED_TEXT };
    }
    return isTrue
        ? { bg: "bg-green-100 dark:bg-green-900/30", color: "text-green-600 dark:text-green-400" }
        : { bg: "bg-red-50 dark:bg-red-900/20", color: "text-red-400 dark:text-red-500" };
}

function StarRating({ value }: { value: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={`size-3.5 ${
                        i < Math.round(value)
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/25"
                    }`}
                />
            ))}
        </div>
    );
}

function AttributeCard({ attr }: { attr: PetAttributeModel }) {
    const t = useTranslations();
    const { code, label, valueType } = getAttrMeta(attr);

    const isLongText =
        valueType === "text" &&
        typeof attr.value === "string" &&
        (attr.value as string).length > 30;

    const displayValue = getAttrDisplayValue(attr, t(YES_KEY), t(NO_KEY));

    if (isLongText) {
        return (
            <div className="col-span-2 rounded-2xl border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/10 p-4">
                <div className="flex items-center gap-2 mb-1.5">
                    {createElement(getAttributeIcon(code), {
                        className: "size-4 text-amber-600 dark:text-amber-400 shrink-0",
                    })}
                    <span className="font-semibold text-sm text-amber-700 dark:text-amber-300">
                        {label}
                    </span>
                </div>
                <p className="text-sm text-amber-800/80 dark:text-amber-300/80 leading-relaxed">
                    {displayValue}
                </p>
            </div>
        );
    }

    const isBoolean = typeof attr.value === "boolean";
    const { bg: iconBg, color: iconColor } = getBooleanIconStyle(isBoolean, attr.value === true);

    return (
        <div className="flex items-center gap-3 rounded-2xl border p-3.5">
            <div
                className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
            >
                {createElement(getAttributeIcon(code), { className: `size-4 ${iconColor}` })}
            </div>
            <div className="min-w-0">
                <p className="font-medium text-sm leading-tight truncate">{label}</p>
                <p className={`text-xs ${MUTED_TEXT} mt-0.5`}>{displayValue}</p>
            </div>
        </div>
    );
}

type PetHeroSectionProps = {
    pet: PetModel;
    ageDisplay: string | null;
};

function PetStatusBadges({ pet }: { pet: PetModel }) {
    const t = useTranslations();
    return (
        <>
            {pet.sex && pet.sex !== "unknown" && (
                <Badge variant="outline" className="rounded-4xl capitalize">
                    {t(`features.pets.sex.${pet.sex}`)}
                </Badge>
            )}
            {pet.isSterilized !== null && (
                <Badge variant={pet.isSterilized ? "default" : "outline"} className="rounded-4xl">
                    {pet.isSterilized
                        ? t("features.pets.badges.sterilized")
                        : t("features.pets.badges.notSterilized")}
                </Badge>
            )}
            <Badge variant={pet.hasMicrochip ? "default" : "outline"} className="rounded-4xl">
                {pet.hasMicrochip
                    ? t("features.pets.badges.microchipped")
                    : t("features.pets.badges.noMicrochip")}
            </Badge>
        </>
    );
}

function PetHeroSection({ pet, ageDisplay }: PetHeroSectionProps) {
    const t = useTranslations();
    return (
        <div className="flex gap-4">
            <div className="flex-1 bg-muted rounded-2xl flex flex-col items-center justify-center gap-3 relative overflow-hidden min-w-40">
                <PawPrint className="size-20 text-muted-foreground/15" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
            </div>
            <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col">
                    <div className="flex gap-2 items-center">
                        <h2 className="text-3xl font-bold tracking-tight">{pet.name}</h2>
                        <div className="flex flex-wrap items-center gap-2">
                            {pet.animalType && (
                                <Badge variant="secondary" className="rounded-4xl">
                                    {pet.animalType.name}
                                </Badge>
                            )}
                            {pet.breed && (
                                <span className="text-muted-foreground text-sm">{pet.breed}</span>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <div className="flex flex-wrap gap-2 mt-3">
                            <PetStatusBadges pet={pet} />
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <StarRating value={MOCK_AVG_RATING} />
                            <span className="text-sm font-semibold">{MOCK_AVG_RATING}</span>
                            <span className="text-sm text-muted-foreground">
                                ({MOCK_REVIEWS.length})
                            </span>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {ageDisplay && (
                        <div className="bg-muted rounded-2xl p-4">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Calendar className="size-4 shrink-0" />
                                <span className="text-xs">{t("features.pets.fields.age")}</span>
                            </div>
                            <p className="font-semibold text-sm">{ageDisplay}</p>
                        </div>
                    )}
                    {pet.weight && (
                        <div className="bg-muted rounded-2xl p-4">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Weight className="size-4 shrink-0" />
                                <span className="text-xs">{t("features.pets.fields.weight")}</span>
                            </div>
                            <p className="font-semibold text-sm">{pet.weight} kg</p>
                        </div>
                    )}
                    {pet.sex && (
                        <div className="bg-muted rounded-2xl p-4">
                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <PawPrint className="size-4 shrink-0" />
                                <span className="text-xs">{t("features.pets.fields.sex")}</span>
                            </div>
                            <p className="font-semibold text-sm capitalize">
                                {t(`features.pets.sex.${pet.sex}`)}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function PetHealthSection({ pet }: { pet: PetModel }) {
    const t = useTranslations();
    const sterilizedStyle = pet.isSterilized
        ? { bg: "bg-green-100 dark:bg-green-900/30", color: "text-green-600 dark:text-green-400" }
        : { bg: "bg-muted", color: MUTED_TEXT };
    const microchipStyle = pet.hasMicrochip
        ? { bg: "bg-blue-100 dark:bg-blue-900/30", color: "text-blue-600 dark:text-blue-400" }
        : { bg: "bg-muted", color: MUTED_TEXT };

    let sterilizedValue: string;
    if (pet.isSterilized === null) {
        sterilizedValue = t("common.fields.notProvided");
    } else {
        sterilizedValue = pet.isSterilized ? t(YES_KEY) : t(NO_KEY);
    }

    const microchipValue = pet.hasMicrochip ? (pet.microchipNumber ?? t(YES_KEY)) : t(NO_KEY);

    return (
        <>
            <Separator />
            <div className="space-y-3">
                <h3 className="font-semibold text-base">{t("features.pets.profile.health")}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 rounded-2xl border p-3.5">
                        <div
                            className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${sterilizedStyle.bg}`}
                        >
                            <Scissors className={`size-4 ${sterilizedStyle.color}`} />
                        </div>
                        <div>
                            <p className="font-medium text-sm">
                                {t("features.pets.fields.sterilized")}
                            </p>
                            <p className="text-xs text-muted-foreground">{sterilizedValue}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border p-3.5">
                        <div
                            className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${microchipStyle.bg}`}
                        >
                            <Cpu className={`size-4 ${microchipStyle.color}`} />
                        </div>
                        <div className="min-w-0">
                            <p className="font-medium text-sm">
                                {t("features.pets.fields.microchip")}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {microchipValue}
                            </p>
                        </div>
                    </div>
                </div>
                {pet.healthNotes && (
                    <div className="rounded-2xl border p-4">
                        <p className="font-medium text-sm mb-1.5">
                            {t("features.pets.fields.healthNotes")}
                        </p>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            {pet.healthNotes}
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}

export function PetProfileInfo({ pet, ageDisplay }: PetProfileInfoProps) {
    const t = useTranslations();
    const hasCharacteristics = pet.attributes && pet.attributes.length > 0;

    return (
        <div className="space-y-8">
            <PetHeroSection pet={pet} ageDisplay={ageDisplay} />

            {(pet.about || pet.birthDate || pet.adoptionDate) && (
                <>
                    <Separator />
                    <div className="space-y-3">
                        <h3 className="font-semibold text-base">
                            {t("features.pets.profile.about")}
                        </h3>
                        {pet.about && (
                            <p className="text-sm leading-relaxed text-foreground/80">
                                {pet.about}
                            </p>
                        )}
                        <div className="space-y-1.5">
                            {pet.birthDate && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="size-3.5 shrink-0" />
                                    <span>
                                        {t("features.pets.fields.birthDate")}:{" "}
                                        {new Date(pet.birthDate).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                            {pet.adoptionDate && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="size-3.5 shrink-0" />
                                    <span>
                                        {t("features.pets.fields.adoptionDate")}:{" "}
                                        {new Date(pet.adoptionDate).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            <PetHealthSection pet={pet} />

            {hasCharacteristics && (
                <>
                    <Separator />
                    <div className="space-y-3">
                        <h3 className="font-semibold text-base">
                            {t("features.pets.profile.characteristics")}
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {pet.attributes!.map((attr) => (
                                <AttributeCard key={attr.id} attr={attr} />
                            ))}
                        </div>
                    </div>
                </>
            )}

            <Separator />
            <div className="space-y-3">
                <h3 className="font-semibold text-base">{t("features.pets.profile.gallery")}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="aspect-square bg-muted rounded-2xl flex items-center justify-center"
                        >
                            <Camera className="size-5 text-muted-foreground/30" />
                        </div>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground">
                    {t("features.pets.profile.photosPlaceholderDescription")}
                </p>
            </div>
        </div>
    );
}
