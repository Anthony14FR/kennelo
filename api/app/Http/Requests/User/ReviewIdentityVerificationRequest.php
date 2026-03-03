<?php

declare(strict_types=1);

namespace App\Http\Requests\User;

use App\Enums\IdentityVerificationStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReviewIdentityVerificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::enum(IdentityVerificationStatus::class)->only([
                IdentityVerificationStatus::Approved,
                IdentityVerificationStatus::Rejected,
            ])],
        ];
    }
}
