<?php

namespace App\Services\Establishment;

use App\Enums\PaginationEnum;
use App\Models\Establishment;
use Illuminate\Pagination\LengthAwarePaginator;

class EstablishmentService
{
    public function getActivePaginated(array $filters = []): LengthAwarePaginator
    {
        $perPage = $filters['per_page'] ?? PaginationEnum::DEFAULT_PAGINATION->value();

        return Establishment::with(['address', 'manager', 'collaborators'])
            ->where('is_active', true)
            ->when(isset($filters['search']), fn ($q) => $q->where('name', 'like', "%{$filters['search']}%"))
            ->when(isset($filters['city']), fn ($q) => $q->whereHas('address', fn ($q) => $q->where('city', $filters['city'])))
            ->when(isset($filters['sort_by']), fn ($q) => $q->orderBy($filters['sort_by'], $filters['sort_dir'] ?? 'asc'))
            ->paginate($perPage);
    }
}
