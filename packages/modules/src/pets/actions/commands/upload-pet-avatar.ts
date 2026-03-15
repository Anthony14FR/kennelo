import { api } from "@workspace/common";
import type { PetDto } from "../../models/dtos/pet.dto";
import { PetModel } from "../../models/pet.model";

export async function uploadPetAvatar(petId: string, avatar: File): Promise<PetModel> {
    const formData = new FormData();
    formData.append("avatar", avatar);
    const response = await api.post<PetDto>(`/pets/${petId}/avatar`, formData);
    if (!response.data) throw new Error("Failed to upload avatar");
    return PetModel.from(response.data);
}
