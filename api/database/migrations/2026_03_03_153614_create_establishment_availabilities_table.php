<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('establishment_availabilities', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('establishment_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->string('status', 10)->default('open');
            $table->string('note')->nullable();
            $table->timestamps();

            $table->unique(['establishment_id', 'date']);
            $table->index('establishment_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('establishment_availabilities');
    }
};
