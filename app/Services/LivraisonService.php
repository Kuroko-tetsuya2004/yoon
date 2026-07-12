<?php

namespace App\Services;

use App\Models\Commande;
use App\Models\PropositionLivraison;
use App\Models\User;

class LivraisonService
{
    /**
     * Calcule la distance entre deux points GPS en kilomètres en utilisant la formule de Haversine.
     */
    public static function calculerDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371; // Rayon de la terre en km

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }

    /**
     * Calcule la distance routière la plus courte via l'API OSRM. Fallback sur Haversine si échec.
     */
    public static function calculerDistanceRoutiere($lat1, $lon1, $lat2, $lon2)
    {
        try {
            $response = \Illuminate\Support\Facades\Http::timeout(3)->get("http://router.project-osrm.org/route/v1/driving/{$lon1},{$lat1};{$lon2},{$lat2}?overview=false");
            if ($response->successful()) {
                $data = $response->json();
                if (isset($data['routes'][0]['distance'])) {
                    return $data['routes'][0]['distance'] / 1000; // Return in km
                }
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning("OSRM API failed, fallback to Haversine: " . $e->getMessage());
        }
        
        return self::calculerDistance($lat1, $lon1, $lat2, $lon2);
    }

    /**
     * Calcule les frais de livraison dynamiquement (1000f/km, max 3500f)
     */
    public static function calculerFraisLivraison($partenaire, $repere)
    {
        if (!$partenaire->latitude || !$partenaire->longitude || !$repere->latitude || !$repere->longitude) {
            return 0;
        }

        $distanceKm = self::calculerDistanceRoutiere(
            $partenaire->latitude, $partenaire->longitude,
            $repere->latitude, $repere->longitude
        );

        $frais = $distanceKm * 1000;
        return round(min($frais, 3500));
    }

    /**
     * Trouve le livreur disponible le plus proche qui n'a pas encore refusé cette commande,
     * et crée une PropositionLivraison.
     */
    public static function assignerLivreurProche(Commande $commande)
    {
        // Si la commande n'est pas acceptée, on ne fait rien
        if ($commande->statut !== 'acceptee') {
            return false;
        }

        // On vérifie s'il y a déjà une proposition en attente
        $propositionEnCours = PropositionLivraison::where('commande_id', $commande->id)
                                                  ->where('statut', 'en_attente')
                                                  ->first();
        if ($propositionEnCours) {
            return false; // On attend que le livreur actuel réponde
        }

        // Si une livraison définitive existe déjà, on ne fait rien
        if ($commande->livraison()->exists()) {
            return false;
        }

        // Les coordonnées du point de départ (Partenaire)
        $partenaire = null;

        // Récupérer le partenaire selon le type de commande
        if ($commande->type_commande === 'gaz' && $commande->gaz) {
            $partenaire = User::find($commande->gaz->partenaire_id);
        } elseif ($commande->type_commande === 'pondereux' && $commande->pondereux) {
            $partenaire = User::find($commande->pondereux->partenaire_id);
        } elseif ($commande->type_commande === 'materiel' && $commande->materiel) {
            $partenaire = User::find($commande->materiel->partenaire_id);
        } elseif ($commande->type_commande === 'evenementielle' && $commande->evenementielle) {
            $prestation = $commande->evenementielle->prestations()->first();
            if ($prestation) {
                $partenaire = User::find($prestation->partenaire_id);
            }
        }

        if (!$partenaire || !$partenaire->latitude || !$partenaire->longitude) {
            \Illuminate\Support\Facades\Log::warning("LivraisonService: Partenaire sans coordonnées GPS pour commande #{$commande->id}. Assignation impossible.");
            return false; // Impossible de calculer la distance sans les coordonnées de la boutique
        }

        if ($partenaire->propre_service_livraison) {
            \Illuminate\Support\Facades\Log::info("LivraisonService: Le partenaire a son propre service de livraison. Auto-assignation pour la commande #{$commande->id}.");
            \App\Models\Livraison::create([
                'commande_id' => $commande->id,
                'livreur_id' => $partenaire->id,
                'statut_livraison' => 'en_attente'
            ]);
            return true;
        }

        // On récupère les IDs des livreurs qui ont déjà refusé cette commande
        $livreursRefus = PropositionLivraison::where('commande_id', $commande->id)
                                             ->where('statut', 'refusee')
                                             ->pluck('livreur_id')
                                             ->toArray();

        // On récupère tous les livreurs disponibles avec coordonnées
        $livreursDisponibles = User::where('role', 'livreur')
                                   ->where('statut_validation', 'valide')
                                   ->where('disponibilite', true)
                                   ->whereNotNull('latitude')
                                   ->whereNotNull('longitude')
                                   ->whereNotIn('id', $livreursRefus)
                                   ->get();

        // Fallback : si aucun livreur avec GPS n'est disponible, on prend tous les livreurs dispo sans filtre GPS
        if ($livreursDisponibles->isEmpty()) {
            $livreursDisponibles = User::where('role', 'livreur')
                                       ->where('statut_validation', 'valide')
                                       ->where('disponibilite', true)
                                       ->whereNotIn('id', $livreursRefus)
                                       ->get();
        }

        if ($livreursDisponibles->isEmpty()) {
            \Illuminate\Support\Facades\Log::warning("LivraisonService: Aucun livreur disponible pour la commande #{$commande->id}.");
            return false; // Aucun livreur disponible
        }

        // On cherche le livreur le plus proche
        $livreurPlusProche = null;
        $distanceMin = PHP_FLOAT_MAX;

        foreach ($livreursDisponibles as $livreur) {
            if ($partenaire->latitude && $partenaire->longitude && $livreur->latitude && $livreur->longitude) {
                $distance = self::calculerDistanceRoutiere(
                    $partenaire->latitude,
                    $partenaire->longitude,
                    $livreur->latitude,
                    $livreur->longitude
                );
            } else {
                $distance = 0; // Pas de coordonnées, distance par défaut pour permettre l'assignation
            }

            if ($distance < $distanceMin) {
                $distanceMin = $distance;
                $livreurPlusProche = $livreur;
            }
        }

        if ($livreurPlusProche) {
            $proposition = PropositionLivraison::create([
                'commande_id' => $commande->id,
                'livreur_id' => $livreurPlusProche->id,
                'statut' => 'en_attente'
            ]);
            
            // Ajouter les infos de distance, adresses et frais dans l'événement
            $proposition->distance_km = round($distanceMin, 2);
            $proposition->frais_livraison = $commande->frais_livraison;
            
            $commande->load('repere');
            $proposition->adresse_depart = $partenaire->adresse ?? 'Adresse boutique non définie';
            if ($commande->repere) {
                $proposition->adresse_arrivee = $commande->repere->adresse ?? 'Adresse client non définie';
                $proposition->lat_arrivee = $commande->repere->latitude;
                $proposition->lon_arrivee = $commande->repere->longitude;
            } else {
                $proposition->adresse_arrivee = 'Adresse client non définie';
                $proposition->lat_arrivee = null;
                $proposition->lon_arrivee = null;
            }
            $proposition->lat_depart = $partenaire->latitude;
            $proposition->lon_depart = $partenaire->longitude;
            
            event(new \App\Events\NouvellePropositionLivraison($proposition));
            
            // Dispatch du job pour expirer la proposition après 1 minute
            \App\Jobs\ExpirePropositionJob::dispatch($proposition->id)->delay(now()->addMinute());
            
            return true;
        }

        return false;
    }
}
