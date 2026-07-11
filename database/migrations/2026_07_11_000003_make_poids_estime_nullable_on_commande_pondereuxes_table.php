<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('commande_pondereuxes', function (Blueprint $table) {
            $table->decimal('poids_estime', 8, 2)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('commande_pondereuxes', function (Blueprint $table) {
            $table->decimal('poids_estime', 8, 2)->nullable(false)->change();
        });
    }
};
