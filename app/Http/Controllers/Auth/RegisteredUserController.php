<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create()
    {
        return inertia('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'telephone' => ['required', 'string', 'digits:9', 'unique:'.User::class],
            'email' => ['nullable', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'role' => ['required', 'string', 'in:client,livreur,partenaire'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'latitude' => ['nullable', 'numeric'],
            'longitude' => ['nullable', 'numeric'],
            'moyen_transport' => ['nullable', 'string', 'in:Moto,Vélo,Voiture,Camionnette'],
            'description_boutique' => ['nullable', 'string'],
            'adresse' => ['nullable', 'string'],
            'propre_service_livraison' => ['nullable', 'boolean'],
            'photo_devanture' => ['nullable', 'image', 'max:2048'],
            'photo_moyen_transport' => ['nullable', 'image', 'max:2048'],
        ]);

        $photoDevanturePath = null;
        if ($request->hasFile('photo_devanture')) {
            $photoDevanturePath = $request->file('photo_devanture')->store('boutiques', 's3');
        }

        $photoMoyenTransportPath = null;
        if ($request->hasFile('photo_moyen_transport')) {
            $photoMoyenTransportPath = $request->file('photo_moyen_transport')->store('transports', 's3');
        }

        $user = User::create([
            'name' => $request->name,
            'telephone' => $request->telephone,
            'email' => $request->email,
            'role' => $request->role,
            'password' => Hash::make($request->password),
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'moyen_transport' => $request->moyen_transport,
            'description_boutique' => $request->description_boutique,
            'adresse' => $request->adresse,
            'propre_service_livraison' => $request->propre_service_livraison ?? false,
            'photo_devanture' => $photoDevanturePath,
            'photo_moyen_transport' => $photoMoyenTransportPath,
            'statut_validation' => in_array($request->role, ['partenaire', 'livreur']) ? 'en_attente' : 'valide',
        ]);

        event(new Registered($user));

        if (in_array($request->role, ['partenaire', 'livreur'])) {
            return redirect(route('login'))->with('status', 'Votre compte a bien été créé et est en attente de validation par l\'administrateur.');
        }

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
