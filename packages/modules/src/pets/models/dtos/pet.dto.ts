import type { AnimalTypeDto } from "./animal-type.dto";
import type { PetAttributeDto } from "./pet-attribute.dto";

export type PetDto = {
    id: string;
    user_id: string;
    animal_type_id: number;
    name: string;
    breed: string | null;
    birth_date: string | null;
    sex: "male" | "female" | "unknown" | null;
    weight: number | null;
    is_sterilized: boolean | null;
    has_microchip: boolean;
    microchip_number: string | null;
    adoption_date: string | null;
    about: string | null;
    health_notes: string | null;
    animal_type?: AnimalTypeDto | null;
    attributes?: PetAttributeDto[];
    created_at: string;
    updated_at: string;
};
