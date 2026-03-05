<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}
