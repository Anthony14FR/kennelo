"use client";

import { useMemo, useState } from "react";
import type { PetModel } from "@workspace/modules/pets";

export type SortOption = "newest" | "name-asc" | "name-desc" | "age-youngest" | "age-oldest";

export type AvailableType = {
    id: number;
    name: string;
    code: string;
    count: number;
};

export function usePetsFilters(pets: PetModel[]) {
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<number | null>(null);
    const [sort, setSort] = useState<SortOption>("newest");

    const availableTypes = useMemo<AvailableType[]>(() => {
        const map = new Map<number, AvailableType>();
        pets.forEach((p) => {
            if (p.animalType) {
                const entry = map.get(p.animalTypeId);
                if (entry) {
                    entry.count++;
                } else {
                    map.set(p.animalTypeId, {
                        id: p.animalTypeId,
                        name: p.animalType.name,
                        code: p.animalType.code,
                        count: 1,
                    });
                }
            }
        });
        return Array.from(map.values()).sort((a, b) => b.count - a.count);
    }, [pets]);

    const filteredPets = useMemo(() => {
        let result = pets;

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) || (p.breed ?? "").toLowerCase().includes(q),
            );
        }

        if (typeFilter !== null) {
            result = result.filter((p) => p.animalTypeId === typeFilter);
        }

        return [...result].sort((a, b) => {
            switch (sort) {
                case "name-asc":
                    return a.name.localeCompare(b.name);
                case "name-desc":
                    return b.name.localeCompare(a.name);
                case "age-youngest":
                    return (b.birthDate ?? "0000").localeCompare(a.birthDate ?? "0000");
                case "age-oldest":
                    return (a.birthDate ?? "9999").localeCompare(b.birthDate ?? "9999");
                case "newest":
                default:
                    return b.createdAt.localeCompare(a.createdAt);
            }
        });
    }, [pets, search, typeFilter, sort]);

    const hasActiveFilters = search.trim() !== "" || typeFilter !== null;

    function clearFilters() {
        setSearch("");
        setTypeFilter(null);
        setSort("newest");
    }

    return {
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
    };
}
