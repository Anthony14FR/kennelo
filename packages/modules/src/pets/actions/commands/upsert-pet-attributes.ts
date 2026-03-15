import { api } from "@workspace/common";
import type { PetAttributeDto } from "../../models/dtos/pet-attribute.dto";
import { PetAttributeModel } from "../../models/pet-attribute.model";
import type { UpsertPetAttributesInput } from "../../validators/upsert-pet-attributes.schema";

export async function upsertPetAttributes(
    petId: string,
    input: UpsertPetAttributesInput,
): Promise<PetAttributeModel[]> {
    const response = await api.put<PetAttributeDto[]>(`/pets/${petId}/attributes`, {
        attributes: input.attributes.map((attr) => ({
            attribute_definition_id: attr.attributeDefinitionId,
            attribute_option_id: attr.attributeOptionId,
            value_text: attr.valueText,
            value_integer: attr.valueInteger,
            value_decimal: attr.valueDecimal,
            value_boolean: attr.valueBoolean,
            value_date: attr.valueDate,
        })),
    });

    if (!response.data) {
        return [];
    }

    return response.data.map(PetAttributeModel.from);
}
