"use client";

import {
    CheckCircle2,
    Cpu,
    HeartPulse,
    PawPrint,
    Scissors,
    Syringe,
    Tag,
    UtensilsCrossed,
    XCircle,
    Zap,
} from "lucide-react";
import { createElement, type ElementType } from "react";
import { useTranslations } from "next-intl";
import type { PetAttributeModel } from "@workspace/modules/pets";

const ATTRIBUTE_ICON_MAP: Record<string, ElementType> = {
    vaccinated: Syringe,
    is_vaccinated: Syringe,
    sterilized: Scissors,
    is_sterilized: Scissors,
    microchipped: Cpu,
    has_microchip: Cpu,
    friendly_with_animals: HeartPulse,
    friendly_animals: HeartPulse,
    sociable_animals: HeartPulse,
    friendly_with_children: PawPrint,
    friendly_children: PawPrint,
    sociable_children: PawPrint,
    friendly_with_strangers: PawPrint,
    friendly_strangers: PawPrint,
    sociable_strangers: PawPrint,
    energy_level: Zap,
    diet: UtensilsCrossed,
    feeding: UtensilsCrossed,
    food: UtensilsCrossed,
    alimentation: UtensilsCrossed,
};

function getAttributeIcon(code: string): ElementType {
    return ATTRIBUTE_ICON_MAP[code.toLowerCase()] ?? Tag;
}

function getAttrDisplayValue(attr: PetAttributeModel, yesText: string, noText: string): string {
    if (attr.attributeOption?.label) return attr.attributeOption.label;
    if (typeof attr.value === "boolean") return attr.value ? yesText : noText;
    return String(attr.value ?? "—");
}

type PetAttributeCardProps = {
    attr: PetAttributeModel;
};

export function PetAttributeBehaviorCard({ attr }: PetAttributeCardProps) {
    const t = useTranslations();
    const code = attr.attributeDefinition?.code ?? "";
    const label = attr.attributeDefinition?.label ?? `#${attr.attributeDefinitionId}`;
    const isTrue = attr.value === true;
    const isFalse = attr.value === false;

    return (
        <div className="flex items-center gap-3 rounded-2xl border p-3.5">
            <div className="size-8 rounded-xl bg-muted flex items-center justify-center shrink-0">
                {createElement(getAttributeIcon(code), {
                    className: "size-4 text-muted-foreground",
                })}
            </div>
            <p className="font-medium text-sm leading-tight flex-1 min-w-0 truncate">{label}</p>
            {isTrue && <CheckCircle2 className="size-5 text-green-500 shrink-0" />}
            {isFalse && <XCircle className="size-5 text-red-400 shrink-0" />}
            {!isTrue && !isFalse && (
                <span className="text-xs text-muted-foreground shrink-0">
                    {getAttrDisplayValue(
                        attr,
                        t("features.pets.values.yes"),
                        t("features.pets.values.no"),
                    )}
                </span>
            )}
        </div>
    );
}

export function PetAttributeCareCard({ attr }: PetAttributeCardProps) {
    const t = useTranslations();
    const code = attr.attributeDefinition?.code ?? "";
    const label = attr.attributeDefinition?.label ?? `#${attr.attributeDefinitionId}`;
    const displayValue = getAttrDisplayValue(
        attr,
        t("features.pets.values.yes"),
        t("features.pets.values.no"),
    );

    return (
        <div className="flex items-start gap-3 rounded-2xl border p-3.5">
            <div className="size-8 rounded-xl bg-muted flex items-center justify-center shrink-0 mt-0.5">
                {createElement(getAttributeIcon(code), {
                    className: "size-4 text-muted-foreground",
                })}
            </div>
            <div className="min-w-0">
                <p className="font-medium text-sm leading-tight">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{displayValue}</p>
            </div>
        </div>
    );
}
