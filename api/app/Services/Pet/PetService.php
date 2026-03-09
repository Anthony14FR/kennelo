<?php

declare(strict_types=1);

namespace App\Services\Pet;

use App\Models\AnimalType;
use App\Models\AttributeDefinition;
use App\Models\Pet;
use App\Models\PetAttribute;
use App\Models\PetImage;
use App\Models\User;
use App\Services\User\Exceptions\AvatarUploadException;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Throwable;

class PetService
{
    public function getUserPets(User $user, array $filters = []): LengthAwarePaginator
    {
        $perPage = $filters['per_page'] ?? 15;

        return Pet::with(['animalType'])
            ->forUser((string) $user->id)
            ->latest()
            ->paginate($perPage);
    }

    public function findById(int $id): Pet
    {
        return Pet::with(['animalType', 'petAttributes.attributeDefinition', 'petAttributes.attributeOption'])->findOrFail($id);
    }

    public function create(User $user, array $data): Pet
    {
        return tap(Pet::create([...$data, 'user_id' => $user->id]))->load(['animalType']);
    }

    public function update(Pet $pet, array $data): Pet
    {
        return tap($pet, fn (Pet $p) => $p->update($data))->fresh(['animalType']);
    }

    public function delete(Pet $pet): void
    {
        $pet->delete();
    }

    public function uploadAvatar(Pet $pet, UploadedFile $avatar): Pet
    {
        $oldAvatarPath = $pet->avatar_url;
        $newPath = null;

        try {
            $newPath = $avatar->store('pet-avatars', 'public');

            if (! $newPath) {
                throw AvatarUploadException::storageError('Unable to store file');
            }

            DB::transaction(function () use ($pet, $newPath) {
                $pet->update(['avatar_url' => $newPath]);
            });

            if ($oldAvatarPath) {
                Storage::disk('public')->delete($oldAvatarPath);
            }

            return $pet->fresh(['animalType', 'petImages']);
        } catch (Throwable $e) {
            if ($newPath) {
                Storage::disk('public')->delete($newPath);
            }

            if ($e instanceof AvatarUploadException) {
                throw $e;
            }

            throw AvatarUploadException::storageError($e->getMessage());
        }
    }

    public function addImage(Pet $pet, UploadedFile $image): PetImage
    {
        $path = $image->store('pet-images', 'public');

        if (! $path) {
            throw AvatarUploadException::storageError('Unable to store file');
        }

        try {
            $order = $pet->petImages()->max('order') + 1;

            return PetImage::create([
                'pet_id' => $pet->id,
                'path' => $path,
                'order' => $order,
            ]);
        } catch (Throwable $e) {
            Storage::disk('public')->delete($path);
            throw AvatarUploadException::storageError($e->getMessage());
        }
    }

    public function deleteImage(Pet $pet, PetImage $petImage): void
    {
        Storage::disk('public')->delete($petImage->path);
        $petImage->delete();
    }

    public function getAttributesForAnimalType(AnimalType $animalType): Collection
    {
        return AttributeDefinition::whereHas('animalTypes', fn ($q) => $q->where('animal_types.id', $animalType->id))
            ->with('options')
            ->get();
    }

    public function resolveValueColumn(string $valueType): string
    {
        return match ($valueType) {
            'integer' => 'value_integer',
            'decimal' => 'value_decimal',
            'boolean' => 'value_boolean',
            'date' => 'value_date',
            default => 'value_text',
        };
    }

    public function validateAttributesForAnimalType(array $attributes, AnimalType $animalType): void
    {
        $definitions = AttributeDefinition::whereHas('animalTypes', fn ($q) => $q->where('animal_types.id', $animalType->id))
            ->get()
            ->keyBy('id');

        $errors = [];

        foreach ($attributes as $index => $item) {
            $definitionId = $item['attribute_definition_id'];

            if (! $definitions->has($definitionId)) {
                $errors["attributes.$index.attribute_definition_id"] = [
                    'The attribute definition does not belong to this animal type.',
                ];

                continue;
            }

            $expectedColumn = $this->resolveValueColumn($definitions->get($definitionId)->value_type);
            $valueFields = ['value_text', 'value_integer', 'value_decimal', 'value_boolean', 'value_date'];
            $providedColumns = array_values(array_filter($valueFields, fn (string $f) => array_key_exists($f, $item) && $item[$f] !== null));

            if (count($providedColumns) === 1 && $providedColumns[0] !== $expectedColumn) {
                $errors["attributes.$index.{$providedColumns[0]}"] = [
                    'The provided value field does not match the attribute definition type.',
                ];
            }
        }

        throw_if(! empty($errors), ValidationException::withMessages($errors));
    }

    public function syncAttributes(Pet $pet, array $attributes): void
    {
        DB::transaction(function () use ($pet, $attributes): void {
            $allValueColumns = ['value_text', 'value_integer', 'value_decimal', 'value_boolean', 'value_date'];

            $definitionIds = array_column($attributes, 'attribute_definition_id');
            $definitions = AttributeDefinition::whereIn('id', $definitionIds)->get()->keyBy('id');

            foreach ($attributes as $item) {
                $definitionId = $item['attribute_definition_id'];
                $valueColumn = $this->resolveValueColumn($definitions->get($definitionId)->value_type);

                $values = array_fill_keys($allValueColumns, null);
                $values[$valueColumn] = Arr::get($item, $valueColumn);

                PetAttribute::updateOrCreate(
                    [
                        'pet_id' => $pet->id,
                        'attribute_definition_id' => $definitionId,
                    ],
                    [
                        'attribute_option_id' => $item['attribute_option_id'] ?? null,
                        ...$values,
                    ]
                );
            }
        });
    }
}
