"use client";

import { useTranslations } from "next-intl";
import { Card } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import type { PetModel } from "@workspace/modules/pets";
import { useNavigation } from "@/hooks/use-navigation";
import { getAge } from "@/features/pets/lib/pet-age";
import { PetCardMedia } from "@/features/pets/components/pet-card-media";
import { PetCardStats } from "@/features/pets/components/pet-card-stats";

type PetCardProps = {
    pet: PetModel;
};

export function PetCard({ pet }: PetCardProps) {
    const t = useTranslations();
    const { routes, push } = useNavigation();

    const typeCode = pet.animalType?.code?.toLowerCase() ?? "";

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
                avatarUrl={pet.avatarUrl}
                typeCode={typeCode}
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
