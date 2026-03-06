<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\AttributeDefinition */
class AttributeDefinitionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'label' => $this->label,
            'value_type' => $this->value_type,
            'has_predefined_options' => $this->has_predefined_options,
            'is_required' => $this->is_required,
            'options' => $this->has_predefined_options
                ? AttributeOptionResource::collection($this->whenLoaded('options'))
                : null,
        ];
    }
}
