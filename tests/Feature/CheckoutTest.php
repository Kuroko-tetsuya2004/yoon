<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Repere;
use App\Models\Produit;

class CheckoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_client_can_checkout_gaz(): void
    {
        $client = User::create([
            'name' => 'Client Test',
            'email' => 'client@test.com',
            'password' => bcrypt('password'),
            'role' => 'client',
            'telephone' => '770000000',
        ]);

        $partenaire = User::create([
            'name' => 'Partenaire Test',
            'email' => 'partenaire@test.com',
            'password' => bcrypt('password'),
            'role' => 'partenaire',
        ]);

        $repere = Repere::create([
            'user_id' => $client->id,
            'nom' => 'Maison',
            'latitude' => 14.6928,
            'longitude' => -17.4467,
        ]);

        $produit = Produit::create([
            'nom' => 'Gaz 6kg',
            'description' => 'Test',
            'prix' => 3500,
            'quantite_stock' => 10,
            'categorie' => 'gaz',
            'partenaire_id' => $partenaire->id,
            'est_disponible' => true,
        ]);

        $response = $this->actingAs($client)->post(route('commandes.gaz.store'), [
            'produit_id' => $produit->id,
            'repere_id' => $repere->id,
            'quantite' => 1,
            'creneau' => 'matin',
            'mode_paiement' => 'especes',
            'type_bonbonne' => '6kg',
            'contenant_vide' => false,
        ]);

        $response->assertRedirect(route('dashboard'));
        $this->assertDatabaseHas('commandes', [
            'client_id' => $client->id,
            'type_commande' => 'gaz',
            'montant_total' => 3500,
        ]);
    }
}
