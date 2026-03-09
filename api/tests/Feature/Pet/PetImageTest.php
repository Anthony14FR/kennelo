<?php

declare(strict_types=1);

use App\Models\AnimalType;
use App\Models\Pet;
use App\Models\PetImage;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

// ─── avatar ───────────────────────────────────────────────────────────────────

it('owner can upload an avatar for their pet', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $animalType = AnimalType::create(['code' => 'dog', 'name' => 'Chien', 'category' => 'mammals']);
    $pet = Pet::create(['user_id' => $user->id, 'animal_type_id' => $animalType->id, 'name' => 'Rex']);

    $file = UploadedFile::fake()->image('avatar.jpg', 200, 200);

    $this->withHeaders(asUser($user))
        ->postJson("/api/pets/{$pet->id}/avatar", ['avatar' => $file])
        ->assertOk()
        ->assertJsonPath('data.id', $pet->id);

    Storage::disk('public')->assertExists($pet->fresh()->avatar_url);
});

it('uploading a new avatar deletes the old one', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $animalType = AnimalType::create(['code' => 'dog', 'name' => 'Chien', 'category' => 'mammals']);
    $pet = Pet::create(['user_id' => $user->id, 'animal_type_id' => $animalType->id, 'name' => 'Rex']);

    $first = UploadedFile::fake()->image('first.jpg', 200, 200);
    $this->withHeaders(asUser($user))
        ->postJson("/api/pets/{$pet->id}/avatar", ['avatar' => $first])
        ->assertOk();

    $oldPath = $pet->fresh()->avatar_url;
    Storage::disk('public')->assertExists($oldPath);

    $second = UploadedFile::fake()->image('second.jpg', 200, 200);
    $this->withHeaders(asUser($user))
        ->postJson("/api/pets/{$pet->id}/avatar", ['avatar' => $second])
        ->assertOk();

    Storage::disk('public')->assertMissing($oldPath);
    Storage::disk('public')->assertExists($pet->fresh()->avatar_url);
});

it('other user cannot upload avatar to someone else pet', function () {
    Storage::fake('public');

    $owner = User::factory()->create();
    $other = User::factory()->create();
    $animalType = AnimalType::create(['code' => 'dog', 'name' => 'Chien', 'category' => 'mammals']);
    $pet = Pet::create(['user_id' => $owner->id, 'animal_type_id' => $animalType->id, 'name' => 'Rex']);

    $file = UploadedFile::fake()->image('avatar.jpg', 200, 200);

    $this->withHeaders(asUser($other))
        ->postJson("/api/pets/{$pet->id}/avatar", ['avatar' => $file])
        ->assertForbidden();
});

it('avatar upload rejects non-image files', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $animalType = AnimalType::create(['code' => 'dog', 'name' => 'Chien', 'category' => 'mammals']);
    $pet = Pet::create(['user_id' => $user->id, 'animal_type_id' => $animalType->id, 'name' => 'Rex']);

    $file = UploadedFile::fake()->create('doc.pdf', 100, 'application/pdf');

    $this->withHeaders(asUser($user))
        ->postJson("/api/pets/{$pet->id}/avatar", ['avatar' => $file])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['avatar']);
});

// ─── images ───────────────────────────────────────────────────────────────────

it('owner can add an image to their pet', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $animalType = AnimalType::create(['code' => 'dog', 'name' => 'Chien', 'category' => 'mammals']);
    $pet = Pet::create(['user_id' => $user->id, 'animal_type_id' => $animalType->id, 'name' => 'Rex']);

    $file = UploadedFile::fake()->image('photo.jpg', 300, 300);

    $this->withHeaders(asUser($user))
        ->postJson("/api/pets/{$pet->id}/images", ['image' => $file])
        ->assertCreated()
        ->assertJsonPath('data.pet_id', $pet->id);

    expect($pet->petImages()->count())->toBe(1);
});

it('owner cannot add more than 5 images to a pet', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $animalType = AnimalType::create(['code' => 'dog', 'name' => 'Chien', 'category' => 'mammals']);
    $pet = Pet::create(['user_id' => $user->id, 'animal_type_id' => $animalType->id, 'name' => 'Rex']);

    for ($i = 1; $i <= 5; $i++) {
        PetImage::create(['pet_id' => $pet->id, 'path' => "pet-images/photo{$i}.jpg", 'order' => $i]);
    }

    $file = UploadedFile::fake()->image('sixth.jpg', 300, 300);

    $this->withHeaders(asUser($user))
        ->postJson("/api/pets/{$pet->id}/images", ['image' => $file])
        ->assertUnprocessable();
});

it('owner can list images of their pet', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $animalType = AnimalType::create(['code' => 'dog', 'name' => 'Chien', 'category' => 'mammals']);
    $pet = Pet::create(['user_id' => $user->id, 'animal_type_id' => $animalType->id, 'name' => 'Rex']);

    PetImage::create(['pet_id' => $pet->id, 'path' => 'pet-images/a.jpg', 'order' => 1]);
    PetImage::create(['pet_id' => $pet->id, 'path' => 'pet-images/b.jpg', 'order' => 2]);

    $this->withHeaders(asUser($user))
        ->getJson("/api/pets/{$pet->id}/images")
        ->assertOk()
        ->assertJsonCount(2, 'data');
});

it('owner can delete an image from their pet', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $animalType = AnimalType::create(['code' => 'dog', 'name' => 'Chien', 'category' => 'mammals']);
    $pet = Pet::create(['user_id' => $user->id, 'animal_type_id' => $animalType->id, 'name' => 'Rex']);

    Storage::disk('public')->put('pet-images/photo.jpg', 'fake content');
    $image = PetImage::create(['pet_id' => $pet->id, 'path' => 'pet-images/photo.jpg', 'order' => 1]);

    $this->withHeaders(asUser($user))
        ->deleteJson("/api/pets/{$pet->id}/images/{$image->id}")
        ->assertNoContent();

    expect(PetImage::find($image->id))->toBeNull();
    Storage::disk('public')->assertMissing('pet-images/photo.jpg');
});

it('other user cannot add images to someone else pet', function () {
    Storage::fake('public');

    $owner = User::factory()->create();
    $other = User::factory()->create();
    $animalType = AnimalType::create(['code' => 'dog', 'name' => 'Chien', 'category' => 'mammals']);
    $pet = Pet::create(['user_id' => $owner->id, 'animal_type_id' => $animalType->id, 'name' => 'Rex']);

    $file = UploadedFile::fake()->image('photo.jpg', 300, 300);

    $this->withHeaders(asUser($other))
        ->postJson("/api/pets/{$pet->id}/images", ['image' => $file])
        ->assertForbidden();
});

it('cannot delete an image that belongs to a different pet', function () {
    Storage::fake('public');

    $user = User::factory()->create();
    $animalType = AnimalType::create(['code' => 'dog', 'name' => 'Chien', 'category' => 'mammals']);
    $pet1 = Pet::create(['user_id' => $user->id, 'animal_type_id' => $animalType->id, 'name' => 'Rex']);
    $pet2 = Pet::create(['user_id' => $user->id, 'animal_type_id' => $animalType->id, 'name' => 'Bella']);

    $image = PetImage::create(['pet_id' => $pet2->id, 'path' => 'pet-images/photo.jpg', 'order' => 1]);

    $this->withHeaders(asUser($user))
        ->deleteJson("/api/pets/{$pet1->id}/images/{$image->id}")
        ->assertForbidden();
});
