<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['telephone' => '770000000'],
            [
                'name' => 'Super Admin',
                'email' => 'admin@yoon.sn',
                'role' => 'administrateur',
                'password' => bcrypt('password123'),
            ]
        );
    }
}
