<section>
    <header>
        <h2 class="text-lg font-medium text-gray-900">
            {{ __('Profile Information') }}
        </h2>

        <p class="mt-1 text-sm text-gray-600">
            {{ __("Update your account's profile information and email address.") }}
        </p>
    </header>

    <form id="send-verification" method="post" action="{{ route('verification.send') }}">
        @csrf
    </form>

    <form method="post" action="{{ route('profile.update') }}" class="mt-6 space-y-6" enctype="multipart/form-data">
        @csrf
        @method('patch')

        @if (session('status') === 'profile-updated')
            <div x-data="{ show: true }" x-show="show" x-transition x-init="setTimeout(() => show = false, 4000)" class="mb-4 p-4 text-sm text-green-800 rounded-lg bg-green-50 flex items-center" role="alert">
                <svg class="flex-shrink-0 inline w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                <div><span class="font-medium">Succès !</span> Vos informations de profil ont été mises à jour avec succès.</div>
            </div>
        @endif

        @if ($errors->any())
            <div class="mb-4 p-4 text-sm text-red-800 rounded-lg bg-red-50 flex items-center" role="alert">
                <svg class="flex-shrink-0 inline w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <div><span class="font-medium">Échec :</span> L'enregistrement a échoué. Veuillez corriger les erreurs ci-dessous.</div>
            </div>
        @endif

        <div>
            <x-input-label for="name" :value="__('Name')" />
            <x-text-input id="name" name="name" type="text" class="mt-1 block w-full" :value="old('name', $user->name)" required autofocus autocomplete="name" />
            <x-input-error class="mt-2" :messages="$errors->get('name')" />
        </div>

        <div>
            <x-input-label for="telephone" :value="__('Téléphone')" />
            <x-text-input id="telephone" name="telephone" type="tel" class="mt-1 block w-full" :value="old('telephone', $user->telephone)" required autocomplete="tel" />
            <x-input-error class="mt-2" :messages="$errors->get('telephone')" />
        </div>

        <div>
            <x-input-label for="email" :value="__('Email (Optionnel)')" />
            <x-text-input id="email" name="email" type="email" class="mt-1 block w-full" :value="old('email', $user->email)" autocomplete="username" />
            <x-input-error class="mt-2" :messages="$errors->get('email')" />

            @if ($user instanceof \Illuminate\Contracts\Auth\MustVerifyEmail && ! $user->hasVerifiedEmail())
                <div>
                    <p class="text-sm mt-2 text-gray-800">
                        {{ __('Your email address is unverified.') }}

                        <button form="send-verification" class="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            {{ __('Click here to re-send the verification email.') }}
                        </button>
                    </p>

                    @if (session('status') === 'verification-link-sent')
                        <p class="mt-2 font-medium text-sm text-green-600">
                            {{ __('A new verification link has been sent to your email address.') }}
                        </p>
                    @endif
                </div>
            @endif
        </div>

        @if ($user->role === 'livreur')
            <div class="mt-4 p-4 border rounded bg-gray-50">
                <h4 class="font-bold text-gray-700 mb-2">Informations Livreur</h4>
                <div class="mb-4">
                    <x-input-label for="moyen_transport" :value="__('Moyen de transport')" />
                    <select id="moyen_transport" name="moyen_transport" class="block mt-1 w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm">
                        <option value="">Sélectionnez un moyen de transport</option>
                        <option value="Moto" {{ old('moyen_transport', $user->moyen_transport) === 'Moto' ? 'selected' : '' }}>Moto</option>
                        <option value="Vélo" {{ old('moyen_transport', $user->moyen_transport) === 'Vélo' ? 'selected' : '' }}>Vélo</option>
                        <option value="Voiture" {{ old('moyen_transport', $user->moyen_transport) === 'Voiture' ? 'selected' : '' }}>Voiture</option>
                        <option value="Camionnette" {{ old('moyen_transport', $user->moyen_transport) === 'Camionnette' ? 'selected' : '' }}>Camionnette</option>
                    </select>
                    <x-input-error class="mt-2" :messages="$errors->get('moyen_transport')" />
                </div>
                <div>
                    <x-input-label for="disponibilite" :value="__('Disponibilité')" />
                    <div class="mt-1 block w-full">
                        <label class="inline-flex items-center">
                            <input type="hidden" name="disponibilite" value="0">
                            <input id="disponibilite" type="checkbox" class="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500" name="disponibilite" value="1" {{ old('disponibilite', $user->disponibilite) ? 'checked' : '' }}>
                            <span class="ml-2 text-sm text-gray-600">{{ __('Je suis actuellement disponible pour recevoir des courses') }}</span>
                        </label>
                    </div>
                    <x-input-error class="mt-2" :messages="$errors->get('disponibilite')" />
                </div>
            </div>
        @endif

        @if ($user->role === 'partenaire')
            <div class="mt-4 p-4 border rounded bg-gray-50">
                <h4 class="font-bold text-gray-700 mb-2">Informations Boutique</h4>
                
                <div class="mb-4">
                    <x-input-label for="type_service" :value="__('Type de service fourni')" />
                    <select id="type_service" name="type_service" class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full">
                        <option value="">Sélectionnez votre type de service</option>
                        <option value="gaz" {{ old('type_service', $user->type_service) === 'gaz' ? 'selected' : '' }}>Distributeur de gaz</option>
                        <option value="pondereux" {{ old('type_service', $user->type_service) === 'pondereux' ? 'selected' : '' }}>Vendeur de produits pondéreux</option>
                        <option value="traiteur" {{ old('type_service', $user->type_service) === 'traiteur' ? 'selected' : '' }}>Traiteur</option>
                        <option value="location" {{ old('type_service', $user->type_service) === 'location' ? 'selected' : '' }}>Loueur de matériel événementiel</option>
                    </select>
                    <x-input-error class="mt-2" :messages="$errors->get('type_service')" />
                </div>

                <div class="mb-4">
                    <x-input-label for="description_boutique" :value="__('Description de la boutique')" />
                    <textarea id="description_boutique" name="description_boutique" class="block mt-1 w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm" rows="2">{{ old('description_boutique', $user->description_boutique) }}</textarea>
                    <x-input-error :messages="$errors->get('description_boutique')" class="mt-2" />
                </div>

                <div class="mb-4">
                    <x-input-label for="photo_devanture" :value="__('Photo de la devanture')" />
                    @if($user->photo_devanture)
                        <div class="mt-2 mb-2">
                            <img src="{{ asset('storage/' . $user->photo_devanture) }}" alt="Photo actuelle" class="h-20 w-auto rounded border">
                        </div>
                    @endif
                    <input type="file" id="photo_devanture" name="photo_devanture" accept="image/*" class="block mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100">
                    <x-input-error :messages="$errors->get('photo_devanture')" class="mt-2" />
                </div>
            </div>
        @endif

        @if(in_array($user->role, ['livreur', 'partenaire']))
            <!-- Localisation GPS (Livreur & Partenaire) -->
            <div class="mt-4 p-4 border rounded bg-blue-50">
                <h4 class="font-bold text-blue-700 mb-2">Localisation GPS</h4>
                <p class="text-sm text-gray-600 mb-3">Votre position actuelle : {{ $user->latitude ? $user->latitude . ', ' . $user->longitude : 'Non renseignée' }}.</p>
                <p class="text-xs text-gray-500 mb-3">En mettant à jour votre géolocalisation, vous acceptez notre <a href="{{ route('politique-confidentialite') }}" target="_blank" class="text-blue-600 hover:underline">Politique de confidentialité</a>.</p>
                
                <button type="button" onclick="updateLocation()" class="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150">
                    Mettre à jour ma position
                </button>
                
                <p id="profile_location_status" class="text-sm mt-2 font-medium"></p>

                <input type="hidden" id="profile_latitude" name="latitude" value="{{ old('latitude', $user->latitude) }}">
                <input type="hidden" id="profile_longitude" name="longitude" value="{{ old('longitude', $user->longitude) }}">
                
                <x-input-error :messages="$errors->get('latitude')" class="mt-2" />
            </div>

            <script>
                function updateLocation() {
                    const statusLabel = document.getElementById('profile_location_status');
                    statusLabel.textContent = "Recherche en cours...";
                    statusLabel.className = "text-sm mt-2 text-blue-600 font-medium";

                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            function(position) {
                                document.getElementById('profile_latitude').value = position.coords.latitude;
                                document.getElementById('profile_longitude').value = position.coords.longitude;
                                statusLabel.textContent = "Position détectée avec succès ! N'oubliez pas d'enregistrer. ✓";
                                statusLabel.className = "text-sm mt-2 text-green-600 font-bold";
                            },
                            function(error) {
                                statusLabel.textContent = "Erreur lors de la détection : " + error.message;
                                statusLabel.className = "text-sm mt-2 text-red-600 font-medium";
                            }
                        );
                    } else {
                        statusLabel.textContent = "La géolocalisation n'est pas supportée par votre navigateur.";
                        statusLabel.className = "text-sm mt-2 text-red-600 font-medium";
                    }
                }
            </script>
        @endif

        <div class="flex items-center gap-4">
            <x-primary-button>{{ __('Enregistrer') }}</x-primary-button>
        </div>
    </form>
</section>
