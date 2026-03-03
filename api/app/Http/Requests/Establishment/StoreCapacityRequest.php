<?php

declare(strict_types=1);

namespace App\Http\Requests\Establishment;

use Illuminate\Foundation\Http\FormRequest;

class StoreCapacityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'animal_type_id' => ['required', 'integer', 'exists:animal_types,id'],
            'max_capacity' => ['required', 'integer', 'min:1'],
            'price_per_night' => ['required', 'numeric', 'min:0'],
        ];
    }
}
