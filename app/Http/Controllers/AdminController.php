<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Commande;
use App\Models\Litige;

class AdminController extends Controller
{
    public function dashboard(Request $request)
    {
        if ($request->user()->role !== 'administrateur') abort(403);

        $stats = [
            'total_commandes' => Commande::count(),
            'ca_genere' => Commande::where('statut', 'livree')->sum('montant_total'),
            'utilisateurs_actifs' => User::where('role', 'client')->count(),
            'partenaires_actifs' => User::where('role', 'partenaire')->where('statut_validation', 'valide')->count(),
            'partenaires_en_attente' => User::where('role', 'partenaire')->where('statut_validation', 'en_attente')->count(),
            'livreurs_actifs' => User::where('role', 'livreur')->where('statut_validation', 'valide')->count(),
            'livreurs_en_attente' => User::where('role', 'livreur')->where('statut_validation', 'en_attente')->count(),
            'litiges_ouverts' => Litige::where('statut', 'ouvert')->count(),
        ];

        // Données pour le graphique (7 derniers jours)
        $ventesSeptDerniersJours = collect();
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $total = Commande::where('statut', 'livree')
                ->whereDate('created_at', $date)
                ->sum('montant_total');
            $ventesSeptDerniersJours->push([
                'date' => now()->subDays($i)->format('d M'),
                'ca' => $total
            ]);
        }

        // Dernières commandes
        $dernieresCommandes = Commande::with(['client', 'livraison.livreur', 'gaz.partenaire', 'pondereux.partenaire', 'materiel.partenaire'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($commande) {
                $partenaire = null;
                if ($commande->type_commande === 'gaz' && $commande->gaz) $partenaire = $commande->gaz->partenaire;
                elseif ($commande->type_commande === 'pondereux' && $commande->pondereux) $partenaire = $commande->pondereux->partenaire;
                elseif ($commande->type_commande === 'materiel' && $commande->materiel) $partenaire = $commande->materiel->partenaire;

                return [
                    'id' => $commande->id,
                    'date' => $commande->created_at->format('d/m/Y H:i'),
                    'client' => $commande->client ? $commande->client->name : 'Inconnu',
                    'montant' => $commande->montant_total,
                    'statut' => $commande->statut,
                    'partenaire' => $partenaire ? $partenaire->name : 'N/A',
                    'livreur' => ($commande->livraison && $commande->livraison->livreur) ? $commande->livraison->livreur->name : 'Non assigné',
                    'type' => ucfirst($commande->type_commande)
                ];
            });

        $comptesEnAttente = User::whereIn('role', ['partenaire', 'livreur'])->where('statut_validation', 'en_attente')->orderBy('created_at', 'desc')->get();
        $partenaires = User::where('role', 'partenaire')->where('statut_validation', '!=', 'en_attente')->orderBy('created_at', 'desc')->get();
        $livreurs = User::where('role', 'livreur')->where('statut_validation', '!=', 'en_attente')->orderBy('created_at', 'desc')->get();

        return inertia('Admin/Dashboard', [
            'stats' => $stats,
            'ventesGraphique' => $ventesSeptDerniersJours,
            'dernieresCommandes' => $dernieresCommandes,
            'comptesEnAttente' => $comptesEnAttente,
            'partenaires' => $partenaires,
            'livreurs' => $livreurs
        ]);
    }

    public function partenaires(Request $request)
    {
        if ($request->user()->role !== 'administrateur') abort(403);

        $partenaires = User::where('role', 'partenaire')->orderBy('created_at', 'desc')->get();
        return inertia('Admin/Partenaires', ['partenaires' => $partenaires]);
    }

    public function validerPartenaire(Request $request, User $user)
    {
        if ($request->user()->role !== 'administrateur' || $user->role !== 'partenaire') abort(403);

        $user->update(['statut_validation' => 'valide']);

        // Notification optionnelle ici
        return back()->with('success', 'Partenaire validé avec succès.');
    }

    public function suspendrePartenaire(Request $request, User $user)
    {
        if ($request->user()->role !== 'administrateur' || $user->role !== 'partenaire') abort(403);

        $nouveauStatut = $user->statut_validation === 'valide' ? 'suspendu' : 'valide';
        $user->update(['statut_validation' => $nouveauStatut]);

        $message = $nouveauStatut === 'suspendu' ? 'Partenaire suspendu.' : 'Partenaire réactivé avec succès.';
        return back()->with('success', $message);
    }

    public function livreurs(Request $request)
    {
        if ($request->user()->role !== 'administrateur') abort(403);

        $livreurs = User::where('role', 'livreur')->orderBy('created_at', 'desc')->get();
        return inertia('Admin/Livreurs', ['livreurs' => $livreurs]);
    }

    public function validerLivreur(Request $request, User $user)
    {
        if ($request->user()->role !== 'administrateur' || $user->role !== 'livreur') abort(403);

        $user->update(['statut_validation' => 'valide']);

        return back()->with('success', 'Livreur validé avec succès.');
    }

    public function suspendreLivreur(Request $request, User $user)
    {
        if ($request->user()->role !== 'administrateur' || $user->role !== 'livreur') abort(403);

        $nouveauStatut = $user->statut_validation === 'valide' ? 'suspendu' : 'valide';
        $user->update(['statut_validation' => $nouveauStatut]);

        $message = $nouveauStatut === 'suspendu' ? 'Livreur suspendu.' : 'Livreur réactivé avec succès.';
        return back()->with('success', $message);
    }

    public function litiges(Request $request)
    {
        if ($request->user()->role !== 'administrateur') abort(403);

        $litiges = Litige::with(['user', 'commande'])->orderBy('created_at', 'desc')->get();
        return inertia('Admin/Litiges', ['litiges' => $litiges]);
    }

    public function resoudreLitige(Request $request, Litige $litige)
    {
        if ($request->user()->role !== 'administrateur') abort(403);

        $request->validate(['resolution' => 'required|string']);

        $litige->update([
            'statut' => 'resolu',
            'resolution' => $request->resolution
        ]);

        return back()->with('success', 'Litige résolu.');
    }
}
