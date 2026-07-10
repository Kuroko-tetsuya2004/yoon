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
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('rappel_actif')->default(false);
            $table->integer('frequence_rappel_jours')->nullable();
            $table->date('prochain_rappel_date')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['rappel_actif', 'frequence_rappel_jours', 'prochain_rappel_date']);
        });
    }
};
