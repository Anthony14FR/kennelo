"use client";

import { useEffect, useState } from "react";
import { getPets } from "@workspace/modules/pets";
import type { PetModel } from "@workspace/modules/pets";
import { useAsyncState } from "@/hooks/use-async-state";

export function usePets() {
    const [pets, setPets] = useState<PetModel[]>([]);
    const { execute, isLoading, error } = useAsyncState();

    useEffect(() => {
        void execute(async () => {
            const data = await getPets();
            setPets(data);
        });
    }, [execute]);

    return { pets, isLoading, error };
}
