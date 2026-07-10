<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Mes Événements') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <!-- Messages Flash -->
            @if(session('success'))
                <div class="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <span class="block sm:inline">{{ session('success') }}</span>
                </div>
            @endif
            @if(session('error'))
                <div class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span class="block sm:inline">{{ session('error') }}</span>
                </div>
            @endif

            <div class="flex justify-end mb-4">
                <a href="{{ route('evenements.create') }}" class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded shadow">
                    + Organiser un événement
                </a>
            </div>

            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    @if($evenements->isEmpty())
                        <p class="text-gray-500 text-center py-4">Vous n'avez pas encore organisé d'événement.</p>
                    @else
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            @foreach($evenements as $evenement)
                                <div class="border rounded-lg p-5 shadow-sm hover:shadow-md transition">
                                    <div class="flex justify-between items-start mb-2">
                                        <h3 class="text-lg font-bold text-gray-800">{{ $evenement->titre }}</h3>
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full 
                                            {{ $evenement->commande->statut === 'panier' ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800' }}">
                                            {{ ucfirst($evenement->commande->statut) }}
                                        </span>
                                    </div>
                                    <p class="text-sm text-gray-600 mb-1"><span class="font-semibold">Type:</span> {{ ucfirst($evenement->type_evenement) }}</p>
                                    <p class="text-sm text-gray-600 mb-3"><span class="font-semibold">Date:</span> {{ $evenement->date_evenement->format('d/m/Y à H:i') }}</p>
                                    
                                    <div class="border-t pt-3 flex justify-between items-center mt-4">
                                        <span class="font-bold text-orange-600">{{ number_format($evenement->commande->montant_total, 0, ',', ' ') }} FCFA</span>
                                        <a href="{{ route('evenements.show', $evenement) }}" class="text-sm text-blue-600 hover:underline">Gérer le panier &rarr;</a>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    @endif
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
