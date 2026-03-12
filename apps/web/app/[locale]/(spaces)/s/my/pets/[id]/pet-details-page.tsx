"use client";

import { ArrowLeft, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { usePet } from "@/features/pets/hooks/use-pet";
import { PetProfileInfo } from "@/features/pets/components/pet-profile-info";
import { PetProfileOwner } from "@/features/pets/components/pet-profile-owner";
import { PetProfileReviews } from "@/features/pets/components/pet-profile-reviews";
import { useAuth } from "@/features/auth";
import { useNavigation } from "@/hooks/use-navigation";

type Query = { id: string };

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

function PetDetailsPageSkeleton() {
    return (
        <div className="min-h-screen">
            <div className="flex items-center justify-between py-4">
                <Skeleton className="size-9 rounded-4xl" />
                <Skeleton className="h-9 w-48 rounded-xl" />
            </div>
            <div className="py-6">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 space-y-6">
                        <div className="flex gap-4">
                            <Skeleton className="h-32 w-32 rounded-2xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-9 w-48 rounded-xl" />
                                <Skeleton className="h-5 w-32 rounded-xl" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-20 rounded-2xl" />
                            ))}
                        </div>
                        <Skeleton className="h-36 rounded-2xl" />
                        <Skeleton className="h-72 rounded-2xl" />
                    </div>
                    <div className="lg:w-80 shrink-0 space-y-4">
                        <Skeleton className="h-28 rounded-2xl" />
                        <Skeleton className="h-52 rounded-2xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PetDetailsPage() {
    const t = useTranslations();
    const { params, back } = useNavigation<Query>();
    const { pet, isLoading } = usePet(params.id);
    const { user } = useAuth();

    if (isLoading) {
        return <PetDetailsPageSkeleton />;
    }

    if (!pet) {
        return null;
    }

    const ageDisplay = pet.birthDate
        ? (() => {
              const { years, months } = getAge(pet.birthDate);
              if (years >= 1) return t("features.pets.age.years", { count: years });
              return t("features.pets.age.months", { count: months });
          })()
        : null;

    return (
        <div className="min-h-screen bg-card">
            <div className="flex justify-between items-center py-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-4xl shrink-0"
                        onClick={back}
                    >
                        <ArrowLeft className="size-4" />
                    </Button>
                    {/* <h1 className="text-xl font-semibold truncate">{pet.name}</h1> */}
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                        <Share2 className="size-4" />
                    </Button>
                    {user?.id === pet.userId && <Button>Modifier le profil</Button>}
                </div>
            </div>

            <div className="pb-6">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 min-w-0 space-y-8">
                        <PetProfileInfo pet={pet} ageDisplay={ageDisplay} />
                        <PetProfileReviews />
                    </div>

                    <div className="lg:w-80 shrink-0">
                        <div className="lg:sticky lg:top-22">
                            <PetProfileOwner pet={pet} currentUser={user} ageDisplay={ageDisplay} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
