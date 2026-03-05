<?php

declare(strict_types=1);

namespace App\Http\Requests\Establishment;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCapacityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'max_capacity' => ['sometimes', 'integer', 'min:1'],
            'price_per_night' => ['sometimes', 'numeric', 'min:0'],
        ];
    }
}
