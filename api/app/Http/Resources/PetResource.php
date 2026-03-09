<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/** @mixin \App\Models\Pet */
class PetResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'animal_type_id' => $this->animal_type_id,
            'name' => $this->name,
            'breed' => $this->breed,
            'birth_date' => $this->birth_date?->toDateString(),
            'sex' => $this->sex,
            'weight' => $this->weight,
            'is_sterilized' => $this->is_sterilized,
            'has_microchip' => $this->has_microchip,
            'microchip_number' => $this->microchip_number,
            'adoption_date' => $this->adoption_date?->toDateString(),
            'about' => $this->about,
            'avatar_url' => $this->avatar_url ? Storage::url($this->avatar_url) : null,
            'health_notes' => $this->health_notes,
            'animal_type' => new AnimalTypeResource($this->whenLoaded('animalType')),
            'attributes' => PetAttributeResource::collection($this->whenLoaded('petAttributes')),
            'images' => PetImageResource::collection($this->whenLoaded('petImages')),
            'created_at' => human_date($this->created_at),
            'updated_at' => human_date($this->updated_at),
        ];
    }
}
