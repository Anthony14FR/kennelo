<?php

declare(strict_types=1);

namespace App\Http\Controllers\Establishment;

use App\Enums\ApiStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Establishment\StoreCapacityRequest;
use App\Http\Requests\Establishment\UpdateCapacityRequest;
use App\Http\Resources\EstablishmentCapacityResource;
use App\Models\Establishment;
use App\Models\EstablishmentCapacity;
use App\Services\Establishment\EstablishmentCapacityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class EstablishmentCapacityController extends Controller
{
    public function __construct(private EstablishmentCapacityService $service) {}

    public function index(Request $request, Establishment $establishment): JsonResponse
    {
        $this->authorize('viewCapacities', $establishment);

        $capacities = $this->service->getCapacitiesWithOccupancy($establishment, $request->query('date'));

        return EstablishmentCapacityResource::collection($capacities)
            ->additional([
                'status' => ApiStatus::SUCCESS,
                'timestamp' => human_date(Carbon::now()),
            ])
            ->response();
    }

    public function store(StoreCapacityRequest $request, Establishment $establishment): JsonResponse
    {
        $this->authorize('manageCapacities', $establishment);

        $capacity = $this->service->create($establishment, $request->validated());

        return (new EstablishmentCapacityResource($capacity))
            ->additional([
                'status' => ApiStatus::SUCCESS,
                'timestamp' => human_date(Carbon::now()),
            ])
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateCapacityRequest $request, Establishment $establishment, EstablishmentCapacity $capacity): JsonResponse
    {
        $this->authorize('manageCapacities', $establishment);

        $capacity = $this->service->update($capacity, $request->validated());

        return (new EstablishmentCapacityResource($capacity))
            ->additional([
                'status' => ApiStatus::SUCCESS,
                'timestamp' => human_date(Carbon::now()),
            ])
            ->response();
    }

    public function destroy(Establishment $establishment, EstablishmentCapacity $capacity): JsonResponse
    {
        $this->authorize('manageCapacities', $establishment);

        $this->service->delete($capacity);

        return response()->json(null, 204);
    }
}
