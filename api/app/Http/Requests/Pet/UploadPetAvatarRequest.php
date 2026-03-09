<?php

declare(strict_types=1);

namespace App\Http\Requests\Pet;

use Illuminate\Foundation\Http\FormRequest;

class UploadPetAvatarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'avatar' => [
                'required',
                'image',
                'mimetypes:image/jpeg,image/png,image/gif',
                'max:2048',
                'dimensions:min_width=100,min_height=100,max_width=2000,max_height=2000',
            ],
        ];
    }
}
