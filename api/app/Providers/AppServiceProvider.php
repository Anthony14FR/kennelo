<?php

declare(strict_types=1);

namespace App\Providers;

use App\Models\Establishment;
use App\Models\User;
use App\Policies\EstablishmentPolicy;
use App\Policies\UserPolicy;
use App\Services\JWTService;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(JWTService::class, function ($app) {
            return new JWTService;
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(User::class, UserPolicy::class);
        Gate::policy(Establishment::class, EstablishmentPolicy::class);

        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url')."/password-reset/$token?email={$notifiable->getEmailForPasswordReset()}";
        });

        Auth::extend('jwt', function ($app, $name, array $config) {
            return new \Illuminate\Auth\TokenGuard(
                Auth::createUserProvider($config['provider']),
                $app->request,
                'token'
            );
        });
    }
}
