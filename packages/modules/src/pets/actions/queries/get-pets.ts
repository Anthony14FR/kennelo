import { api } from "@workspace/common";
import type { PetDto } from "../../models/dtos/pet.dto";
import { PetModel } from "../../models/pet.model";

export async function getPets(): Promise<PetModel[]> {
    const response = await api.get<PetDto[]>("/pets");

    if (!response.data) {
        return [];
    }

    return response.data.map(PetModel.from);
}
