<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Uniformisation des rôles dans la base de données
        DB::table('users')
            ->whereNotIn('role', ['administrateur', 'livreur', 'partenaire', 'client'])
            ->update(['role' => 'client']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Il n'y a pas de moyen sûr de revenir en arrière sans historique
    }
};
