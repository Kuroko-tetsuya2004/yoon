<?php

namespace App\Http\Controllers\Partenaire;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Commande;
use App\Models\Produit;
use App\Models\CommandeGaz;
use App\Models\CommandePondereux;
use App\Models\CommandeMateriel;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'partenaire') abort(403);

        $partenaireId = $request->user()->id;

        $commandesIds = collect()
            ->merge(CommandeGaz::where('partenaire_id', $partenaireId)->pluck('commande_id'))
            ->merge(CommandePondereux::where('partenaire_id', $partenaireId)->pluck('commande_id'))
            ->merge(CommandeMateriel::where('partenaire_id', $partenaireId)->pluck('commande_id'))
            ->unique();

        $mesCommandes = Commande::whereIn('id', $commandesIds);

        // Cloner pour éviter de muter la requête principale lors de l'appel à sum()
        $ca_genere = (clone $mesCommandes)->whereIn('statut', ['livree', 'en_livraison'])->sum('montant_total');

        $stats = [
            'total_ventes' => $mesCommandes->count(),
            'ca_genere' => $ca_genere,
            'produits_actifs' => Produit::where('partenaire_id', $partenaireId)->where('est_disponible', true)->count(),
            'ruptures_stock' => Produit::where('partenaire_id', $partenaireId)->where('categorie', '!=', 'materiel')->where('quantite_stock', '<=', 5)->count(),
        ];

        // Données pour le graphique (7 derniers jours)
        $ventesSeptDerniersJours = collect();
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $total = Commande::whereIn('id', $commandesIds)
                ->whereIn('statut', ['livree', 'en_livraison'])
                ->whereDate('created_at', $date)
                ->sum('montant_total');
            $ventesSeptDerniersJours->push([
                'date' => now()->subDays($i)->format('d M'),
                'ca' => $total
            ]);
        }

        // Produits les plus vendus (top 5)
        $topProduits = collect();
        $gaz = CommandeGaz::where('partenaire_id', $partenaireId)->get()->groupBy('type_bonbonne')->map(function ($items, $key) {
            return ['nom' => "Gaz ($key)", 'quantite' => $items->sum('quantite')];
        });
        $pondereux = CommandePondereux::where('partenaire_id', $partenaireId)->get()->groupBy('type_produit')->map(function ($items, $key) {
            return ['nom' => "Pondéreux ($key)", 'quantite' => $items->sum('quantite')];
        });
        $materiel = CommandeMateriel::where('partenaire_id', $partenaireId)->get()->groupBy('type_materiel')->map(function ($items, $key) {
            return ['nom' => "Matériel ($key)", 'quantite' => $items->sum('quantite')];
        });
        
        $topProduits = $topProduits->merge($gaz->values())->merge($pondereux->values())->merge($materiel->values())
            ->sortByDesc('quantite')->take(5)->values();

        // Dernières commandes
        $dernieresCommandes = Commande::whereIn('id', $commandesIds)
            ->with(['client'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($commande) {
                return [
                    'id' => $commande->id,
                    'date' => $commande->created_at->format('d/m/Y H:i'),
                    'client' => $commande->client ? $commande->client->name : 'Inconnu',
                    'montant' => $commande->montant_total,
                    'statut' => $commande->statut,
                ];
            });

        return inertia('Partenaire/Dashboard', [
            'stats' => $stats,
            'ventesGraphique' => $ventesSeptDerniersJours,
            'topProduits' => $topProduits,
            'dernieresCommandes' => $dernieresCommandes
        ]);
    }

    public function showLocation(Request $request)
    {
        if ($request->user()->role !== 'partenaire') abort(403);
        return inertia('Partenaire/Location');
    }
}
