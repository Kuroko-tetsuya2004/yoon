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
        Schema::create('produits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('partenaire_id')->constrained('users')->onDelete('cascade');
            $table->string('categorie'); // gaz, pondereux, materiel
            $table->string('marque');
            $table->string('modele');
            $table->string('nom_produit');
            $table->text('description')->nullable();
            $table->decimal('prix', 10, 2);
            $table->string('photo')->nullable();
            $table->boolean('est_disponible')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produits');
    }
};
