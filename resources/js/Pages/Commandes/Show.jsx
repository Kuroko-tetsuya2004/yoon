import { useEffect, useRef, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

export default function Show({ auth, commande, flash }) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markerLivreur = useRef(null);
    const { post: postForm, processing } = useForm();

    // Map initialization for tracking
    useEffect(() => {
        if (commande.statut === 'en_livraison' && commande.livraison?.livreur && mapRef.current) {
            const livreurLat = commande.livraison.livreur.latitude;
            const livreurLng = commande.livraison.livreur.longitude;
            const clientLat = commande.repere.latitude;
            const clientLng = commande.repere.longitude;

            if (livreurLat && livreurLng) {
                mapInstance.current = L.map(mapRef.current).setView([livreurLat, livreurLng], 14);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap'
                }).addTo(mapInstance.current);

                const livreurIcon = L.icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });

                markerLivreur.current = L.marker([livreurLat, livreurLng], { icon: livreurIcon })
                    .addTo(mapInstance.current)
                    .bindPopup("<b>Le livreur est ici</b>");
                markerLivreur.current.openPopup();

                if (clientLat && clientLng) {
                    L.marker([clientLat, clientLng]).addTo(mapInstance.current)
                        .bindPopup("<b>Votre position</b>");

                    const bounds = L.latLngBounds([[livreurLat, livreurLng], [clientLat, clientLng]]);
                    mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
                }

                const interval = setInterval(() => {
                    fetch(route('commandes.livreur_location', commande.id))
                        .then(res => res.json())
                        .then(data => {
                            if (data.latitude && data.longitude) {
                                markerLivreur.current.setLatLng([data.latitude, data.longitude]);
                            }
                        })
                        .catch(err => console.error('Erreur tracking:', err));
                }, 20000);

                return () => {
                    clearInterval(interval);
                    mapInstance.current?.remove();
                };
            }
        }
    }, [commande]);

    const getStatusText = (statut) => {
        switch (statut) {
            case 'en_attente': return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">En attente de confirmation</span>;
            case 'confirmee':
            case 'acceptee': return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">Confirmée</span>;
            case 'en_livraison': return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">En cours de livraison</span>;
            case 'livree': return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">Livrée</span>;
            default: return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">{statut}</span>;
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Détail de la commande #{String(commande.id).padStart(5, '0')}</h2>}>
            <Head title={`Commande #${String(commande.id).padStart(5, '0')}`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    
                    

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white overflow-hidden shadow-sm sm:rounded-lg"
                    >
                        <div className="p-8">
                            <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 capitalize">Commande de {commande.type_commande}</h3>
                                    <p className="text-gray-500 mt-1">Passée le {new Date(commande.created_at).toLocaleString('fr-FR')}</p>
                                </div>
                                <div className="text-right">
                                    {getStatusText(commande.statut)}
                                </div>
                            </div>

                            {/* Tracking Livreur */}
                            {commande.livraison && (
                                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8">
                                    <h4 className="text-blue-900 font-bold text-lg mb-4 flex items-center">
                                        <span className="mr-2">🚚</span> Suivi de livraison
                                    </h4>
                                    
                                    <div className="relative">
                                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                                            <div style={{ width: commande.livraison.statut_livraison === 'en_attente' ? '33%' : (commande.livraison.statut_livraison === 'en_route' ? '66%' : '100%') }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-blue-800 font-medium">
                                            <span>Livreur assigné</span>
                                            <span>En route vers vous</span>
                                            <span>Livrée</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 flex items-center bg-white p-3 rounded shadow-sm">
                                        <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center text-gray-500 font-bold text-xl mr-3">
                                            {commande.livraison?.livreur?.name?.charAt(0) ?? '?'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">Livreur : {commande.livraison?.livreur?.name ?? 'En cours d\'assignation...'}</p>
                                            <p className="text-sm text-gray-600 flex items-center">
                                                📞 {commande.livraison?.livreur?.telephone ?? '-'}
                                            </p>
                                            {commande.livraison?.livreur?.moyen_transport && (
                                                <p className="text-sm text-gray-600 flex items-center mt-1">
                                                    🏍️ {commande.livraison.livreur.moyen_transport}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {commande.statut === 'en_livraison' && (
                                        <div className="mt-6">
                                            <h5 className="font-bold text-gray-900 mb-2">Suivi GPS du livreur</h5>
                                            <div ref={mapRef} className="w-full h-[300px] rounded border bg-gray-100 relative z-0">
                                                {!(commande.livraison.livreur?.latitude && commande.livraison.livreur?.longitude) && (
                                                    <div className="flex items-center justify-center h-full text-gray-500">Position du livreur non disponible pour le moment.</div>
                                                )}
                                            </div>
                                            
                                            <div className="mt-6 text-center">
                                                <button 
                                                    onClick={() => postForm(route('commandes.confirmer_reception', commande.id))}
                                                    disabled={processing}
                                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition transform hover:-translate-y-0.5 text-lg disabled:opacity-50"
                                                >
                                                    {processing ? 'Confirmation en cours...' : 'Confirmer la réception de la commande'}
                                                </button>
                                                <p className="text-sm text-gray-500 mt-2">
                                                    Cliquez ici uniquement lorsque le livreur vous a remis la commande.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Info Livraison */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Adresse de livraison</h4>
                                    <p className="font-medium text-gray-900">{commande.repere?.nom}</p>
                                    {commande.repere?.adresse && <p className="text-gray-600">{commande.repere.adresse}</p>}
                                    <p className="text-gray-500 text-sm mt-1">{commande.repere?.description}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Informations pratiques</h4>
                                    <p className="text-gray-900"><span className="font-medium">Créneau :</span> {commande.creneau}</p>
                                    <p className="text-gray-900 mt-1"><span className="font-medium">Paiement :</span> 
                                        {commande.mode_paiement === 'especes' ? ' Espèces à la livraison' : (commande.mode_paiement === 'wave' ? ' Wave' : ' Orange Money')}
                                    </p>
                                    <p className="text-gray-900 mt-1"><span className="font-medium">Statut paiement :</span> 
                                        {commande.statut_paiement === 'paye' ? <span className="text-green-600"> Payé</span> : <span className="text-yellow-600"> En attente</span>}
                                    </p>
                                </div>
                            </div>

                            {/* Items */}
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Détails de la commande</h4>
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 mb-6">
                                {commande.type_commande === 'gaz' && commande.gaz && (
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <p className="font-bold text-gray-900">Bonbonne de gaz {commande.gaz.type_bonbonne}</p>
                                            <p className="text-sm text-gray-500">Quantité : {commande.gaz.quantite}</p>
                                            {commande.gaz.contenant_vide ? (
                                                <p className="text-sm text-green-600 mt-1">🔄 Bouteille vide à rendre</p>
                                            ) : (
                                                <p className="text-sm text-yellow-600 mt-1">💰 Pas de bouteille vide (Consigne facturée)</p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-xl text-gray-900">{Number(commande.montant_total).toLocaleString('fr-FR')} FCFA</p>
                                        </div>
                                    </div>
                                )}
                                {commande.type_commande === 'pondereux' && commande.pondereux && (
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <p className="font-bold text-gray-900">Produit pondéreux : {commande.pondereux.type_produit}</p>
                                            <p className="text-sm text-gray-500">Quantité (en gros) : {commande.pondereux.quantite}</p>
                                            {commande.pondereux.poids_estime && (
                                                <p className="text-sm text-gray-600 mt-1">⚖️ Poids estimé : {commande.pondereux.poids_estime} tonnes</p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-xl text-gray-900">{Number(commande.montant_total).toLocaleString('fr-FR')} FCFA</p>
                                        </div>
                                    </div>
                                )}
                                {commande.type_commande === 'materiel' && commande.materiel && (
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <p className="font-bold text-gray-900">Location de matériel : {commande.materiel.type_materiel}</p>
                                            <p className="text-sm text-gray-500">Quantité : {commande.materiel.quantite}</p>
                                            <p className="text-sm text-purple-600 mt-1">
                                                📅 Du {new Date(commande.materiel.date_debut).toLocaleDateString('fr-FR')} au {new Date(commande.materiel.date_fin).toLocaleDateString('fr-FR')}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-xl text-gray-900">{Number(commande.montant_total).toLocaleString('fr-FR')} FCFA</p>
                                            <p className="text-xs text-gray-500">
                                                {Math.ceil((new Date(commande.materiel.date_fin) - new Date(commande.materiel.date_debut)) / (1000 * 60 * 60 * 24)) + 1} jour(s)
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 text-center">
                                <Link href={route('commandes.index')} className="text-indigo-600 hover:text-indigo-800 font-medium">
                                    &larr; Retour à mes commandes
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
