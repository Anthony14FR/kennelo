<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Services\MediaService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/** @mixin Media */
class PetImageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->uuid,
            'url' => $this->getUrl(MediaService::CONVERSION_WEBP),
            'order' => $this->order_column,
            'created_at' => human_date($this->created_at),
        ];
    }
}
