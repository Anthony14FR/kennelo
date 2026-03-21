<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\IdentityVerification;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin IdentityVerification */
class IdentityVerificationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status->value,
            'reviewed_at' => $this->reviewed_at ? human_date($this->reviewed_at) : null,
            'created_at' => human_date($this->created_at),
        ];
    }
}
