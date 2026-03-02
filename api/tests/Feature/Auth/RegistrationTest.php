<?php

declare(strict_types=1);

use App\Models\User;

test('new users can register', function () {
    $response = $this->post('/api/register', [
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertCreated()
        ->assertJsonStructure([
            'access_token',
            'refresh_token',
            'token_type',
            'expires_in',
            'user' => ['id', 'first_name', 'last_name', 'email'],
        ]);
});

test('registration fails with duplicate email', function () {
    User::factory()->create(['email' => 'taken@example.com']);

    $response = $this->post('/api/register', [
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'taken@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['email']);
});

test('registration fails with missing required fields', function () {
    $response = $this->post('/api/register', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['first_name', 'last_name', 'email', 'password']);
});

test('registration fails with password confirmation mismatch', function () {
    $response = $this->post('/api/register', [
        'first_name' => 'Test',
        'last_name' => 'User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'different',
    ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['password']);
});
