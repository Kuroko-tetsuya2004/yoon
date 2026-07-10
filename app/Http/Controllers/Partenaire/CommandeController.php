<?php

namespace App\Http\Controllers\Partenaire;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\CommandeGaz;
use App\Models\CommandePondereux;
use App\Models\CommandeMateriel;
use App\Models\Livraison;
use App\Notifications\CommandeStatusNotification;
use Illuminate\Http\Request;

class CommandeController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'partenaire') abort(403, 'Accès réservé aux partenaires.');
        if ($request->user()->statut_validation !== 'valide') {
            \Illuminate\Support\Facades\Auth::logout();
            return redirect()->route('login')->with('status', 'Votre compte est en attente de validation par un administrateur.');
        }

        $partenaireId = $request->user()->id;

        // Récupérer les IDs des commandes liées à ce partenaire via les sous-tables
        $commandeIdsGaz = CommandeGaz::where('partenaire_id', $partenaireId)->pluck('commande_id');
        $commandeIdsPondereux = CommandePondereux::where('partenaire_id', $partenaireId)->pluck('commande_id');
        $commandeIdsMateriel = CommandeMateriel::where('partenaire_id', $partenaireId)->pluck('commande_id');
        
        // Commandes événementielles où ce partenaire a au moins une prestation
        $commandeIdsEvenementielles = \App\Models\Prestation::where('partenaire_id', $partenaireId)
            ->with('commandeEvenementielle')
            ->get()
            ->pluck('commandeEvenementielle.commande_id')
            ->filter();

        $allCommandeIds = $commandeIdsGaz->merge($commandeIdsPondereux)->merge($commandeIdsMateriel)->merge($commandeIdsEvenementielles)->unique();

        $commandes = Commande::whereIn('id', $allCommandeIds)
            ->with(['client', 'repere', 'gaz', 'pondereux', 'materiel', 'evenementielle.prestations' => function($query) use ($partenaireId) {
                $query->where('partenaire_id', $partenaireId)->with('produit');
            }, 'livraison.livreur'])
            ->latest()
            ->get();

        return inertia('Partenaire/Commandes/Index', ['commandes' => $commandes]);
    }

    public function valider(Request $request, Commande $commande)
    {
        if ($request->user()->role !== 'partenaire') abort(403);

        $partenaireId = $request->user()->id;
        $isOwner = false;

        if ($commande->gaz && $commande->gaz->partenaire_id === $partenaireId) $isOwner = true;
        if ($commande->pondereux && $commande->pondereux->partenaire_id === $partenaireId) $isOwner = true;
        if ($commande->materiel && $commande->materiel->partenaire_id === $partenaireId) $isOwner = true;
        
        $hasPrestation = false;
        if ($commande->type_commande === 'evenementielle' && $commande->evenementielle) {
            $hasPrestation = $commande->evenementielle->prestations()->where('partenaire_id', $partenaireId)->exists();
            if ($hasPrestation) $isOwner = true;
        }

        if (!$isOwner) abort(403);

        if ($commande->type_commande !== 'evenementielle') {
            $commande->update(['statut' => 'acceptee']);
            // Déclencher l'assignation d'un livreur
            \App\Services\LivraisonService::assignerLivreurProche($commande);
        } else {
            // Pour un événement, on valide uniquement les prestations de ce partenaire
            $commande->evenementielle->prestations()->where('partenaire_id', $partenaireId)->update(['statut' => 'acceptee']);
            // Si toutes les prestations sont acceptées, on pourrait valider la commande complète, mais on simplifie ici.
            $commande->update(['statut' => 'acceptee']);
        }

        // Notifier le client
        $commande->client->notify(new CommandeStatusNotification($commande, 'Votre commande de ' . $commande->type_commande . ' a été acceptée par le partenaire.'));

        return back()->with('success', 'Commande #' . $commande->id . ' validée avec succès.');
    }

    public function refuser(Request $request, Commande $commande)
    {
        if ($request->user()->role !== 'partenaire') abort(403);

        $request->validate([
            'motif_refus' => 'required|string|max:500',
        ]);

        $partenaireId = $request->user()->id;
        $isOwner = false;

        if ($commande->gaz && $commande->gaz->partenaire_id === $partenaireId) $isOwner = true;
        if ($commande->pondereux && $commande->pondereux->partenaire_id === $partenaireId) $isOwner = true;
        if ($commande->materiel && $commande->materiel->partenaire_id === $partenaireId) $isOwner = true;

        $hasPrestation = false;
        if ($commande->type_commande === 'evenementielle' && $commande->evenementielle) {
            $hasPrestation = $commande->evenementielle->prestations()->where('partenaire_id', $partenaireId)->exists();
            if ($hasPrestation) $isOwner = true;
        }

        if (!$isOwner) abort(403);

        if ($commande->livraison()->exists()) {
            return back()->with('error', 'Impossible de refuser cette commande car un livreur y est déjà assigné.');
        }

        if ($commande->type_commande !== 'evenementielle') {
            $commande->update([
                'statut' => 'annulee',
                'motif_refus' => $request->motif_refus,
            ]);
        } else {
            // Refuser uniquement la prestation du partenaire
            $commande->evenementielle->prestations()->where('partenaire_id', $partenaireId)->update(['statut' => 'annulee']);
        }

        // Notifier le client du refus avec le motif
        $commande->client->notify(new CommandeStatusNotification(
            $commande,
            'Votre commande/prestation de ' . $commande->type_commande . ' a été refusée par le partenaire. Motif : ' . $request->motif_refus
        ));

        return back()->with('success', 'Commande #' . $commande->id . ' refusée.');
    }
    public function confirmerRetour(Request $request, Commande $commande)
    {
        if ($request->user()->role !== 'partenaire') abort(403);

        $partenaireId = $request->user()->id;

        // Vérifier que c'est une commande gaz de ce partenaire avec une livraison en retour
        if ($commande->type_commande === 'gaz' && $commande->gaz && $commande->gaz->partenaire_id === $partenaireId && $commande->gaz->contenant_vide && $commande->livraison) {
            if ($commande->livraison->statut_livraison === 'retour_boutique') {
                // Marquer la livraison comme complètement terminée (statut cohérent)
                $commande->livraison->update(['statut_livraison' => 'livree']);
                $commande->update(['statut' => 'terminee']);
                return back()->with('success', 'Vous avez confirmé la réception de la consigne (bouteille vide). La course du livreur est terminée.');
            }
        }

        return back()->with('error', 'Impossible de confirmer ce retour.');
    }
    public function confirmerRecuperation(Request $request, Commande $commande)
    {
        if ($request->user()->role !== 'partenaire') abort(403);

        $partenaireId = $request->user()->id;

        if ($commande->type_commande === 'evenementielle' && $commande->evenementielle) {
            $prestation = $commande->evenementielle->prestations()->where('partenaire_id', $partenaireId)->first();
            if ($prestation && $prestation->statut === 'livree') {
                $prestation->update(['statut' => 'recuperee']);
                return back()->with('success', 'Vous avez confirmé la récupération du matériel. La caution est libérée.');
            }
        } elseif ($commande->type_commande === 'materiel' && $commande->materiel) {
            if ($commande->materiel->partenaire_id === $partenaireId && $commande->statut === 'livree') {
                $commande->update(['statut' => 'recuperee']);
                return back()->with('success', 'Vous avez confirmé la récupération du matériel.');
            }
        }

        return back()->with('error', 'Impossible de confirmer la récupération.');
    }
}
