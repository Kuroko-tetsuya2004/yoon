<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\CommandeGaz;
use App\Models\CommandePondereux;
use App\Models\Repere;
use App\Notifications\NouvelleCommandeNotification;
use App\Notifications\CommandeStatusNotification;
use Illuminate\Http\Request;

class CommandeController extends Controller
{
    public function index(Request $request)
    {
        $commandes = $request->user()->commandes()->latest()->get();
        return inertia('Commandes/Index', ['commandes' => $commandes]);
    }

    public function show(Commande $commande)
    {
        if ($commande->client_id !== auth()->id()) {
            abort(403);
        }
        $commande->load(['gaz', 'pondereux', 'materiel', 'repere', 'livraison.livreur']);
        return inertia('Commandes/Show', ['commande' => $commande]);
    }

    public function getLivreurLocation(Commande $commande)
    {
        if ($commande->client_id !== auth()->id()) {
            abort(403);
        }

        if ($commande->livraison && $commande->livraison->livreur) {
            return response()->json([
                'latitude' => $commande->livraison->livreur->latitude,
                'longitude' => $commande->livraison->livreur->longitude,
            ]);
        }

        return response()->json(['error' => 'Livreur non assigné'], 404);
    }

    public function createGaz(Request $request)
    {
        $produit_id = $request->query('produit_id');
        if (!$produit_id) {
            return redirect()->route('dashboard')->with('error', 'Veuillez sélectionner un produit dans le catalogue.');
        }
        $produit = \App\Models\Produit::findOrFail($produit_id);

        $reperes = $request->user()->reperes;
        if ($reperes->isEmpty()) {
            return redirect()->route('reperes.index')->with('success', 'Veuillez d\'abord créer une adresse de livraison.');
        }
        return inertia('Commandes/CreateGaz', ['reperes' => $reperes, 'produit' => $produit]);
    }

    public function storeGaz(\App\Http\Requests\StoreCommandeRequest $request)
    {
        $validated = $request->validated();

        $produit = \App\Models\Produit::findOrFail($validated['produit_id']);
        
        if ($produit->quantite_stock < $validated['quantite']) {
            return back()->with('error', 'Quantité en stock insuffisante pour ce produit.');
        }

        $montant_total = $produit->prix * $validated['quantite'];
        if (!$request->has('contenant_vide')) {
            // Consigne si pas de bouteille vide
            $montant_total += 15000 * $validated['quantite'];
        }

        $repere = \App\Models\Repere::findOrFail($validated['repere_id']);
        $fraisLivraison = \App\Services\LivraisonService::calculerFraisLivraison($produit->partenaire, $repere);

        $commande = Commande::create([
            'client_id' => $request->user()->id,
            'repere_id' => $validated['repere_id'],
            'montant_total' => $montant_total + $fraisLivraison,
            'frais_livraison' => $fraisLivraison,
            'creneau' => $validated['creneau'],
            'mode_paiement' => $validated['mode_paiement'],
            'type_commande' => 'gaz',
            'statut' => 'acceptee', // Automatiquement acceptée
        ]);

        $produit->reduireStock($validated['quantite']);

        CommandeGaz::create([
            'commande_id' => $commande->id,
            'partenaire_id' => $produit->partenaire_id,
            'type_bonbonne' => $produit->modele,
            'quantite' => $validated['quantite'],
            'contenant_vide' => $request->has('contenant_vide'),
        ]);

        $produit->partenaire->notify(new NouvelleCommandeNotification($commande));
        $request->user()->notify(new CommandeStatusNotification($commande, 'Votre commande a été automatiquement acceptée.'));

        // Déclencher l'assignation d'un livreur car la commande est acceptée
        \App\Services\LivraisonService::assignerLivreurProche($commande);

        return redirect()->route('commandes.show', $commande)->with('success', 'Commande passée avec succès auprès de '.$produit->partenaire->name.'.');
    }

    public function createPondereux(Request $request)
    {
        $produit_id = $request->query('produit_id');
        if (!$produit_id) {
            return redirect()->route('dashboard')->with('error', 'Veuillez sélectionner un produit dans le catalogue.');
        }
        $produit = \App\Models\Produit::findOrFail($produit_id);

        $reperes = $request->user()->reperes;
        if ($reperes->isEmpty()) {
            return redirect()->route('reperes.index')->with('success', 'Veuillez d\'abord créer une adresse de livraison.');
        }
        return inertia('Commandes/CreatePondereux', ['reperes' => $reperes, 'produit' => $produit]);
    }

    public function storePondereux(\App\Http\Requests\StoreCommandeRequest $request)
    {
        $validated = $request->validated();

        $produit = \App\Models\Produit::findOrFail($validated['produit_id']);
        
        if ($produit->quantite_stock < $validated['quantite']) {
            return back()->with('error', 'Quantité en stock insuffisante pour ce produit.');
        }

        $montant_total = $produit->prix * $validated['quantite'];

        $repere = \App\Models\Repere::findOrFail($validated['repere_id']);
        $fraisLivraison = \App\Services\LivraisonService::calculerFraisLivraison($produit->partenaire, $repere);

        $commande = Commande::create([
            'client_id' => $request->user()->id,
            'repere_id' => $validated['repere_id'],
            'montant_total' => $montant_total + $fraisLivraison,
            'frais_livraison' => $fraisLivraison,
            'creneau' => $validated['creneau'],
            'mode_paiement' => $validated['mode_paiement'],
            'type_commande' => 'pondereux',
            'statut' => 'acceptee', // Automatiquement acceptée
        ]);

        $produit->reduireStock($validated['quantite']);

        CommandePondereux::create([
            'commande_id' => $commande->id,
            'partenaire_id' => $produit->partenaire_id,
            'type_produit' => $produit->modele,
            'quantite' => $validated['quantite'],
            'poids_estime' => $validated['poids_estime'] ?? null,
        ]);

        $produit->partenaire->notify(new NouvelleCommandeNotification($commande));
        $request->user()->notify(new CommandeStatusNotification($commande, 'Votre commande a été automatiquement acceptée.'));

        // Déclencher l'assignation d'un livreur car la commande est acceptée
        \App\Services\LivraisonService::assignerLivreurProche($commande);

        return redirect()->route('commandes.show', $commande)->with('success', 'Commande passée avec succès auprès de '.$produit->partenaire->name.'.');
    }

    public function createMateriel(Request $request)
    {
        $produit_id = $request->query('produit_id');
        if (!$produit_id) {
            return redirect()->route('dashboard')->with('error', 'Veuillez sélectionner un produit dans le catalogue.');
        }
        $produit = \App\Models\Produit::findOrFail($produit_id);

        $reperes = $request->user()->reperes;
        if ($reperes->isEmpty()) {
            return redirect()->route('reperes.index')->with('success', 'Veuillez d\'abord créer une adresse de livraison.');
        }

        // Recherche des commandes existantes pour le même matériel
        $commandesExistantes = \App\Models\CommandeMateriel::where('partenaire_id', $produit->partenaire_id)
            ->where('type_materiel', $produit->modele)
            ->whereHas('commande', function($q) {
                $q->whereNotIn('statut', ['annulee']);
            })
            ->orderBy('date_debut', 'asc')
            ->get();

        return inertia('Commandes/CreateMateriel', [
            'reperes' => $reperes, 
            'produit' => $produit, 
            'commandesExistantes' => $commandesExistantes
        ]);
    }

    public function storeMateriel(\App\Http\Requests\StoreCommandeRequest $request)
    {
        $validated = $request->validated();

        $produit = \App\Models\Produit::findOrFail($validated['produit_id']);
        
        $dateDebut = \Carbon\Carbon::parse($validated['date_debut']);
        $dateFin = \Carbon\Carbon::parse($validated['date_fin']);

        // Check overlaps WITH 1 day gap
        $dateDebutBuffer = $dateDebut->copy()->subDay();
        $dateFinBuffer = $dateFin->copy()->addDay();

        $hasOverlap = \App\Models\CommandeMateriel::where('partenaire_id', $produit->partenaire_id)
            ->where('type_materiel', $produit->modele)
            ->whereHas('commande', function($q) {
                $q->whereNotIn('statut', ['annulee', 'refusee']);
            })
            ->where(function($q) use ($dateDebutBuffer, $dateFinBuffer) {
                $q->whereBetween('date_debut', [$dateDebutBuffer, $dateFinBuffer])
                  ->orWhereBetween('date_fin', [$dateDebutBuffer, $dateFinBuffer])
                  ->orWhere(function($query) use ($dateDebutBuffer, $dateFinBuffer) {
                      $query->where('date_debut', '<=', $dateDebutBuffer)
                            ->where('date_fin', '>=', $dateFinBuffer);
                  });
            })->exists();

        if ($hasOverlap) {
            return back()->with('error', 'Les dates de livraison choisies coïncident avec une commande antérieure pour ce matériel ou ne respectent pas le délai minimal d\'un jour d\'écart. Veuillez modifier la date de livraison.');
        }

        $jours = $dateDebut->diffInDays($dateFin) + 1;
        $repere = \App\Models\Repere::findOrFail($validated['repere_id']);
        $fraisLivraison = \App\Services\LivraisonService::calculerFraisLivraison($produit->partenaire, $repere);

        $montant_total = ($produit->prix * $validated['quantite'] * $jours) + $fraisLivraison;

        $commande = Commande::create([
            'client_id' => $request->user()->id,
            'repere_id' => $validated['repere_id'],
            'montant_total' => $montant_total,
            'frais_livraison' => $fraisLivraison,
            'creneau' => $validated['creneau'],
            'mode_paiement' => $validated['mode_paiement'],
            'type_commande' => 'materiel',
        ]);

        \App\Models\CommandeMateriel::create([
            'commande_id' => $commande->id,
            'partenaire_id' => $produit->partenaire_id,
            'type_materiel' => $produit->modele,
            'quantite' => $validated['quantite'],
            'date_debut' => $validated['date_debut'],
            'date_fin' => $validated['date_fin'],
        ]);

        $produit->partenaire->notify(new NouvelleCommandeNotification($commande));

        return redirect()->route('commandes.show', $commande)->with('success', 'Commande de matériel passée avec succès. Elle est en attente de validation par le partenaire.');
    }

    public function confirmerReception(Commande $commande)
    {
        if ($commande->client_id !== auth()->id()) {
            abort(403);
        }

        if ($commande->statut !== 'en_livraison') {
            return back()->with('error', 'La commande n\'est pas en cours de livraison.');
        }

        // Marquer la commande comme livree
        $commande->update(['statut' => 'livree']);

        if ($commande->livraison) {
            $livraison = $commande->livraison;
            $necessiteRetour = false;
            
            if ($commande->type_commande === 'gaz' && $commande->gaz && $commande->gaz->contenant_vide) {
                $necessiteRetour = true;
            }

            if ($necessiteRetour) {
                $livraison->statut_livraison = 'retour_boutique';
                $livraison->heure_arrivee = now(); // Heure d'arrivée au client
                $commande->gaz->update(['contenant_recupere' => true]);
            } else {
                $livraison->statut_livraison = 'livree';
                $livraison->heure_arrivee = now();
            }
            $livraison->save();
        }

        return redirect()->back()->with('success', 'Vous avez confirmé la réception de votre commande.');
    }
}
