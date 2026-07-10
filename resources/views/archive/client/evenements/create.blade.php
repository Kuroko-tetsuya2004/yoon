<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Organiser un événement') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-2xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <form method="POST" action="{{ route('evenements.store') }}">
                        @csrf

                        <!-- Titre -->
                        <div class="mb-4">
                            <label for="titre" class="block font-medium text-sm text-gray-700">Titre de l'événement</label>
                            <input id="titre" class="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
                                   type="text" name="titre" value="{{ old('titre') }}" required autofocus placeholder="Ex: Baptême de mon fils" />
                            @error('titre') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                        </div>

                        <!-- Type d'événement -->
                        <div class="mb-4">
                            <label for="type_evenement" class="block font-medium text-sm text-gray-700">Type d'événement</label>
                            <select id="type_evenement" name="type_evenement" class="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required>
                                <option value="">Sélectionnez un type</option>
                                <option value="bapteme" {{ old('type_evenement') == 'bapteme' ? 'selected' : '' }}>Baptême</option>
                                <option value="mariage" {{ old('type_evenement') == 'mariage' ? 'selected' : '' }}>Mariage</option>
                                <option value="deuil" {{ old('type_evenement') == 'deuil' ? 'selected' : '' }}>Deuil / Funérailles</option>
                                <option value="fete" {{ old('type_evenement') == 'fete' ? 'selected' : '' }}>Fête privée</option>
                                <option value="autre" {{ old('type_evenement') == 'autre' ? 'selected' : '' }}>Autre</option>
                            </select>
                            @error('type_evenement') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                        </div>

                        <!-- Date -->
                        <div class="mb-4">
                            <label for="date_evenement" class="block font-medium text-sm text-gray-700">Date et heure prévues</label>
                            <input id="date_evenement" class="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
                                   type="datetime-local" name="date_evenement" value="{{ old('date_evenement') }}" required />
                            <p class="text-xs text-gray-500 mt-1">Le matériel sera livré avant cette date.</p>
                            @error('date_evenement') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                        </div>

                        <!-- Repère de livraison -->
                        <div class="mb-6">
                            <label for="repere_id" class="block font-medium text-sm text-gray-700">Lieu de l'événement (Repère)</label>
                            @if($reperes->isEmpty())
                                <p class="text-red-500 text-sm mt-1">Vous n'avez pas de repère enregistré. <a href="{{ route('reperes.create') }}" class="underline text-blue-600">Ajouter un repère</a></p>
                            @else
                                <select id="repere_id" name="repere_id" class="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required>
                                    @foreach($reperes as $repere)
                                        <option value="{{ $repere->id }}" {{ old('repere_id') == $repere->id ? 'selected' : '' }}>
                                            {{ $repere->nom }} - {{ Str::limit($repere->description, 30) }}
                                        </option>
                                    @endforeach
                                </select>
                            @endif
                            @error('repere_id') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                        </div>

                        <div class="flex items-center justify-end mt-4">
                            <a class="underline text-sm text-gray-600 hover:text-gray-900 mr-4" href="{{ route('evenements.index') }}">
                                Annuler
                            </a>
                            <button type="submit" class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded shadow">
                                Créer l'événement
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
