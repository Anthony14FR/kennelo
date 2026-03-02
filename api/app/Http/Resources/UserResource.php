<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/** @mixin \App\Models\User */
class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'locale' => $this->locale,
            'avatar_url' => $this->avatar_url
                ? Storage::disk('public')->url($this->avatar_url)
                : null,
            'is_id_verified' => $this->is_id_verified,
            'email_verified_at' => $this->email_verified_at
                ? human_date($this->email_verified_at)
                : null,
            'roles' => $this->whenLoaded('roles', fn () => $this->getRoleNames()),
            'created_at' => human_date($this->created_at),
            'updated_at' => human_date($this->updated_at),
        ];
    }
}
