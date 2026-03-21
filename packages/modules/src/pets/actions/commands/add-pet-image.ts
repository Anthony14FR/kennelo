import { api } from "@workspace/common";
import type { PetImageDto } from "../../models/dtos/pet-image.dto";
import { PetImageModel } from "../../models/pet-image.model";

export async function addPetImage(petId: string, image: File): Promise<PetImageModel> {
    const formData = new FormData();
    formData.append("image", image);
    const response = await api.post<PetImageDto>(`/pets/${petId}/images`, formData);
    if (!response.data) throw new Error("Failed to upload image");
    return PetImageModel.from(response.data);
}
