<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pet;

use App\Enums\ApiStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Pet\StorePetImageRequest;
use App\Http\Requests\Pet\UploadPetAvatarRequest;
use App\Http\Resources\PetImageResource;
use App\Http\Resources\PetResource;
use App\Models\Pet;
use App\Models\PetImage;
use App\Services\Pet\PetService;
use App\Services\User\Exceptions\AvatarUploadException;
use Illuminate\Http\JsonResponse;

/**
 * @tags Pets
 */
class PetImageController extends Controller
{
    public function __construct(
        private PetService $petService
    ) {}

    public function uploadAvatar(UploadPetAvatarRequest $request, Pet $pet): JsonResponse
    {
        $this->authorize('update', $pet);

        try {
            $pet = $this->petService->uploadAvatar($pet, $request->file('avatar'));

            return (new PetResource($pet))
                ->additional([
                    'message' => 'Avatar uploaded successfully',
                    'status' => ApiStatus::SUCCESS,
                    'timestamp' => human_date(now()),
                ])
                ->response();
        } catch (AvatarUploadException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'status' => ApiStatus::ERROR,
                'timestamp' => human_date(now()),
            ], 500);
        }
    }

    public function index(Pet $pet): JsonResponse
    {
        $this->authorize('view', $pet);

        $images = $pet->petImages()->get();

        return PetImageResource::collection($images)
            ->additional([
                'status' => ApiStatus::SUCCESS,
                'timestamp' => human_date(now()),
            ])
            ->response();
    }

    public function store(StorePetImageRequest $request, Pet $pet): JsonResponse
    {
        $this->authorize('update', $pet);

        try {
            $image = $this->petService->addImage($pet, $request->file('image'));

            return (new PetImageResource($image))
                ->additional([
                    'message' => 'Image added successfully',
                    'status' => ApiStatus::SUCCESS,
                    'timestamp' => human_date(now()),
                ])
                ->response()
                ->setStatusCode(201);
        } catch (AvatarUploadException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'status' => ApiStatus::ERROR,
                'timestamp' => human_date(now()),
            ], 500);
        }
    }

    public function destroy(Pet $pet, PetImage $petImage): JsonResponse
    {
        $this->authorize('update', $pet);

        if ($petImage->pet_id !== $pet->id) {
            return response()->json([
                'message' => 'Image does not belong to this pet',
                'status' => ApiStatus::ERROR,
                'timestamp' => human_date(now()),
            ], 403);
        }

        $this->petService->deleteImage($pet, $petImage);

        return response()->json(null, 204);
    }
}
