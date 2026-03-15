import type { AttributeOptionDto } from "./dtos/attribute-option.dto";

export class AttributeOptionModel {
    private constructor(
        public readonly id: number,
        public readonly value: string,
        public readonly label: string,
        public readonly sortOrder: number,
    ) {}

    static from(dto: AttributeOptionDto): AttributeOptionModel {
        return new AttributeOptionModel(dto.id, dto.value, dto.label, dto.sort_order);
    }
}
