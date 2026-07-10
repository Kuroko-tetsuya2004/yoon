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
        Schema::create('commandes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('repere_id')->constrained('reperes')->onDelete('cascade');
            $table->string('statut')->default('en_attente'); // en_attente, confirmee, en_livraison, livree, annulee
            $table->decimal('montant_total', 10, 2);
            $table->string('creneau');
            $table->string('mode_paiement'); // wave, orange_money, especes
            $table->string('statut_paiement')->default('en_attente'); // en_attente, paye
            $table->string('type_commande'); // gaz, pondereux
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commandes');
    }
};
