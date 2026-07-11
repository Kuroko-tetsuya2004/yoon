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
        DB::table('produits')
            ->where('categorie', 'materiel')
            ->update([
                'est_disponible' => true,
                'quantite_stock' => 0
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Pas de rollback possible facilement sans mémoriser l'état précédent.
    }
};
