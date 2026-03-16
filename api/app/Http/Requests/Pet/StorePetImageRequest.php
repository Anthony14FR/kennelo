<?php

declare(strict_types=1);

namespace App\Http\Requests\Pet;

use App\Models\Pet;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

class StorePetImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        $pet = $this->route('pet');

        if ($pet instanceof Pet && $pet->petImages()->count() >= 5) {
            throw ValidationException::withMessages([
                'image' => ['This pet has reached the maximum number of images (5).'],
            ]);
        }

        return true;
    }

    public function rules(): array
    {
        return [
            'image' => [
                'required',
                'image',
                'mimetypes:image/jpeg,image/png,image/gif,image/webp',
                'max:5120',
            ],
        ];
    }
}
