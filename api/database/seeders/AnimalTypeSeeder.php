<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\AnimalType;
use Illuminate\Database\Seeder;

class AnimalTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $animalTypes = [
            ['code' => 'dog', 'name' => 'Chien', 'category' => 'mammals'],
            ['code' => 'cat', 'name' => 'Chat', 'category' => 'mammals'],
            ['code' => 'rabbit', 'name' => 'Lapin', 'category' => 'small_mammals'],
            ['code' => 'hamster', 'name' => 'Hamster', 'category' => 'small_mammals'],
            ['code' => 'guinea_pig', 'name' => 'Cochon d\'Inde', 'category' => 'small_mammals'],
            ['code' => 'chinchilla', 'name' => 'Chinchilla', 'category' => 'small_mammals'],
            ['code' => 'ferret', 'name' => 'Furet', 'category' => 'small_mammals'],
            ['code' => 'bird', 'name' => 'Oiseau', 'category' => 'birds'],
            ['code' => 'fish', 'name' => 'Poisson', 'category' => 'fish'],
            ['code' => 'reptile', 'name' => 'Reptile', 'category' => 'reptiles'],
            ['code' => 'amphibian', 'name' => 'Amphibien', 'category' => 'amphibians'],
            ['code' => 'spider', 'name' => 'Araignée', 'category' => 'invertebrates'],
        ];

        foreach ($animalTypes as $animalType) {
            AnimalType::updateOrCreate(
                ['code' => $animalType['code']],
                $animalType
            );
        }
    }
}
