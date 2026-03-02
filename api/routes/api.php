<?php

declare(strict_types=1);

use App\Http\Controllers\Establishment\EstablishmentController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\User\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/test', [TestController::class, 'index']);

Route::middleware(['auth.jwt'])->group(function () {
    // Establishments
    Route::apiResource('establishments', EstablishmentController::class);

    // Users (admin)
    Route::apiResource('users', UserController::class)->only(['index', 'show', 'update']);
    Route::put('/users/{id}/status', [UserController::class, 'updateStatus']);
    Route::put('/users/{id}/roles', [UserController::class, 'assignRoles']);
    Route::delete('/users/{id}/roles/{role}', [UserController::class, 'removeRole']);
    Route::put('/users/{id}/identity-verification', [UserController::class, 'reviewIdentityVerification']);
    Route::delete('/users/{id}', [UserController::class, 'adminDestroy']);

    // Current user
    Route::get('/user', [UserController::class, 'getCurrentUser']);
    Route::put('/user/locale', [UserController::class, 'updateLocale']);
    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    Route::post('/user/avatar', [UserController::class, 'uploadAvatar']);
    Route::put('/user/password', [UserController::class, 'changePassword']);
    Route::put('/user/email', [UserController::class, 'changeEmail']);
    Route::put('/user/address', [UserController::class, 'upsertAddress']);
    Route::delete('/user/address', [UserController::class, 'destroyAddress']);
    Route::get('/user/identity-verification', [UserController::class, 'getIdentityVerification']);
    Route::post('/user/identity-verification', [UserController::class, 'submitIdentityVerification']);
    Route::delete('/user', [UserController::class, 'destroy']);
});

require __DIR__.'/auth.php';
