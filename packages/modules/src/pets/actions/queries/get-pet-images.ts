import { api } from "@workspace/common";
import type { PetImageDto } from "../../models/dtos/pet-image.dto";
import { PetImageModel } from "../../models/pet-image.model";

export async function getPetImages(petId: string): Promise<PetImageModel[]> {
    const response = await api.get<PetImageDto[]>(`/pets/${petId}/images`);
    if (!response.data) return [];
    return response.data.map(PetImageModel.from);
}
