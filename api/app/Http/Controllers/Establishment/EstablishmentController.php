<?php

declare(strict_types=1);

namespace App\Http\Controllers\Establishment;

use App\Enums\ApiStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Establishment\ListEstablishmentsRequest;
use App\Http\Requests\Establishment\StoreEstablishmentRequest;
use App\Http\Requests\Establishment\UpdateEstablishmentRequest;
use App\Http\Resources\EstablishmentResource;
use App\Models\Establishment;
use App\Services\Establishment\EstablishmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class EstablishmentController extends Controller
{
    public function __construct(
        private EstablishmentService $establishmentService
    ) {}

    public function index(ListEstablishmentsRequest $request): JsonResponse
    {
        $this->authorize('viewAny', Establishment::class);

        $establishments = $this->establishmentService->getUserEstablishments($request->user(), $request->validated());

        return EstablishmentResource::collection($establishments)
            ->additional([
                'status' => ApiStatus::SUCCESS,
                'timestamp' => human_date(Carbon::now()),
            ])
            ->response();
    }

    public function store(StoreEstablishmentRequest $request): JsonResponse
    {
        $this->authorize('create', Establishment::class);

        $establishment = $this->establishmentService->create($request->user(), $request->validated());

        return (new EstablishmentResource($establishment))
            ->additional([
                'status' => ApiStatus::SUCCESS,
                'timestamp' => human_date(Carbon::now()),
            ])
            ->response()
            ->setStatusCode(201);
    }

    public function show(string $id): JsonResponse
    {
        $establishment = $this->establishmentService->findById($id);

        $this->authorize('view', $establishment);

        return (new EstablishmentResource($establishment))
            ->additional([
                'status' => ApiStatus::SUCCESS,
                'timestamp' => human_date(Carbon::now()),
            ])
            ->response();
    }

    public function update(UpdateEstablishmentRequest $request, Establishment $establishment): JsonResponse
    {
        $this->authorize('update', $establishment);

        $establishment = $this->establishmentService->update($establishment, $request->validated());

        return (new EstablishmentResource($establishment))
            ->additional([
                'status' => ApiStatus::SUCCESS,
                'timestamp' => human_date(Carbon::now()),
            ])
            ->response();
    }

    public function destroy(Establishment $establishment): JsonResponse
    {
        $this->authorize('delete', $establishment);

        $this->establishmentService->delete($establishment);

        return response()->json(null, 204);
    }
}
