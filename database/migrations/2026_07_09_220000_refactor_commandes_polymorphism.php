<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('commandes', function (Blueprint $table) {
            $table->nullableMorphs('commandeable');
        });

        // Migrate existing data (PostgreSQL syntax)
        DB::statement("UPDATE commandes SET commandeable_id = cg.id, commandeable_type = 'App\\\\Models\\\\CommandeGaz' FROM commande_gazs cg WHERE commandes.id = cg.commande_id");
        DB::statement("UPDATE commandes SET commandeable_id = cp.id, commandeable_type = 'App\\\\Models\\\\CommandePondereux' FROM commande_pondereuxes cp WHERE commandes.id = cp.commande_id");
        DB::statement("UPDATE commandes SET commandeable_id = cm.id, commandeable_type = 'App\\\\Models\\\\CommandeMateriel' FROM commande_materiels cm WHERE commandes.id = cm.commande_id");
        DB::statement("UPDATE commandes SET commandeable_id = ce.id, commandeable_type = 'App\\\\Models\\\\CommandeEvenementielle' FROM commande_evenementielles ce WHERE commandes.id = ce.commande_id");
    }

    public function down(): void
    {
        Schema::table('commandes', function (Blueprint $table) {
            $table->dropMorphs('commandeable');
        });
    }
};
