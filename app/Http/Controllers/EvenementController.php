<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class EvenementController extends Controller
{
    public function index(Request $request)
    {
        $evenements = \App\Models\CommandeEvenementielle::whereHas('commande', function($query) use ($request) {
            $query->where('client_id', $request->user()->id);
        })->with('commande', 'prestations.produit')->latest()->get();

        return inertia('Client/Evenements/Index', ['evenements' => $evenements]);
    }

    public function create(Request $request)
    {
        $reperes = $request->user()->reperes;
        return inertia('Client/Evenements/Create', ['reperes' => $reperes]);
    }

    public function store(\App\Http\Requests\StoreEvenementRequest $request)
    {
        $validated = $request->validated();

        // Create the abstract Commande first (with 0 total for now)
        $commande = \App\Models\Commande::create([
            'client_id' => $request->user()->id,
            'repere_id' => $request->repere_id,
            'statut' => 'panier', // Custom status before checkout
            'montant_total' => 0,
            'type_commande' => 'evenementielle',
            'mode_paiement' => 'non_defini',
        ]);

        $evenement = \App\Models\CommandeEvenementielle::create([
            'commande_id' => $commande->id,
            'titre' => $request->titre,
            'type_evenement' => $request->type_evenement,
            'date_evenement' => $request->date_evenement,
        ]);

        return redirect()->route('evenements.show', $evenement)->with('success', 'Événement créé. Vous pouvez maintenant y ajouter des prestations.');
    }

    public function show(Request $request, \App\Models\CommandeEvenementielle $evenement)
    {
        if ($evenement->commande->client_id !== $request->user()->id) abort(403);

        $evenement->load('prestations.produit', 'prestations.partenaire');
        
        // Load available materiel from partenaires
        $materiels = \App\Models\Produit::where('categorie', 'materiel')->where('est_disponible', true)->get();

        return inertia('Client/Evenements/Show', [
            'evenement' => $evenement,
            'materiels' => $materiels
        ]);
    }

    public function addPrestation(Request $request, \App\Models\CommandeEvenementielle $evenement)
    {
        if ($evenement->commande->client_id !== $request->user()->id) abort(403);
        if ($evenement->commande->statut !== 'panier') return back()->with('error', 'Cet événement est déjà validé.');

        $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'quantite' => 'required|integer|min:1',
        ]);

        $produit = \App\Models\Produit::findOrFail($request->produit_id);
        
        // Define caution logic: say 50% of the price * quantite
        $caution = ($produit->prix * $request->quantite) * 0.5;

        \App\Models\Prestation::create([
            'commande_evenementielle_id' => $evenement->id,
            'produit_id' => $produit->id,
            'partenaire_id' => $produit->partenaire_id,
            'quantite' => $request->quantite,
            'prix_unitaire' => $produit->prix,
            'caution' => $caution,
            'statut' => 'en_attente'
        ]);

        // Update total
        $total = $evenement->prestations()->sum(\DB::raw('prix_unitaire * quantite')) + $evenement->prestations()->sum('caution');
        $evenement->commande->update(['montant_total' => $total]);

        return back()->with('success', 'Prestation ajoutée au panier événementiel.');
    }

    public function removePrestation(Request $request, \App\Models\CommandeEvenementielle $evenement, \App\Models\Prestation $prestation)
    {
        if ($evenement->commande->client_id !== $request->user()->id) abort(403);
        if ($prestation->commande_evenementielle_id !== $evenement->id) abort(404);
        if ($evenement->commande->statut !== 'panier') return back()->with('error', 'Cet événement est déjà validé.');

        $prestation->delete();

        // Update total
        $total = $evenement->prestations()->sum(\DB::raw('prix_unitaire * quantite')) + $evenement->prestations()->sum('caution');
        $evenement->commande->update(['montant_total' => $total]);

        return back()->with('success', 'Prestation retirée.');
    }

    public function checkout(Request $request, \App\Models\CommandeEvenementielle $evenement)
    {
        if ($evenement->commande->client_id !== $request->user()->id) abort(403);
        if ($evenement->prestations->count() === 0) return back()->with('error', 'Ajoutez au moins une prestation.');

        $request->validate(['mode_paiement' => 'required|string']);

        $evenement->commande->update([
            'statut' => 'en_attente', // En attente de validation partenaire
            'mode_paiement' => $request->mode_paiement,
            'creneau' => 'Avant l\'événement: ' . $evenement->date_evenement->format('d/m/Y'),
        ]);

        // Ici, en production, on redirigerait vers Wave/Orange Money si applicable
        return redirect()->route('commandes.show', $evenement->commande)->with('success', 'Votre panier événementiel a été validé ! Les prestataires ont été notifiés.');
    }
}
