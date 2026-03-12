import { api } from "@workspace/common";

export async function deletePetImage(petId: string, imageId: string): Promise<void> {
    await api.delete(`/pets/${petId}/images/${imageId}`);
}
