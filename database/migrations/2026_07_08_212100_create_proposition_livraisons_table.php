<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('proposition_livraisons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commande_id')->constrained('commandes')->onDelete('cascade');
            $table->foreignId('livreur_id')->constrained('users')->onDelete('cascade');
            $table->string('statut')->default('en_attente'); // en_attente, acceptee, refusee
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('proposition_livraisons');
    }
};
