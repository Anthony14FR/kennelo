"use client";

import { Plus, PawPrint } from "lucide-react";
import { useTranslations } from "next-intl";
import type React from "react";
import { Button } from "@workspace/ui/components/button";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@workspace/ui/components/empty";
import { usePets } from "@/features/pets/hooks/use-pets";
import { usePetsFilters } from "@/features/pets/hooks/use-pets-filters";
import { PetCard, PetCardSkeleton } from "@/features/pets/components/pet-card";
import { PetsFilterBar } from "@/features/pets/components/pets-filter-bar";

export default function MyPetsPage() {
    const t = useTranslations();
    const { pets, isLoading } = usePets();
    const {
        search,
        setSearch,
        typeFilter,
        setTypeFilter,
        sort,
        setSort,
        filteredPets,
        availableTypes,
        hasActiveFilters,
        clearFilters,
    } = usePetsFilters(pets);

    let petsContent: React.ReactNode;
    if (isLoading) {
        petsContent = (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <PetCardSkeleton key={i} />
                ))}
            </div>
        );
    } else if (pets.length === 0) {
        petsContent = (
            <Empty className="border">
                <EmptyMedia variant="icon">
                    <PawPrint />
                </EmptyMedia>
                <EmptyHeader>
                    <EmptyTitle>{t("features.pets.noPets")}</EmptyTitle>
                    <EmptyDescription>{t("features.pets.noPetsDescription")}</EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    } else if (filteredPets.length === 0) {
        petsContent = (
            <Empty className="border">
                <EmptyMedia variant="icon">
                    <PawPrint />
                </EmptyMedia>
                <EmptyHeader>
                    <EmptyTitle>{t("features.pets.filters.resultsCount", { count: 0 })}</EmptyTitle>
                    <EmptyDescription>{t("features.pets.noPetsDescription")}</EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    } else {
        petsContent = (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filteredPets.map((pet) => (
                    <PetCard key={pet.id} pet={pet} />
                ))}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-card">
            <div className="h-18 flex items-center">
                <div className="flex items-center justify-between w-full">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        {t("features.pets.title")}
                    </h1>
                    <Button className="rounded-4xl gap-2">
                        <Plus className="size-4" />
                        {t("features.pets.addPet")}
                    </Button>
                </div>
            </div>

            <div className="pb-6 space-y-6">
                {!isLoading && pets.length > 0 && (
                    <PetsFilterBar
                        search={search}
                        onSearchChange={setSearch}
                        typeFilter={typeFilter}
                        onTypeFilterChange={setTypeFilter}
                        sort={sort}
                        onSortChange={setSort}
                        availableTypes={availableTypes}
                        hasActiveFilters={hasActiveFilters}
                        onClearFilters={clearFilters}
                        resultsCount={filteredPets.length}
                    />
                )}
                {petsContent}
            </div>
        </div>
    );
}
