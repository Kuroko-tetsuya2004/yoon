<x-guest-layout>
    <div class="pt-4 bg-gray-100">
        <div class="min-h-screen flex flex-col items-center pt-6 sm:pt-0">
            <div>
                <a href="/">
                    <x-application-logo class="w-20 h-20 fill-current text-gray-500" />
                </a>
            </div>

            <div class="w-full sm:max-w-2xl mt-6 p-6 bg-white shadow-md overflow-hidden sm:rounded-lg prose">
                <h1 class="text-2xl font-bold text-gray-900 mb-4">Politique de Confidentialité de Yoon</h1>
                
                <p>Bienvenue sur Yoon. Cette politique explique comment nous recueillons, utilisons et protégeons vos données de géolocalisation.</p>

                <h2 class="text-xl font-bold mt-6 mb-2">1. Données de localisation collectées</h2>
                <p>Lorsque vous utilisez notre application en tant que livreur ou partenaire, nous vous demandons l'autorisation d'accéder à votre position GPS précise.</p>

                <h2 class="text-xl font-bold mt-6 mb-2">2. Utilisation de vos données</h2>
                <p>Vos coordonnées GPS sont utilisées exclusivement pour :</p>
                <ul class="list-disc ml-6 mb-4">
                    <li>Vous proposer les commandes les plus proches de votre position géographique.</li>
                    <li>Fournir un itinéraire optimisé pour la récupération et la livraison des commandes (Leaflet).</li>
                    <li>Informer les clients et partenaires de l'avancement de la livraison.</li>
                </ul>

                <h2 class="text-xl font-bold mt-6 mb-2">3. Suivi en temps réel</h2>
                <p>Pour les livreurs, la position est mise à jour périodiquement (toutes les 20 secondes environ) lorsque le tableau de bord est ouvert, afin de garantir des assignations pertinentes.</p>

                <h2 class="text-xl font-bold mt-6 mb-2">4. Protection des données</h2>
                <p>Vos données de localisation ne sont pas partagées avec des tiers à des fins publicitaires. Elles sont strictement confidentielles et réservées au fonctionnement logistique de l'application Yoon.</p>

                <h2 class="text-xl font-bold mt-6 mb-2">5. Révocation de l'accès</h2>
                <p>Vous pouvez à tout moment révoquer l'accès à la géolocalisation via les paramètres de votre navigateur ou de votre téléphone, bien que cela puisse restreindre l'utilisation de certaines fonctionnalités clés de l'application.</p>

                <div class="mt-8 text-center">
                    <a href="{{ url()->previous() }}" class="text-indigo-600 hover:text-indigo-800 underline">Retour</a>
                </div>
            </div>
        </div>
    </div>
</x-guest-layout>
