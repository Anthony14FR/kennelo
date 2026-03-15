import { api } from "@workspace/common";
import type { PetDto } from "../../models/dtos/pet.dto";
import { PetModel } from "../../models/pet.model";

export async function getPet(id: string): Promise<PetModel> {
    const response = await api.get<PetDto>(`/pets/${id}`);

    if (!response.data) {
        throw new Error("Pet not found");
    }

    return PetModel.from(response.data);
}
