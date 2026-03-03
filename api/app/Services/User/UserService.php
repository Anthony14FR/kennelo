<?php

declare(strict_types=1);

namespace App\Services\User;

use App\Enums\BookingStatus;
use App\Enums\IdentityVerificationStatus;
use App\Enums\PaginationEnum;
use App\Models\Address;
use App\Models\Booking;
use App\Models\IdentityVerification;
use App\Models\User;
use App\Services\User\Exceptions\AvatarUploadException;
use App\Services\User\Exceptions\InvalidCurrentPasswordException;
use App\Services\User\Exceptions\UserHasActiveBookingsException;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Throwable;

class UserService
{
    public function getAllPaginated(array $filters = []): LengthAwarePaginator
    {
        $perPage = $filters['per_page'] ?? PaginationEnum::DEFAULT_PAGINATION->value();

        return User::with(['managedEstablishments', 'collaboratedEstablishments'])
            ->when(isset($filters['search']), function ($q) use ($filters) {
                $q->where(function ($q) use ($filters) {
                    $q->where('first_name', 'like', "%{$filters['search']}%")
                        ->orWhere('last_name', 'like', "%{$filters['search']}%")
                        ->orWhere('email', 'like', "%{$filters['search']}%");
                });
            })
            ->when(isset($filters['role']), fn ($q) => $q->role($filters['role']))
            ->when(isset($filters['sort_by']), fn ($q) => $q->orderBy($filters['sort_by'], $filters['sort_dir'] ?? 'asc'))
            ->paginate($perPage);
    }

    public function getPublicProfile(string $userId): ?User
    {
        return User::withInactive()->with(['roles', 'address'])->find($userId);
    }

    public function updateProfile(User $user, array $data): User
    {
        $updateData = array_filter($data, fn ($value) => $value !== null);

        $user->update($updateData);

        return $user->fresh(['roles']);
    }

    public function uploadAvatar(User $user, UploadedFile $avatar): User
    {
        $oldAvatarPath = $user->avatar_url;
        $newPath = null;

        try {
            $newPath = $avatar->store('avatars', 'public');

            if (! $newPath) {
                throw AvatarUploadException::storageError('Unable to store file');
            }

            DB::transaction(function () use ($user, $newPath) {
                $user->update(['avatar_url' => $newPath]);
            });

            if ($oldAvatarPath) {
                Storage::disk('public')->delete($oldAvatarPath);
            }

            return $user->fresh(['roles']);
        } catch (Throwable $e) {
            if ($newPath) {
                Storage::disk('public')->delete($newPath);
            }

            if ($e instanceof AvatarUploadException) {
                throw $e;
            }

            throw AvatarUploadException::storageError($e->getMessage());
        }
    }

    public function deleteAccount(User $user): void
    {
        $hasActiveBookings = Booking::where('user_id', $user->id)
            ->whereIn('status', [
                BookingStatus::PENDING->value,
                BookingStatus::CONFIRMED->value,
                BookingStatus::IN_PROGRESS->value,
            ])
            ->exists();

        if ($hasActiveBookings) {
            throw UserHasActiveBookingsException::cannotDeleteAccount();
        }

        $user->delete();
    }

    public function changePassword(User $user, array $data): void
    {
        if (! Hash::check($data['current_password'], $user->password)) {
            throw InvalidCurrentPasswordException::wrongPassword();
        }

        $user->update(['password' => $data['password']]);
    }

    public function changeEmail(User $user, array $data): User
    {
        if (! Hash::check($data['password'], $user->password)) {
            throw InvalidCurrentPasswordException::wrongPassword();
        }

        DB::transaction(function () use ($user, $data) {
            $user->update([
                'email' => $data['email'],
                'email_verified_at' => null,
            ]);
        });

        $user->sendEmailVerificationNotification();

        return $user->fresh(['roles']);
    }

    public function upsertAddress(User $user, array $data): User
    {
        DB::transaction(function () use ($user, $data) {
            if ($user->address_id) {
                $user->address()->update($data);
            } else {
                $address = Address::create($data);
                $user->update(['address_id' => $address->id]);
            }
        });

        return $user->fresh(['roles', 'address']);
    }

    public function deleteAddress(User $user): void
    {
        DB::transaction(function () use ($user) {
            $addressId = $user->address_id;
            $user->update(['address_id' => null]);

            if ($addressId) {
                Address::destroy($addressId);
            }
        });
    }

    public function updateStatus(User $user, array $data): User
    {
        $user->update(['status' => $data['status']]);

        return $user->fresh(['roles']);
    }

    public function assignRoles(User $user, array $data): User
    {
        $user->syncRoles($data['roles']);

        return $user->fresh(['roles']);
    }

    public function removeRole(User $user, string $role): User
    {
        $user->removeRole($role);

        return $user->fresh(['roles']);
    }

    public function getLatestIdentityVerification(User $user): ?IdentityVerification
    {
        return IdentityVerification::where('user_id', $user->id)
            ->latest()
            ->first();
    }

    public function submitIdentityVerification(User $user, UploadedFile $document): IdentityVerification
    {
        $path = $document->store('identity-verifications', 'private');

        return IdentityVerification::create([
            'user_id' => $user->id,
            'document_url' => $path,
            'status' => IdentityVerificationStatus::Pending,
        ]);
    }

    public function reviewIdentityVerification(User $user, User $reviewer, array $data): User
    {
        $verification = IdentityVerification::where('user_id', $user->id)
            ->where('status', IdentityVerificationStatus::Pending)
            ->latest()
            ->firstOrFail();

        $status = $data['status'];

        DB::transaction(function () use ($verification, $reviewer, $status, $user) {
            $verification->update([
                'status' => $status,
                'reviewer_id' => $reviewer->id,
                'reviewed_at' => Carbon::now(),
            ]);

            if ($status === IdentityVerificationStatus::Approved->value) {
                $user->update(['is_id_verified' => true]);
            }
        });

        return $user->fresh(['roles']);
    }
}
