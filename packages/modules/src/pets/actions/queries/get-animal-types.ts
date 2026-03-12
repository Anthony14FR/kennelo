import { api } from "@workspace/common";
import type { AnimalTypeDto } from "../../models/dtos/animal-type.dto";
import { AnimalTypeModel } from "../../models/animal-type.model";

export async function getAnimalTypes(): Promise<AnimalTypeModel[]> {
    const response = await api.get<AnimalTypeDto[]>("/animal-types");

    if (!response.data) {
        return [];
    }

    return response.data.map(AnimalTypeModel.from);
}
