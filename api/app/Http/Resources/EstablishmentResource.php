<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Establishment */
class EstablishmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'siret' => $this->siret,
            'description' => $this->description,
            'phone' => $this->phone,
            'email' => $this->email,
            'website' => $this->website,
            'address_id' => $this->address_id,
            'timezone' => $this->timezone,
            'is_active' => $this->is_active,
            'manager_id' => $this->manager_id,
            'address' => new AddressResource($this->whenLoaded('address')),
            'manager' => new UserResource($this->whenLoaded('manager')),
            'collaborators' => UserResource::collection($this->whenLoaded('collaborators')),
            'created_at' => human_date($this->created_at),
            'updated_at' => human_date($this->updated_at),
        ];
    }
}
