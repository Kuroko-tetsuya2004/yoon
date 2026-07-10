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
        Schema::table('commande_gazs', function (Blueprint $table) {
            $table->boolean('contenant_recupere')->default(false)->after('contenant_vide');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('commande_gazs', function (Blueprint $table) {
            $table->dropColumn('contenant_recupere');
        });
    }
};
