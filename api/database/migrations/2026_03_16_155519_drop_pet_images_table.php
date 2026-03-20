<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('pet_images');
    }

    public function down(): void
    {
        Schema::create('pet_images', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('pet_id');
            $table->foreign('pet_id')->references('id')->on('pets')->cascadeOnDelete();
            $table->string('path');
            $table->unsignedSmallInteger('order')->default(0);
            $table->index(['pet_id', 'order']);
            $table->timestamps();
        });
    }
};
