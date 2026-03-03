<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\AvailabilityStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property \Carbon\Carbon $date
 * @property AvailabilityStatus $status
 * @property-read Establishment $establishment
 */
class EstablishmentAvailability extends Model
{
    protected $fillable = [
        'establishment_id',
        'date',
        'status',
        'note',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'status' => AvailabilityStatus::class,
        ];
    }

    public function establishment(): BelongsTo
    {
        return $this->belongsTo(Establishment::class);
    }
}
