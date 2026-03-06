<?php

declare(strict_types=1);

namespace App\Services\Pet;

use App\Models\AnimalType;
use App\Models\AttributeDefinition;
use App\Models\Pet;
use App\Models\PetAttribute;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

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
        $pet = Pet::create([
            'user_id' => $user->id,
            ...$data,
        ]);

        return $pet->load(['animalType']);
    }

    public function update(Pet $pet, array $data): Pet
    {
        $pet->update($data);

        return $pet->fresh(['animalType']);
    }

    public function delete(Pet $pet): void
    {
        $pet->delete();
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
        $allowedIds = AttributeDefinition::whereHas('animalTypes', fn ($q) => $q->where('animal_types.id', $animalType->id))
            ->pluck('id')
            ->all();

        $errors = [];

        foreach ($attributes as $index => $item) {
            if (! in_array($item['attribute_definition_id'], $allowedIds, true)) {
                $errors["attributes.$index.attribute_definition_id"] = [
                    'The attribute definition does not belong to this animal type.',
                ];
            }
        }

        if (! empty($errors)) {
            throw ValidationException::withMessages($errors);
        }
    }

    public function syncAttributes(Pet $pet, array $attributes): void
    {
        DB::transaction(function () use ($pet, $attributes): void {
            $allValueColumns = ['value_text', 'value_integer', 'value_decimal', 'value_boolean', 'value_date'];

            foreach ($attributes as $item) {
                $definitionId = $item['attribute_definition_id'];
                $definition = AttributeDefinition::find($definitionId);
                $valueColumn = $this->resolveValueColumn($definition->value_type);

                $values = array_fill_keys($allValueColumns, null);
                $values[$valueColumn] = $item[$valueColumn] ?? null;

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
