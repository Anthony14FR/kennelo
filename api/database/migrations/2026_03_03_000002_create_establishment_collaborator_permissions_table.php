<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('establishment_collaborator_permissions', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->foreignUuid('establishment_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade');
            $table->string('permission', 100);
            $table->timestamps();

            $table->unique(['establishment_id', 'user_id', 'permission']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('establishment_collaborator_permissions');
    }
};
