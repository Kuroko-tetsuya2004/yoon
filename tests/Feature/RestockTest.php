<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Produit;

class RestockTest extends TestCase
{
    use RefreshDatabase;

    public function test_partenaire_can_restock_product(): void
    {
        $partenaire = User::create([
            'name' => 'Partenaire Test',
            'email' => 'partenaire@test.com',
            'password' => bcrypt('password'),
            'role' => 'partenaire',
            'statut_validation' => 'valide',
            'telephone' => '770000002',
        ]);

        $produit = Produit::create([
            'nom' => 'Produit Test',
            'description' => 'Test',
            'prix' => 1000,
            'quantite_stock' => 10,
            'categorie' => 'gaz',
            'partenaire_id' => $partenaire->id,
            'est_disponible' => true,
        ]);

        $response = $this->actingAs($partenaire)->post(route('partenaire.produits.restock', $produit), [
            'quantite' => 5,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('produits', [
            'id' => $produit->id,
            'quantite_stock' => 15,
        ]);
    }
}
