<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pet_images', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pet_id')->constrained()->onDelete('cascade');
            $table->string('path');
            $table->unsignedSmallInteger('order')->default(0);
            $table->timestamps();

            $table->index(['pet_id', 'order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pet_images');
    }
};
