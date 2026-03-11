"use client";

import { useEffect, useState } from "react";
import { getPet } from "@workspace/modules/pets";
import type { PetModel } from "@workspace/modules/pets";
import { useAsyncState } from "@/hooks/use-async-state";

export function usePet(id: string) {
    const [pet, setPet] = useState<PetModel | null>(null);
    const { execute, isLoading, error } = useAsyncState();

    useEffect(() => {
        void execute(async () => {
            const data = await getPet(id);
            setPet(data);
        });
    }, [id, execute]);

    return { pet, isLoading, error };
}
