import type { AttributeOptionDto } from "./attribute-option.dto";

export type AttributeDefinitionDto = {
    id: number;
    code: string;
    label: string;
    value_type: string;
    has_predefined_options: boolean;
    is_required: boolean;
    options: AttributeOptionDto[] | null;
};
