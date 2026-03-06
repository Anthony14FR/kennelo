<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $code
 * @property string $name
 * @property string $category
 */
class AnimalType extends Model
{
    protected $fillable = [
        'code',
        'name',
        'category',
    ];

    public function pets(): HasMany
    {
        return $this->hasMany(Pet::class);
    }

    public function attributeDefinitions(): BelongsToMany
    {
        return $this->belongsToMany(AttributeDefinition::class, 'attribute_animal_types');
    }
}
