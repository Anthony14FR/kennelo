<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ReviewCriteriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Criteria for evaluating ESTABLISHMENTS (by users)
        $establishmentCriteria = [
            [
                'code' => 'cleanliness',
                'label' => 'Propreté',
                'applicable_to' => 'establishment',
                'sort_order' => 1,
            ],
            [
                'code' => 'communication',
                'label' => 'Communication',
                'applicable_to' => 'establishment',
                'sort_order' => 2,
            ],
            [
                'code' => 'animal_care',
                'label' => 'Soins apportés à l\'animal',
                'applicable_to' => 'establishment',
                'sort_order' => 3,
            ],
            [
                'code' => 'instructions_respect',
                'label' => 'Respect des consignes',
                'applicable_to' => 'establishment',
                'sort_order' => 4,
            ],
            [
                'code' => 'value_for_money',
                'label' => 'Rapport qualité/prix',
                'applicable_to' => 'establishment',
                'sort_order' => 5,
            ],
        ];

        // Criteria for evaluating USERS (by establishments)
        $userCriteria = [
            [
                'code' => 'info_accuracy',
                'label' => 'Exactitude des informations',
                'applicable_to' => 'user',
                'sort_order' => 1,
            ],
            [
                'code' => 'punctuality',
                'label' => 'Ponctualité',
                'applicable_to' => 'user',
                'sort_order' => 2,
            ],
            [
                'code' => 'animal_condition',
                'label' => 'État de l\'animal à l\'arrivée',
                'applicable_to' => 'user',
                'sort_order' => 3,
            ],
        ];

        $allCriteria = array_merge($establishmentCriteria, $userCriteria);

        foreach ($allCriteria as $criteria) {
            $exists = DB::table('review_criteria_definitions')->where('code', $criteria['code'])->exists();
            if ($exists) {
                DB::table('review_criteria_definitions')->where('code', $criteria['code'])->update(array_merge($criteria, [
                    'updated_at' => now(),
                ]));
            } else {
                DB::table('review_criteria_definitions')->insert(array_merge($criteria, [
                    'id' => (string) Str::uuid(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]));
            }
        }
    }
}
