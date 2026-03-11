"use client";

import Image from "next/image";
import { PawPrint } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import type { PetModel } from "@workspace/modules/pets";
import { useNavigation } from "@/hooks/use-navigation";

type PetCardProps = {
    pet: PetModel;
};

const ILLUSTRATED_TYPES = ["dog", "cat", "bird", "reptile"] as const;
type IllustratedType = (typeof ILLUSTRATED_TYPES)[number];

function isIllustratedType(code: string): code is IllustratedType {
    return ILLUSTRATED_TYPES.includes(code as IllustratedType);
}

function getAge(birthDate: string): { years: number; months: number } {
    const birth = new Date(birthDate);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    if (months < 0) {
        years--;
        months += 12;
    }
    return { years, months };
}

type PetCardMediaProps = {
    typeCode: string;
    hasIllustration: boolean;
    animalType: PetModel["animalType"];
    ageDisplay: string | null;
    sex: PetModel["sex"];
};

function PetCardMedia({
    typeCode,
    hasIllustration,
    animalType,
    ageDisplay,
    sex,
}: PetCardMediaProps) {
    const t = useTranslations();
    return (
        <div className="relative aspect-[4/3] bg-muted flex items-center justify-center overflow-hidden">
            {hasIllustration ? (
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

function PetCardStats({ pet }: { pet: PetModel }) {
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

export function PetCard({ pet }: PetCardProps) {
    const t = useTranslations();
    const { routes, push } = useNavigation();

    const typeCode = pet.animalType?.code?.toLowerCase() ?? "";
    const hasIllustration = isIllustratedType(typeCode);

    const ageDisplay = pet.birthDate
        ? (() => {
              const { years, months } = getAge(pet.birthDate);
              if (years >= 1) return t("features.pets.age.years", { count: years });
              return t("features.pets.age.months", { count: months });
          })()
        : null;

    return (
        <Card
            data-slot="pet-card"
            className="cursor-pointer hover:shadow-md transition-all overflow-hidden rounded-2xl group py-0 gap-0"
            onClick={() => push(routes.PetDetails({ id: pet.id }))}
        >
            <PetCardMedia
                typeCode={typeCode}
                hasIllustration={hasIllustration}
                animalType={pet.animalType}
                ageDisplay={ageDisplay}
                sex={pet.sex}
            />
            <PetCardStats pet={pet} />
        </Card>
    );
}

export function PetCardSkeleton() {
    return (
        <div className="rounded-2xl overflow-hidden border bg-card">
            <Skeleton className="aspect-[4/3] w-full rounded-none" />
            <div className="p-3.5 space-y-2">
                <div className="space-y-1.5">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
                <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-10" />
                    <div className="flex gap-1.5">
                        <Skeleton className="size-2 rounded-full" />
                        <Skeleton className="size-2 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
