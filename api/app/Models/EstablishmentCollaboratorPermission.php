<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\EstablishmentPermission;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EstablishmentCollaboratorPermission extends Model
{
    protected $fillable = [
        'establishment_id',
        'user_id',
        'permission',
    ];

    protected function casts(): array
    {
        return [
            'permission' => EstablishmentPermission::class,
        ];
    }

    public function establishment(): BelongsTo
    {
        return $this->belongsTo(Establishment::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
