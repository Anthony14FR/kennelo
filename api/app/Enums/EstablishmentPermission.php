<?php

declare(strict_types=1);

namespace App\Enums;

enum EstablishmentPermission: string
{
    case UPDATE_ESTABLISHMENT = 'update_establishment';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
