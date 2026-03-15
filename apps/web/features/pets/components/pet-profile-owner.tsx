"use client";

import type { ReactNode } from "react";
import { Calendar, Cpu, PawPrint, Scissors, ShieldCheck, Weight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import type { PetModel } from "@workspace/modules/pets";
import type { UserModel } from "@workspace/modules/users";

type PetProfileOwnerProps = {
    pet: PetModel;
    currentUser: UserModel | null;
    ageDisplay: string | null;
};

type RecapItem = {
    icon: ReactNode;
    label: string;
    value: string;
    highlight?: boolean;
};

function buildRecapItems(
    pet: PetModel,
    ageDisplay: string | null,
    t: (key: string) => string,
): RecapItem[] {
    const items: RecapItem[] = [];

    if (pet.animalType) {
        items.push({
            icon: <PawPrint className="size-3.5" />,
            label: t("features.pets.fields.animalType"),
            value: pet.animalType.name,
        });
    }
    if (pet.breed) {
        items.push({
            icon: <PawPrint className="size-3.5" />,
            label: t("features.pets.fields.breed"),
            value: pet.breed,
        });
    }
    if (pet.sex && pet.sex !== "unknown") {
        items.push({
            icon: <PawPrint className="size-3.5" />,
            label: t("features.pets.fields.sex"),
            value: t(`features.pets.sex.${pet.sex}`),
        });
    }
    if (ageDisplay) {
        items.push({
            icon: <Calendar className="size-3.5" />,
            label: t("features.pets.fields.age"),
            value: ageDisplay,
        });
    }
    if (pet.weight) {
        items.push({
            icon: <Weight className="size-3.5" />,
            label: t("features.pets.fields.weight"),
            value: `${pet.weight} kg`,
        });
    }
    if (pet.isSterilized !== null) {
        items.push({
            icon: <Scissors className="size-3.5" />,
            label: t("features.pets.fields.sterilized"),
            value: pet.isSterilized ? t("features.pets.values.yes") : t("features.pets.values.no"),
        });
    }
    if (pet.hasMicrochip) {
        items.push({
            icon: <Cpu className="size-3.5" />,
            label: t("features.pets.fields.microchip"),
            value: pet.microchipNumber ?? t("features.pets.badges.microchipped"),
            highlight: !!pet.microchipNumber,
        });
    }
    if (pet.adoptionDate) {
        items.push({
            icon: <Calendar className="size-3.5" />,
            label: t("features.pets.fields.adoptionDate"),
            value: new Date(pet.adoptionDate).toLocaleDateString(),
        });
    }

    return items;
}

function PetRecapCard({ pet, ageDisplay }: { pet: PetModel; ageDisplay: string | null }) {
    const t = useTranslations();
    const items = buildRecapItems(pet, ageDisplay, t);

    if (items.length === 0) return null;

    return (
        <>
            <h3 className="font-semibold text-base flex-1">
                {t("features.pets.profile.quickInfo")}
            </h3>
            <div className="rounded-2xl border bg-card overflow-hidden">
                <div className="px-4 py-3 border-b">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {t("features.pets.profile.quickInfo")}
                    </p>
                </div>
                <div className="divide-y">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between px-4 py-2.5 gap-3"
                        >
                            <div className="flex items-center gap-2 text-muted-foreground shrink-0">
                                {item.icon}
                                <span className="text-xs">{item.label}</span>
                            </div>
                            <span
                                className={`text-xs font-semibold text-end truncate max-w-36 ${
                                    item.highlight
                                        ? "font-mono text-blue-600 dark:text-blue-400"
                                        : ""
                                }`}
                            >
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

function OwnerCard({ currentUser }: { currentUser: UserModel }) {
    const t = useTranslations();

    const memberSince = new Date(currentUser.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
    });

    return (
        <>
            <h3 className="font-semibold text-base flex-1">{t("features.pets.profile.owner")}</h3>
            <div className="rounded-2xl border bg-card p-5 space-y-3">
                <div className="flex items-center gap-3">
                    <Avatar className="size-14 shrink-0">
                        {currentUser.avatarUrl && (
                            <AvatarImage
                                src={currentUser.avatarUrl}
                                alt={currentUser.getFullName()}
                            />
                        )}
                        <AvatarFallback className="text-base font-semibold">
                            {currentUser.getInitials()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <p className="font-bold text-base leading-tight truncate">
                            {currentUser.getFullName()}
                        </p>
                        {currentUser.isIdVerified && (
                            <div className="flex items-center gap-1 mt-1">
                                <ShieldCheck className="size-3.5 text-green-500 shrink-0" />
                                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                    {t("features.pets.profile.verifiedProfile")}
                                </span>
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                            {t("features.pets.profile.memberSince", { date: memberSince })}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export function PetProfileOwner({ pet, currentUser, ageDisplay }: PetProfileOwnerProps) {
    const isOwner = currentUser?.id === pet.userId;

    return (
        <div className="space-y-4">
            {isOwner && currentUser && <OwnerCard currentUser={currentUser} />}
            <PetRecapCard pet={pet} ageDisplay={ageDisplay} />
        </div>
    );
}
