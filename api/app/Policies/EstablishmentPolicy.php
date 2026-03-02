<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Establishment;
use App\Models\User;

class EstablishmentPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Establishment $establishment): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function update(User $user, Establishment $establishment): bool
    {
        return $user->hasRole('admin') || $user->id === $establishment->manager_id;
    }

    public function delete(User $user, Establishment $establishment): bool
    {
        return $user->hasRole('admin');
    }
}
