import { api } from "@workspace/common";

export async function deletePet(id: string): Promise<void> {
    await api.delete(`/pets/${id}`);
}
