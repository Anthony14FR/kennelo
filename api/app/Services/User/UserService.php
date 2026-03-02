<?php

namespace App\Services\User;

use App\Enums\BookingStatus;
use App\Enums\PaginationEnum;
use App\Enums\UserStatus;
use App\Models\Booking;
use App\Models\User;
use App\Services\User\Exceptions\AvatarUploadException;
use App\Services\User\Exceptions\UserHasActiveBookingsException;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
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
        return User::with('roles')->find($userId);
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

        DB::transaction(function () use ($user) {
            $user->tokens()->delete();
            $user->update(['status' => UserStatus::INACTIVE]);
        });
    }
}
