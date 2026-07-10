<?php

namespace App\Http\Controllers\Livreur;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Livraison;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        if (Auth::user()->role !== 'livreur') abort(403);
        if (Auth::user()->statut_validation !== 'valide') {
            Auth::logout();
            return redirect()->route('login')->with('status', 'Votre compte est en attente de validation par un administrateur.');
        }

        $livraisons = Livraison::where('livreur_id', Auth::id())
                               ->with(['commande.repere', 'commande.gaz', 'commande.pondereux', 'commande.materiel'])
                               ->orderByRaw("CASE statut_livraison WHEN 'en_attente' THEN 1 WHEN 'en_route' THEN 2 WHEN 'retour_boutique' THEN 3 WHEN 'livree' THEN 4 ELSE 5 END")
                               ->get();

        $proposition = \App\Models\PropositionLivraison::where('livreur_id', Auth::id())
                                                       ->where('statut', 'en_attente')
                                                       ->with(['commande.repere'])
                                                       ->first();

        // Récupérer le partenaire pour la carte
        $partenaire = null;
        if ($proposition && $proposition->commande) {
            $commande = $proposition->commande;
            if ($commande->type_commande === 'gaz' && $commande->gaz) {
                $partenaire = \App\Models\User::find($commande->gaz->partenaire_id);
            } elseif ($commande->type_commande === 'pondereux' && $commande->pondereux) {
                $partenaire = \App\Models\User::find($commande->pondereux->partenaire_id);
            } elseif ($commande->type_commande === 'materiel' && $commande->materiel) {
                $partenaire = \App\Models\User::find($commande->materiel->partenaire_id);
            }
        }

        // Pour les livraisons en cours, on récupère aussi le partenaire
        $livraisonsAvecPartenaire = $livraisons->map(function ($livraison) {
            $commande = $livraison->commande;
            $partenaire = null;
            if ($commande->type_commande === 'gaz' && $commande->gaz) {
                $partenaire = \App\Models\User::find($commande->gaz->partenaire_id);
            } elseif ($commande->type_commande === 'pondereux' && $commande->pondereux) {
                $partenaire = \App\Models\User::find($commande->pondereux->partenaire_id);
            } elseif ($commande->type_commande === 'materiel' && $commande->materiel) {
                $partenaire = \App\Models\User::find($commande->materiel->partenaire_id);
            }
            $livraison->partenaire = $partenaire;
            return $livraison;
        });

        return inertia('Livreur/Dashboard', [
            'livraisons' => $livraisonsAvecPartenaire,
            'proposition' => $proposition,
            'partenaireProposition' => $partenaire
        ]);
    }

    public function accepterProposition(Request $request, \App\Models\PropositionLivraison $proposition)
    {
        if (Auth::user()->role !== 'livreur' || $proposition->livreur_id !== Auth::id()) abort(403);

        $proposition->update(['statut' => 'acceptee']);

        Livraison::create([
            'commande_id' => $proposition->commande_id,
            'livreur_id' => Auth::id(),
            'statut_livraison' => 'en_attente' // En attente de récupération par le livreur
        ]);

        return redirect()->route('livreur.dashboard')->with('success', 'Commande acceptée ! Veuillez vous rendre à la boutique.');
    }

    public function refuserProposition(Request $request, \App\Models\PropositionLivraison $proposition)
    {
        if (Auth::user()->role !== 'livreur' || $proposition->livreur_id !== Auth::id()) abort(403);

        $proposition->update(['statut' => 'refusee']);

        // Chercher le livreur suivant
        \App\Services\LivraisonService::assignerLivreurProche($proposition->commande);

        return redirect()->route('livreur.dashboard')->with('success', 'Commande refusée.');
    }

    public function updateStatut(Request $request, Livraison $livraison)
    {
        if (Auth::user()->role !== 'livreur' || $livraison->livreur_id !== Auth::id()) abort(403);

        $request->validate([
            'statut_livraison' => 'required|in:en_route,livree',
        ]);

        $statut = $request->statut_livraison;
        
        if ($statut === 'en_route') {
            $livraison->statut_livraison = $statut;
            $livraison->heure_depart = now();
            $livraison->commande->update(['statut' => 'en_livraison']);
        } elseif ($statut === 'livree') {
            // S'il y a une consigne vide (gaz), le statut passe en "retour_boutique" pour que la carte reste active
            $necessiteRetour = false;
            if ($livraison->commande->type_commande === 'gaz' && $livraison->commande->gaz && $livraison->commande->gaz->contenant_vide) {
                $necessiteRetour = true;
            }

            if ($necessiteRetour) {
                $livraison->statut_livraison = 'retour_boutique';
                $livraison->heure_arrivee = now(); // Heure d'arrivée au client
                $livraison->commande->update(['statut' => 'livree']);
                // On met à jour la commande gaz pour dire que le livreur a récupéré le contenant
                $livraison->commande->gaz->update(['contenant_recupere' => true]);
            } else {
                $livraison->statut_livraison = 'livree';
                $livraison->heure_arrivee = now();
                $livraison->commande->update(['statut' => 'livree']);
            }
        }
        
        $livraison->save();

        return redirect()->back()->with('success', 'Statut de la livraison mis à jour.');
    }

    public function updateLocation(\App\Http\Requests\UpdateLocationRequest $request)
    {
        if (Auth::user()->role !== 'livreur') abort(403);

        $user = Auth::user();
        $user->latitude = $request->latitude;
        $user->longitude = $request->longitude;
        $user->save();

        broadcast(new \App\Events\LocationUpdated($user->id, $user->latitude, $user->longitude))->toOthers();

        return response()->json(['success' => true]);
    }
}
