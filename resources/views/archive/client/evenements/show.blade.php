<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Panier de l\'événement : ') }} {{ $evenement->titre }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
            <!-- Messages Flash -->
            @if(session('success'))
                <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <span class="block sm:inline">{{ session('success') }}</span>
                </div>
            @endif
            @if(session('error'))
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span class="block sm:inline">{{ session('error') }}</span>
                </div>
            @endif

            <!-- Détails de l'événement -->
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h3 class="font-bold text-lg border-b pb-2 mb-2">Détails</h3>
                        <p><span class="font-semibold">Type:</span> {{ ucfirst($evenement->type_evenement) }}</p>
                        <p><span class="font-semibold">Date prévue:</span> {{ $evenement->date_evenement->format('d/m/Y à H:i') }}</p>
                        <p><span class="font-semibold">Statut:</span> 
                            <span class="px-2 py-1 text-xs font-semibold rounded-full {{ $evenement->commande->statut === 'panier' ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800' }}">
                                {{ ucfirst($evenement->commande->statut) }}
                            </span>
                        </p>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg border-b pb-2 mb-2">Lieu de livraison</h3>
                        <p class="font-semibold">{{ $evenement->commande->repere->nom }}</p>
                        <p class="text-sm text-gray-600">{{ $evenement->commande->repere->description }}</p>
                    </div>
                </div>
            </div>

            <!-- Liste des prestations (Panier) -->
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <h3 class="font-bold text-lg border-b pb-2 mb-4">Prestations sélectionnées</h3>
                    
                    @if($evenement->prestations->isEmpty())
                        <p class="text-gray-500 text-center py-4">Votre panier événementiel est vide.</p>
                    @else
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm text-left text-gray-500">
                                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" class="px-6 py-3">Produit/Service</th>
                                        <th scope="col" class="px-6 py-3">Partenaire</th>
                                        <th scope="col" class="px-6 py-3">Qté</th>
                                        <th scope="col" class="px-6 py-3">Prix unitaire</th>
                                        <th scope="col" class="px-6 py-3">Caution unitaire</th>
                                        <th scope="col" class="px-6 py-3">Total (Prix + Caution)</th>
                                        @if($evenement->commande->statut === 'panier')
                                            <th scope="col" class="px-6 py-3">Action</th>
                                        @endif
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach($evenement->prestations as $prestation)
                                        <tr class="bg-white border-b">
                                            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                {{ $prestation->produit->nom_produit }}
                                            </td>
                                            <td class="px-6 py-4">{{ $prestation->partenaire->name }}</td>
                                            <td class="px-6 py-4">{{ $prestation->quantite }}</td>
                                            <td class="px-6 py-4">{{ number_format($prestation->prix_unitaire, 0, ',', ' ') }} FCFA</td>
                                            <td class="px-6 py-4">{{ number_format($prestation->caution, 0, ',', ' ') }} FCFA</td>
                                            <td class="px-6 py-4 font-semibold text-orange-600">
                                                {{ number_format(($prestation->prix_unitaire * $prestation->quantite) + $prestation->caution, 0, ',', ' ') }} FCFA
                                            </td>
                                            @if($evenement->commande->statut === 'panier')
                                                <td class="px-6 py-4">
                                                    <form action="{{ route('evenements.remove_prestation', [$evenement, $prestation]) }}" method="POST">
                                                        @csrf
                                                        @method('DELETE')
                                                        <button type="submit" class="text-red-600 hover:text-red-900" title="Retirer">
                                                            Retirer
                                                        </button>
                                                    </form>
                                                </td>
                                            @endif
                                        </tr>
                                    @endforeach
                                </tbody>
                                <tfoot>
                                    <tr class="font-semibold text-gray-900 bg-gray-50">
                                        <td colspan="5" class="px-6 py-3 text-right">Montant Total à payer (incluant cautions) :</td>
                                        <td class="px-6 py-3 text-orange-600">{{ number_format($evenement->commande->montant_total, 0, ',', ' ') }} FCFA</td>
                                        @if($evenement->commande->statut === 'panier')
                                            <td></td>
                                        @endif
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    @endif
                </div>
            </div>

            @if($evenement->commande->statut === 'panier')
                <!-- Formulaire d'ajout de prestation -->
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6 text-gray-900">
                        <h3 class="font-bold text-lg border-b pb-2 mb-4">Ajouter du matériel ou un service</h3>
                        <form action="{{ route('evenements.add_prestation', $evenement) }}" method="POST" class="flex items-end space-x-4">
                            @csrf
                            <div class="flex-grow">
                                <label for="produit_id" class="block font-medium text-sm text-gray-700">Sélectionnez le matériel/service</label>
                                <select id="produit_id" name="produit_id" class="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required>
                                    <option value="">Parcourir les prestataires...</option>
                                    @foreach($materiels as $materiel)
                                        <option value="{{ $materiel->id }}">
                                            {{ $materiel->nom_produit }} - {{ number_format($materiel->prix, 0, ',', ' ') }} FCFA/unité (Par {{ $materiel->partenaire->name }})
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="w-24">
                                <label for="quantite" class="block font-medium text-sm text-gray-700">Quantité</label>
                                <input type="number" id="quantite" name="quantite" min="1" value="1" class="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required>
                            </div>
                            <div>
                                <button type="submit" class="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded shadow">
                                    Ajouter au panier
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Validation finale -->
                <div class="bg-gray-50 border border-gray-200 overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6">
                        <h3 class="font-bold text-lg mb-2">Valider la commande événementielle</h3>
                        <p class="text-sm text-gray-600 mb-4">Une fois validée, la commande sera transmise aux prestataires concernés. Vous pourrez payer le montant total ({{ number_format($evenement->commande->montant_total, 0, ',', ' ') }} FCFA) incluant la caution.</p>
                        
                        <form action="{{ route('evenements.checkout', $evenement) }}" method="POST">
                            @csrf
                            <div class="flex items-center space-x-4">
                                <select name="mode_paiement" class="rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required>
                                    <option value="">-- Choisir un mode de paiement --</option>
                                    <option value="wave">Payer par Wave</option>
                                    <option value="orange_money">Payer par Orange Money</option>
                                    <option value="especes">Payer à la livraison</option>
                                </select>
                                <button type="submit" class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded shadow" {{ $evenement->prestations->isEmpty() ? 'disabled' : '' }}>
                                    Confirmer et Payer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            @endif
        </div>
    </div>
</x-app-layout>
