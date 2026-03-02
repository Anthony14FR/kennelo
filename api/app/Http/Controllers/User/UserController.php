<?php

namespace App\Http\Controllers\User;

use App\Enums\ApiStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\ListUsersRequest;
use App\Http\Requests\User\UpdateLocaleRequest;
use App\Http\Requests\User\UpdateProfileRequest;
use App\Http\Requests\User\UploadAvatarRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\User\Exceptions\AvatarUploadException;
use App\Services\User\Exceptions\UserHasActiveBookingsException;
use App\Services\User\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function __construct(
        private UserService $userService
    ) {}

    public function index(ListUsersRequest $request): JsonResponse
    {
        $this->authorize('viewAny', User::class);

        $users = $this->userService->getAllPaginated($request->validated());

        return UserResource::collection($users)
            ->additional([
                'status' => ApiStatus::SUCCESS,
                'timestamp' => human_date(Carbon::now()),
            ])
            ->response();
    }

    public function show(string $id): JsonResponse
    {
        if (! Str::isUuid($id)) {
            return response()->json([
                'message' => 'Invalid UUID format',
                'status' => ApiStatus::ERROR,
                'timestamp' => human_date(Carbon::now()),
            ], 400);
        }

        $user = $this->userService->getPublicProfile($id);

        if (! $user) {
            return response()->json([
                'message' => 'User not found',
                'status' => ApiStatus::ERROR,
                'timestamp' => human_date(Carbon::now()),
            ], 404);
        }

        $this->authorize('view', $user);

        return (new UserResource($user))
            ->additional([
                'status' => ApiStatus::SUCCESS,
                'timestamp' => human_date(Carbon::now()),
            ])
            ->response();
    }

    public function getCurrentUser(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->load('roles');

        return (new UserResource($user))
            ->additional([
                'status' => ApiStatus::SUCCESS,
                'timestamp' => human_date(Carbon::now()),
            ])
            ->response();
    }

    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        $updatedUser = $this->userService->updateProfile($user, $request->validated());

        return (new UserResource($updatedUser))
            ->additional([
                'message' => 'Profile updated successfully',
                'status' => ApiStatus::SUCCESS,
                'timestamp' => human_date(Carbon::now()),
            ])
            ->response();
    }

    public function uploadAvatar(UploadAvatarRequest $request): JsonResponse
    {
        try {
            $user = $request->user();
            $updatedUser = $this->userService->uploadAvatar($user, $request->file('avatar'));

            return (new UserResource($updatedUser))
                ->additional([
                    'message' => 'Avatar uploaded successfully',
                    'status' => ApiStatus::SUCCESS,
                    'timestamp' => human_date(Carbon::now()),
                ])
                ->response();
        } catch (AvatarUploadException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'status' => ApiStatus::ERROR,
                'timestamp' => human_date(Carbon::now()),
            ], 500);
        }
    }

    public function updateLocale(UpdateLocaleRequest $request): JsonResponse
    {
        $user = $request->user();
        $user->update(['locale' => $request->validated('locale')]);

        return response()->json([
            'success' => true,
            'locale' => $user->locale,
        ]);
    }

    public function destroy(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $this->userService->deleteAccount($user);

            return response()->json([
                'message' => 'Account deleted successfully',
                'status' => ApiStatus::SUCCESS,
                'timestamp' => human_date(Carbon::now()),
            ]);
        } catch (UserHasActiveBookingsException $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'status' => ApiStatus::ERROR,
                'timestamp' => human_date(Carbon::now()),
            ], 422);
        }
    }
}
