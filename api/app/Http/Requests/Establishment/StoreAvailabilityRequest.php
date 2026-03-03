<?php

declare(strict_types=1);

namespace App\Http\Requests\Establishment;

use App\Enums\AvailabilityStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAvailabilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'start_date' => ['required', 'date', 'date_format:Y-m-d'],
            'end_date' => ['required', 'date', 'date_format:Y-m-d', 'after_or_equal:start_date'],
            'status' => ['required', Rule::enum(AvailabilityStatus::class)],
            'note' => ['nullable', 'string', 'max:255'],
        ];
    }
}
