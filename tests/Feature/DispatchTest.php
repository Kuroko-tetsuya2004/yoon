<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Commande;
use App\Models\PropositionLivraison;
use App\Models\Repere;

class DispatchTest extends TestCase
{
    use RefreshDatabase;

    public function test_livreur_can_accept_proposition(): void
    {
        $livreur = User::create([
            'name' => 'Livreur Test',
            'email' => 'livreur@test.com',
            'password' => bcrypt('password'),
            'role' => 'livreur',
            'statut_validation' => 'valide',
            'telephone' => '770000001',
        ]);

        $client = User::create([
            'name' => 'Client Test',
            'email' => 'client@test.com',
            'password' => bcrypt('password'),
            'role' => 'client',
        ]);

        $repere = Repere::create([
            'user_id' => $client->id,
            'nom' => 'Maison',
            'latitude' => 14.6928,
            'longitude' => -17.4467,
        ]);

        $commande = Commande::create([
            'client_id' => $client->id,
            'repere_id' => $repere->id,
            'statut' => 'en_attente',
            'montant_total' => 5000,
            'creneau' => 'matin',
            'mode_paiement' => 'wave',
            'type_commande' => 'gaz',
        ]);

        $proposition = PropositionLivraison::create([
            'commande_id' => $commande->id,
            'livreur_id' => $livreur->id,
            'statut' => 'en_attente',
        ]);

        $response = $this->actingAs($livreur)->patch(route('livreur.propositions.accepter', $proposition));

        $response->assertRedirect(route('livreur.dashboard'));
        $this->assertDatabaseHas('proposition_livraisons', [
            'id' => $proposition->id,
            'statut' => 'acceptee',
        ]);
        $this->assertDatabaseHas('livraisons', [
            'commande_id' => $commande->id,
            'livreur_id' => $livreur->id,
            'statut_livraison' => 'en_attente',
        ]);
    }
}
