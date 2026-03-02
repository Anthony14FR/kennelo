<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttributeDefinition extends Model
{
    protected $fillable = [
        'code',
        'label',
        'value_type',
        'has_predefined_options',
        'validation_rules',
        'display_order',
    ];

    protected $casts = [
        'has_predefined_options' => 'boolean',
        'display_order' => 'integer',
    ];
}
