<?php

declare(strict_types=1);

use App\Enums\ApiStatus;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Carbon;
use Illuminate\Validation\ValidationException;
use Sentry\Laravel\Integration;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {

        $middleware->api([
            \Illuminate\Http\Middleware\HandleCors::class,
            \App\Http\Middleware\SetLocale::class,
        ]);

        $middleware->alias([
            'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'auth.jwt' => \App\Http\Middleware\AuthenticateJWT::class,
        ]);

    })
    ->withExceptions(function (Exceptions $exceptions): void {
        Integration::handles($exceptions);

        $exceptions->render(function (Throwable $e, $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            $timestamp = human_date(Carbon::now());

            if ($e instanceof ValidationException) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $e->errors(),
                    'status' => ApiStatus::ERROR,
                    'timestamp' => $timestamp,
                ], 422);
            }

            if ($e instanceof AuthenticationException) {
                return response()->json([
                    'message' => 'Unauthenticated.',
                    'status' => ApiStatus::ERROR,
                    'timestamp' => $timestamp,
                ], 401);
            }

            if ($e instanceof AuthorizationException || ($e instanceof HttpException && $e->getStatusCode() === 403)) {
                return response()->json([
                    'message' => 'This action is unauthorized.',
                    'status' => ApiStatus::ERROR,
                    'timestamp' => $timestamp,
                ], 403);
            }

            if ($e instanceof ModelNotFoundException || $e instanceof NotFoundHttpException) {
                return response()->json([
                    'message' => 'Resource not found.',
                    'status' => ApiStatus::ERROR,
                    'timestamp' => $timestamp,
                ], 404);
            }

            if ($e instanceof MethodNotAllowedHttpException) {
                return response()->json([
                    'message' => 'Method not allowed.',
                    'status' => ApiStatus::ERROR,
                    'timestamp' => $timestamp,
                ], 405);
            }

            if ($e instanceof HttpException && $e->getStatusCode() < 500) {
                return response()->json([
                    'message' => $e->getMessage() ?: 'Request failed.',
                    'status' => ApiStatus::ERROR,
                    'timestamp' => $timestamp,
                ], $e->getStatusCode());
            }

            return response()->json([
                'message' => 'Server error.',
                'status' => ApiStatus::ERROR,
                'timestamp' => $timestamp,
            ], 500);
        });
    })->create();
