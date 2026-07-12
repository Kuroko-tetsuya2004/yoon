<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        $pendingPartenaires = 0;
        $pendingLivreurs = 0;

        if ($user && $user->role === 'administrateur') {
            $pendingPartenaires = \App\Models\User::where('role', 'partenaire')->where('statut_validation', 'en_attente')->count();
            $pendingLivreurs = \App\Models\User::where('role', 'livreur')->where('statut_validation', 'en_attente')->count();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id'                => $user->id,
                    'name'              => $user->name,
                    'email'             => $user->email,
                    'telephone'         => $user->telephone,
                    'role'              => $user->role,
                    'statut_validation' => $user->statut_validation,
                    'disponibilite'     => $user->disponibilite,
                    'moyen_transport'   => $user->moyen_transport,
                    'photo_devanture'   => $user->photo_devanture,
                    'description_boutique' => $user->description_boutique,
                    'propre_service_livraison' => $user->propre_service_livraison ?? false,
                    'latitude'          => $user->latitude,
                    'longitude'         => $user->longitude,
                    'adresse'           => $user->adresse,
                ] : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
            ],
            'admin_badges' => [
                'partenaires' => $pendingPartenaires,
                'livreurs' => $pendingLivreurs,
            ],
        ];
    }
}
