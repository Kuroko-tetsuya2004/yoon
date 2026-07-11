<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        User::updateOrCreate(
            ['telephone' => '770000000'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password123'),
                'role' => 'administrateur',
                'statut_validation' => 'valide',
                'disponibilite' => true,
            ]
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        User::where('telephone', '770000000')->delete();
    }
};
