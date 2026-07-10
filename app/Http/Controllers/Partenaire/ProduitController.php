<?php

namespace App\Http\Controllers\Partenaire;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class ProduitController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'partenaire') abort(403, 'Accès réservé aux partenaires.');
        if ($request->user()->statut_validation !== 'valide') {
            Auth::logout();
            return redirect()->route('login')->with('status', 'Votre compte est en attente de validation par un administrateur.');
        }
        $produits = $request->user()->produits()->latest()->get();
        return inertia('Partenaire/Produits/Index', ['produits' => $produits]);
    }

    public function create(Request $request)
    {
        if ($request->user()->role !== 'partenaire') abort(403);
        if ($request->user()->statut_validation !== 'valide') {
            Auth::logout();
            return redirect()->route('login')->with('status', 'Votre compte est en attente de validation par un administrateur.');
        }
        return inertia('Partenaire/Produits/Form');
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'partenaire') abort(403);

        $validated = $request->validate([
            'categorie' => 'required|string',
            'marque' => 'required|string',
            'modele' => 'required|string',
            'nom_produit' => 'required|string',
            'description' => 'nullable|string',
            'prix' => 'required|numeric|min:0',
            'photo' => 'nullable|image|max:2048',
            'est_disponible' => 'boolean',
            'quantite_stock' => 'nullable|integer|min:0',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('produits', 's3');
        }

        $validated['est_disponible'] = $request->has('est_disponible');
        if (!isset($validated['quantite_stock'])) {
            $validated['quantite_stock'] = 0;
        }

        $request->user()->produits()->create($validated);

        return redirect()->route('partenaire.produits.index')->with('success', 'Produit ajouté avec succès.');
    }

    public function edit(Produit $produit)
    {
        if ($produit->partenaire_id !== auth()->id()) abort(403);
        
        return inertia('Partenaire/Produits/Form', ['produit' => $produit]);
    }

    public function update(Request $request, Produit $produit)
    {
        if ($produit->partenaire_id !== auth()->id()) abort(403);

        $validated = $request->validate([
            'categorie' => 'required|string',
            'marque' => 'required|string',
            'modele' => 'required|string',
            'nom_produit' => 'required|string',
            'description' => 'nullable|string',
            'prix' => 'required|numeric|min:0',
            'photo' => 'nullable|image|max:2048',
            'est_disponible' => 'boolean',
            'quantite_stock' => 'nullable|integer|min:0',
        ]);

        if ($request->hasFile('photo')) {
            if ($produit->photo) Storage::disk('s3')->delete($produit->photo);
            $validated['photo'] = $request->file('photo')->store('produits', 's3');
        }

        $validated['est_disponible'] = $request->has('est_disponible');
        if (!isset($validated['quantite_stock'])) {
            $validated['quantite_stock'] = 0;
        }

        $produit->update($validated);

        return redirect()->route('partenaire.produits.index')->with('success', 'Produit mis à jour avec succès.');
    }

    public function destroy(Produit $produit)
    {
        if ($produit->partenaire_id !== auth()->id()) abort(403);

        if ($produit->photo) Storage::disk('s3')->delete($produit->photo);
        $produit->delete();

        return redirect()->route('partenaire.produits.index')->with('success', 'Produit supprimé.');
    }

    public function restock(Request $request, Produit $produit)
    {
        if ($produit->partenaire_id !== auth()->id()) abort(403);
        
        $request->validate(['quantite' => 'required|integer|min:1']);
        $produit->renflouer($request->quantite);

        return back()->with('success', 'Stock renfloué avec succès.');
    }

    public function toggleDisponibilite(Produit $produit)
    {
        if ($produit->partenaire_id !== auth()->id()) abort(403);
        
        $produit->est_disponible = !$produit->est_disponible;
        $produit->save();

        return back()->with('success', 'Statut de disponibilité mis à jour.');
    }
}
