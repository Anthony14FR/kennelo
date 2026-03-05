<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\EstablishmentCapacity */
class EstablishmentCapacityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $occupiedSpots = $this->resource->occupied_spots ?? 0;

        return [
            'id' => $this->id,
            'animal_type' => [
                'id' => $this->animalType->id,
                'code' => $this->animalType->code,
                'name' => $this->animalType->name,
                'category' => $this->animalType->category,
            ],
            'max_capacity' => $this->max_capacity,
            'price_per_night' => $this->price_per_night,
            'occupied_spots' => $occupiedSpots,
            'available_spots' => $this->max_capacity - $occupiedSpots,
        ];
    }
}
