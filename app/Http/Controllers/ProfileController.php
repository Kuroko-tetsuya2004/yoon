<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\View\View;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request)
    {
        return inertia('Profile/Edit', [
            'user' => $request->user(),
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        if ($request->hasFile('photo_devanture')) {
            if ($user->photo_devanture) {
                \Illuminate\Support\Facades\Storage::disk('s3')->delete($user->photo_devanture);
            }
            $validated['photo_devanture'] = $request->file('photo_devanture')->store('boutiques', 's3');
        }

        $user->fill($validated);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validateWithBag('userDeletion', [
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    public function updateRappel(Request $request): RedirectResponse
    {
        $request->validate([
            'frequence_rappel_jours' => 'nullable|integer|min:1',
        ]);

        $user = $request->user();
        $user->rappel_actif = $request->has('rappel_actif');
        $user->frequence_rappel_jours = $request->input('frequence_rappel_jours');
        
        // Si activé et pas de date prévue, on initialise
        if ($user->rappel_actif && !$user->prochain_rappel_date && $user->frequence_rappel_jours) {
            $user->prochain_rappel_date = now()->addDays($user->frequence_rappel_jours);
        } elseif (!$user->rappel_actif) {
            $user->prochain_rappel_date = null; // on reset si désactivé
        }

        $user->save();

        return Redirect::back()->with('success', 'Vos préférences de rappel ont été enregistrées.');
    }
}
