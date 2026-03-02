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
    Route::apiResource('users', UserController::class);

    // Current user
    Route::get('/user', [UserController::class, 'getCurrentUser']);
    Route::put('/user/locale', [UserController::class, 'updateLocale']);
});

require __DIR__.'/auth.php';
