<?php

declare(strict_types=1);

use App\Models\AnimalType;
use App\Models\Establishment;
use App\Models\EstablishmentCapacity;
use App\Models\User;

// ─── show ─────────────────────────────────────────────────────────────────────

it('manager can view the dashboard', function () {
    $manager = User::factory()->create();
    $manager->assignRole('manager');
    $establishment = Establishment::factory()->create(['manager_id' => $manager->id]);

    $this->withHeaders(asUser($manager))
        ->getJson("/api/establishments/{$establishment->id}/dashboard")
        ->assertOk()
        ->assertJsonStructure([
            'data' => [
                'summary' => ['total_capacity', 'occupied_spots', 'available_spots', 'today_status'],
                'occupancy_by_animal',
                'upcoming_bookings',
            ],
        ]);
});

it('admin can view the dashboard', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');
    $establishment = Establishment::factory()->create();

    $this->withHeaders(asUser($admin))
        ->getJson("/api/establishments/{$establishment->id}/dashboard")
        ->assertOk();
});

it('collaborator can view the dashboard without specific permission', function () {
    $manager = User::factory()->create();
    $establishment = Establishment::factory()->create(['manager_id' => $manager->id]);

    $collaborator = User::factory()->create();
    $establishment->collaborators()->attach($collaborator->id);

    $this->withHeaders(asUser($collaborator))
        ->getJson("/api/establishments/{$establishment->id}/dashboard")
        ->assertOk();
});

it('random user cannot view the dashboard', function () {
    $establishment = Establishment::factory()->create();
    $user = User::factory()->create();

    $this->withHeaders(asUser($user))
        ->getJson("/api/establishments/{$establishment->id}/dashboard")
        ->assertForbidden();
});

it('unauthenticated user cannot view the dashboard', function () {
    $establishment = Establishment::factory()->create();

    $this->getJson("/api/establishments/{$establishment->id}/dashboard")
        ->assertUnauthorized();
});

it('dashboard summary shows zero capacity when no capacities are configured', function () {
    $manager = User::factory()->create();
    $manager->assignRole('manager');
    $establishment = Establishment::factory()->create(['manager_id' => $manager->id]);

    $response = $this->withHeaders(asUser($manager))
        ->getJson("/api/establishments/{$establishment->id}/dashboard")
        ->assertOk();

    expect($response->json('data.summary.total_capacity'))->toBe(0);
    expect($response->json('data.occupancy_by_animal'))->toBeEmpty();
    expect($response->json('data.upcoming_bookings'))->toBeEmpty();
});

it('dashboard summary reflects configured capacities', function () {
    $manager = User::factory()->create();
    $manager->assignRole('manager');
    $establishment = Establishment::factory()->create(['manager_id' => $manager->id]);
    $animalType = AnimalType::create(['code' => 'dog', 'name' => 'Chien', 'category' => 'mammals']);

    EstablishmentCapacity::create([
        'establishment_id' => $establishment->id,
        'animal_type_id' => $animalType->id,
        'max_capacity' => 10,
        'price_per_night' => 25.00,
    ]);

    $response = $this->withHeaders(asUser($manager))
        ->getJson("/api/establishments/{$establishment->id}/dashboard")
        ->assertOk();

    expect($response->json('data.summary.total_capacity'))->toBe(10);
    expect($response->json('data.summary.occupied_spots'))->toBe(0);
    expect($response->json('data.summary.available_spots'))->toBe(10);
    expect($response->json('data.occupancy_by_animal'))->toHaveCount(1);
});
