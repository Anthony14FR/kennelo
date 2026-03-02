<?php

declare(strict_types=1);

namespace App\Http\Controllers\Establishment;

use App\Enums\ApiStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Establishment\ListEstablishmentsRequest;
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

        $establishments = $this->establishmentService->getActivePaginated($request->validated());

        return EstablishmentResource::collection($establishments)
            ->additional([
                'status' => ApiStatus::SUCCESS,
                'timestamp' => human_date(Carbon::now()),
            ])
            ->response();
    }
}
