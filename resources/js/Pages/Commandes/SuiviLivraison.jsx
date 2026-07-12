import { useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { motion } from 'framer-motion';

export default function SuiviLivraison({ auth, commande }) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const { post: postForm, processing } = useForm();

    // Map initialization for tracking
    useEffect(() => {
        if (commande.statut === 'en_livraison' && commande.livraison?.livreur && mapRef.current) {
            const livreurLat = commande.livraison.livreur.latitude;
            const livreurLng = commande.livraison.livreur.longitude;
            const clientLat = commande.repere?.latitude ?? 0;
            const clientLng = commande.repere?.longitude ?? 0;

            if (livreurLat && livreurLng && clientLat && clientLng) {
                mapInstance.current = L.map(mapRef.current).setView([livreurLat, livreurLng], 14);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap'
                }).addTo(mapInstance.current);

                const routingControl = L.Routing.control({
                    waypoints: [
                        L.latLng(livreurLat, livreurLng),
                        L.latLng(clientLat, clientLng)
                    ],
                    routeWhileDragging: false,
                    addWaypoints: false,
                    fitSelectedRoutes: true,
                    show: false,
                    lineOptions: { styles: [{ color: '#2563eb', weight: 6 }] }
                }).addTo(mapInstance.current);

                const interval = setInterval(() => {
                    fetch(route('commandes.livreur_location', commande.id))
                        .then(res => res.json())
                        .then(data => {
                            if (data.latitude && data.longitude) {
                                routingControl.setWaypoints([
                                    L.latLng(data.latitude, data.longitude),
                                    L.latLng(clientLat, clientLng)
                                ]);
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

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Suivi de Livraison - Commande #{String(commande.id).padStart(5, '0')}</h2>}>
            <Head title={`Suivi Livraison #${String(commande.id).padStart(5, '0')}`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white overflow-hidden shadow-sm sm:rounded-lg"
                    >
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Suivi en temps réel</h3>
                                <Link 
                                    href={route('commandes.show', commande.id)}
                                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                                >
                                    &larr; Retour à la commande
                                </Link>
                            </div>

                            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8">
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
                                
                                <div className="mt-6 flex items-center bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                                    <div className="bg-gray-200 rounded-full h-12 w-12 flex items-center justify-center text-gray-500 font-bold text-2xl mr-4">
                                        {commande.livraison?.livreur?.name?.charAt(0) ?? '?'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-lg">Livreur : {commande.livraison?.livreur?.name ?? 'En cours d\'assignation...'}</p>
                                        <p className="text-sm text-gray-600 flex items-center mt-1">
                                            📞 <a href={`tel:${commande.livraison?.livreur?.telephone}`} className="ml-1 text-blue-600 hover:underline">{commande.livraison?.livreur?.telephone ?? '-'}</a>
                                        </p>
                                        {commande.livraison?.livreur?.moyen_transport && (
                                            <p className="text-sm text-gray-600 flex items-center mt-1">
                                                🏍️ <span className="ml-1 capitalize">{commande.livraison.livreur.moyen_transport}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {commande.statut === 'en_livraison' ? (
                                    <div className="mt-8">
                                        <h5 className="font-bold text-gray-900 mb-3 flex items-center">
                                            <span className="mr-2">📍</span> Position du livreur en temps réel
                                        </h5>
                                        <div ref={mapRef} className="w-full h-[400px] rounded-lg border-2 border-blue-100 bg-gray-100 relative z-0 overflow-hidden shadow-inner">
                                            {!(commande.livraison.livreur?.latitude && commande.livraison.livreur?.longitude) && (
                                                <div className="flex items-center justify-center h-full text-gray-500 bg-white">Position GPS du livreur non disponible pour le moment.</div>
                                            )}
                                        </div>
                                        
                                        <div className="mt-8 text-center bg-white p-6 rounded-lg border border-gray-100">
                                            <h4 className="font-bold text-gray-800 mb-2">Avez-vous reçu votre commande ?</h4>
                                            <button 
                                                onClick={() => postForm(route('commandes.confirmer_reception', commande.id))}
                                                disabled={processing}
                                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition transform hover:-translate-y-0.5 text-lg disabled:opacity-50 w-full sm:w-auto"
                                            >
                                                {processing ? 'Confirmation en cours...' : 'Oui, confirmer la réception'}
                                            </button>
                                            <p className="text-sm text-gray-500 mt-3 flex items-center justify-center">
                                                <span className="mr-1">⚠️</span> Cliquez ici uniquement lorsque le livreur vous a remis la marchandise.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-8 bg-white p-8 rounded-lg text-center border border-gray-100">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4 text-3xl">
                                            ⏳
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-2">Le livreur se prépare</h4>
                                        <p className="text-gray-500">Le suivi GPS s'affichera ici dès que le livreur sera en route vers votre adresse.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
