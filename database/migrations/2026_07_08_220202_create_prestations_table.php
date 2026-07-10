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
        Schema::create('prestations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commande_evenementielle_id')->constrained()->onDelete('cascade');
            $table->foreignId('produit_id')->constrained()->onDelete('cascade'); // The rented material
            $table->foreignId('partenaire_id')->constrained('users')->onDelete('cascade'); // The owner
            $table->integer('quantite');
            $table->decimal('prix_unitaire', 10, 2);
            $table->decimal('caution', 10, 2)->default(0);
            $table->string('statut')->default('en_attente'); // en_attente, livree, recuperee
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prestations');
    }
};
