import { Head, Link } from '@inertiajs/react';

export default function PolitiqueConfidentialite() {
    return (
        <>
            <Head title="Politique de confidentialité" />
            <div className="min-h-screen bg-gray-50">
                <nav className="bg-white border-b border-gray-100 shadow-sm">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-9 h-9 bg-blue-600 text-white flex items-center justify-center rounded-full text-xl font-bold shadow">Y</div>
                            <span className="text-xl font-bold text-gray-800">Yoon</span>
                        </Link>
                        <Link href={route('login')} className="text-sm text-gray-600 hover:text-blue-600 font-medium transition">Connexion</Link>
                    </div>
                </nav>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Politique de Confidentialité</h1>
                    <p className="text-gray-500 mb-10">Dernière mise à jour : Juillet 2026</p>

                    <div className="bg-white rounded-xl shadow-sm p-8 space-y-8 text-gray-700 leading-relaxed">

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Collecte des données</h2>
                            <p>Dans le cadre de l'utilisation de la plateforme Yoon, nous collectons les informations suivantes :</p>
                            <ul className="list-disc ml-6 mt-2 space-y-1">
                                <li>Nom complet et numéro de téléphone</li>
                                <li>Adresses de livraison (repères GPS)</li>
                                <li>Historique des commandes</li>
                                <li>Position GPS (uniquement pour les livreurs, pendant les livraisons actives)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Utilisation des données</h2>
                            <p>Les données collectées sont utilisées exclusivement pour :</p>
                            <ul className="list-disc ml-6 mt-2 space-y-1">
                                <li>Traiter et suivre vos commandes</li>
                                <li>Assigner le livreur le plus proche pour votre livraison</li>
                                <li>Vous envoyer des notifications de statut</li>
                                <li>Améliorer nos services</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Partage des données</h2>
                            <p>Vos données personnelles ne sont jamais vendues à des tiers. Elles peuvent être partagées uniquement avec le partenaire et le livreur impliqués dans votre commande, dans le strict cadre de la réalisation de la livraison.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Position GPS des livreurs</h2>
                            <p>La position GPS des livreurs est mise à jour toutes les 20 secondes uniquement pendant les livraisons actives. Ces données sont utilisées pour afficher la carte de suivi aux clients concernés. Elles ne sont accessibles qu'aux parties directement impliquées dans la commande.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Sécurité</h2>
                            <p>Nous mettons en œuvre des mesures techniques appropriées pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Contact</h2>
                            <p>Pour toute question relative à la présente politique, vous pouvez nous contacter via la plateforme ou par téléphone.</p>
                        </section>
                    </div>

                    <div className="text-center mt-10">
                        <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">← Retour à l'accueil</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
