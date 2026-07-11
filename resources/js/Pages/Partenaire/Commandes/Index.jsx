import { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

export default function Index({ auth, commandes, flash }) {
    const { patch, post } = useForm();
    const { data: refusData, setData: setRefusData, patch: patchRefus, processing: refusProcessing, reset: resetRefus } = useForm({ motif_refus: '' });
    
    const [refusModalId, setRefusModalId] = useState(null);
    const [retourModalId, setRetourModalId] = useState(null);

    const typeColors = {
        'gaz': 'bg-orange-100 text-orange-800',
        'pondereux': 'bg-amber-100 text-amber-800',
        'materiel': 'bg-purple-100 text-purple-800',
        'evenementielle': 'bg-indigo-100 text-indigo-800',
    };

    const statutColors = {
        'en_attente': 'bg-yellow-100 text-yellow-800',
        'acceptee': 'bg-green-100 text-green-800',
        'en_livraison': 'bg-blue-100 text-blue-800',
        'livree': 'bg-gray-100 text-gray-800',
        'annulee': 'bg-red-100 text-red-800',
    };

    const valider = (id) => patch(route('commandes.valider', id));
    const confirmerRetour = (id) => {
        post(route('commandes.confirmer_retour', id), { onSuccess: () => setRetourModalId(null) });
    };
    const confirmerRecuperation = (id) => patch(route('partenaire.commandes.confirmer_recuperation', id));

    const [mapModalId, setMapModalId] = useState(null);
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const routingControl = useRef(null);

    // Tracking GPS pour le partenaire s'il gère lui-même la livraison
    useEffect(() => {
        if (auth.user.propre_service_livraison) {
            const sendLocationUpdate = () => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((position) => {
                        axios.post(route('partenaire.location.update'), {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        }).catch(e => console.warn('Location update failed', e));
                    }, () => {}, { enableHighAccuracy: true });
                }
            };
            sendLocationUpdate();
            const interval = setInterval(sendLocationUpdate, 30000);
            return () => clearInterval(interval);
        }
    }, [auth.user.propre_service_livraison]);

    // Initialisation de la carte dans le Modal
    useEffect(() => {
        if (mapModalId && mapRef.current && !mapInstance.current) {
            mapInstance.current = L.map(mapRef.current).setView([14.6928, -17.4467], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance.current);

            const commande = commandes.find(c => c.id === mapModalId);
            if (commande && commande.repere && auth.user.latitude && auth.user.longitude) {
                routingControl.current = L.Routing.control({
                    waypoints: [
                        L.latLng(auth.user.latitude, auth.user.longitude),
                        L.latLng(commande.repere.latitude, commande.repere.longitude)
                    ],
                    routeWhileDragging: false,
                    addWaypoints: false,
                    fitSelectedRoutes: true,
                    show: false,
                    lineOptions: { styles: [{ color: '#10b981', weight: 6 }] }
                }).addTo(mapInstance.current);

                L.marker([commande.repere.latitude, commande.repere.longitude]).addTo(mapInstance.current).bindPopup("Client").openPopup();
            }
        }
        return () => {
            if (!mapModalId && mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
                routingControl.current = null;
            }
        };
    }, [mapModalId, commandes, auth.user]);

    const updateLivraisonStatus = (id, status) => {
        patch(route('partenaire.commandes.livraison.update', id), {
            data: { statut_livraison: status }
        });
    };

    const submitRefus = (e, id) => {
        e.preventDefault();
        patchRefus(route('partenaire.commandes.refuser', id), {
            onSuccess: () => {
                setRefusModalId(null);
                resetRefus();
            }
        });
    };

    const formatPrice = (price) => Number(price).toLocaleString('fr-FR');
    const formatDate = (dateString) => new Date(dateString).toLocaleString('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Commandes Reçues</h2>}>
            <Head title="Commandes Reçues" />

            <div className="pb-12 pt-2 sm:pt-6">
                <div className="w-full">
                    
                    

                    

                    <div className="bg-white overflow-hidden shadow-sm border border-gray-100 sm:rounded-xl">
                        <div className="p-0 sm:p-6 text-gray-900">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Livreur</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Détails</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {commandes.length === 0 ? (
                                            <tr>
                                                <td colSpan="9" className="px-6 py-10 text-center text-sm text-gray-500">
                                                    Aucune commande reçue pour le moment.
                                                </td>
                                            </tr>
                                        ) : (
                                            commandes.map(commande => (
                                                <motion.tr 
                                                    key={commande.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {commande.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{commande.client?.name}</div>
                                                        <div className="text-sm text-gray-500">{commande.client?.telephone}</div>
                                                        {commande.repere && (
                                                            <div className="text-xs text-gray-500 mt-1 flex items-start">
                                                                <span className="mr-1">📍</span>
                                                                <span className="whitespace-normal">{commande.repere.nom} {commande.repere.adresse ? `(${commande.repere.adresse})` : ''}</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${typeColors[commande.type_commande] || 'bg-gray-100 text-gray-800'}`}>
                                                            {commande.type_commande}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {commande.livraison?.livreur ? (
                                                            <div className="flex items-center">
                                                                <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs mr-2">
                                                                    {commande.livraison.livreur.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <div className="font-medium text-gray-900">{commande.livraison.livreur.name}</div>
                                                                    <div className="text-xs text-gray-500">{commande.livraison.livreur.telephone}</div>
                                                                    {commande.livraison.livreur.moyen_transport && (
                                                                        <div className="text-[10px] bg-gray-100 text-gray-600 px-1 py-0.5 rounded mt-0.5 inline-block border">
                                                                            🚗 {commande.livraison.livreur.moyen_transport}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400 text-xs italic">Non assigné</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {commande.type_commande === 'gaz' && commande.gaz && (
                                                            <>{commande.gaz.type_bonbonne} x{commande.gaz.quantite}</>
                                                        )}
                                                        {commande.type_commande === 'pondereux' && commande.pondereux && (
                                                            <>{commande.pondereux.type_produit} x{commande.pondereux.quantite}</>
                                                        )}
                                                        {commande.type_commande === 'materiel' && commande.materiel && (
                                                            <>
                                                                {commande.materiel.type_materiel} x{commande.materiel.quantite}
                                                                <br/><span className="text-xs text-indigo-600">Du {commande.materiel.date_debut} au {commande.materiel.date_fin}</span>
                                                            </>
                                                        )}
                                                        {commande.type_commande === 'evenementielle' && commande.evenementielle && (
                                                            <>
                                                                <span className="font-semibold">{commande.evenementielle.titre}</span><br/>
                                                                <ul className="list-disc pl-4 text-xs text-indigo-600">
                                                                    {commande.evenementielle.prestations?.map(prestation => (
                                                                        <li key={prestation.id}>{prestation.produit?.nom_produit} x{prestation.quantite}</li>
                                                                    ))}
                                                                </ul>
                                                            </>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                        {formatPrice(commande.montant_total)} F
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statutColors[commande.statut] || 'bg-gray-100 text-gray-800'}`}>
                                                            {commande.statut.replace('_', ' ')}
                                                        </span>
                                                        {commande.statut === 'annulee' && commande.motif_refus && (
                                                            <p className="text-xs text-red-500 mt-1">{commande.motif_refus}</p>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(commande.created_at)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        {commande.statut === 'en_attente' ? (
                                                            <div className="flex flex-col items-end space-y-2">
                                                                <button onClick={() => valider(commande.id)} className="inline-flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded shadow-sm transition">
                                                                    ✓ Valider
                                                                </button>
                                                                <button onClick={() => setRefusModalId(commande.id)} className="inline-flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded shadow-sm transition">
                                                                    ✗ Refuser
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-end space-y-2">
                                                                {auth.user.propre_service_livraison && (commande.statut === 'acceptee' || commande.statut === 'en_livraison') && (
                                                                    <>
                                                                        <button onClick={() => setMapModalId(commande.id)} className="inline-flex items-center px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded shadow-sm transition">
                                                                            📍 Voir Carte
                                                                        </button>
                                                                        {commande.statut === 'acceptee' && (
                                                                            <button onClick={() => updateLivraisonStatus(commande.id, 'en_route')} className="inline-flex items-center px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium rounded shadow-sm transition">
                                                                                🚚 Commencer Livraison
                                                                            </button>
                                                                        )}
                                                                        {commande.statut === 'en_livraison' && (
                                                                            <button onClick={() => updateLivraisonStatus(commande.id, 'livree')} className="inline-flex items-center px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded shadow-sm transition">
                                                                                ✅ Marquer Livrée
                                                                            </button>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}

                                                        {commande.type_commande === 'gaz' && commande.gaz?.contenant_vide && commande.livraison?.statut_livraison === 'retour_boutique' && (
                                                            <div className="mt-2 text-right">
                                                                <button onClick={() => setRetourModalId(commande.id)} className="inline-flex items-center px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded shadow-sm transition">
                                                                    Confirmer retour consigne
                                                                </button>
                                                            </div>
                                                        )}

                                                        {commande.type_commande === 'evenementielle' && commande.evenementielle?.prestations?.find(p => p.partenaire_id === auth.user.id && p.statut === 'livree') && (
                                                            <div className="mt-2 text-right">
                                                                <button onClick={() => confirmerRecuperation(commande.id)} className="inline-flex items-center px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded shadow-sm transition">
                                                                    Confirmer récupération (Libérer caution)
                                                                </button>
                                                            </div>
                                                        )}

                                                        {commande.type_commande === 'materiel' && commande.materiel?.partenaire_id === auth.user.id && commande.statut === 'livree' && (
                                                            <div className="mt-2 text-right">
                                                                <button onClick={() => confirmerRecuperation(commande.id)} className="inline-flex items-center px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded shadow-sm transition">
                                                                    Confirmer récupération du matériel
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </motion.tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Refus */}
            <AnimatePresence>
                {refusModalId && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center"
                        onClick={() => setRefusModalId(null)}
                    >
                        <motion.div 
                            initial={{ y: -50 }}
                            animate={{ y: 0 }}
                            className="relative p-5 border w-11/12 max-w-md shadow-lg rounded-md bg-white text-left"
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Motif du refus</h3>
                            <form onSubmit={(e) => submitRefus(e, refusModalId)}>
                                <textarea 
                                    value={refusData.motif_refus}
                                    onChange={e => setRefusData('motif_refus', e.target.value)}
                                    rows="3" 
                                    required 
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" 
                                    placeholder="Expliquez au client pourquoi vous refusez cette commande..."
                                />
                                <div className="flex justify-end space-x-2 mt-4">
                                    <button type="button" onClick={() => setRefusModalId(null)} className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300 transition">Annuler</button>
                                    <button type="submit" disabled={refusProcessing} className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition disabled:opacity-50">Confirmer le refus</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}

                {/* Modal Retour */}
                {retourModalId && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center"
                        onClick={() => setRetourModalId(null)}
                    >
                        <motion.div 
                            initial={{ y: -50 }}
                            animate={{ y: 0 }}
                            className="relative p-5 border w-11/12 max-w-md shadow-lg rounded-md bg-white text-left"
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirmation de retour</h3>
                            <p className="text-sm text-gray-600 mb-4">Confirmez-vous avoir bien reçu la bouteille vide récupérée chez le client par le livreur ?</p>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button type="button" onClick={() => setRetourModalId(null)} className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300 transition">Annuler</button>
                                <button type="button" onClick={() => confirmerRetour(retourModalId)} className="px-4 py-2 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition">Oui, consigne récupérée</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
                {/* Modal Carte Itinéraire */}
                {mapModalId && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
                        onClick={() => setMapModalId(null)}
                    >
                        <motion.div 
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="relative w-full max-w-4xl shadow-2xl rounded-xl bg-white overflow-hidden flex flex-col"
                            style={{ height: '80vh' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="bg-slate-800 p-4 flex justify-between items-center text-white">
                                <h3 className="text-lg font-bold">Itinéraire de Livraison (Commande #{mapModalId})</h3>
                                <button onClick={() => setMapModalId(null)} className="text-white hover:text-red-400 transition font-bold text-xl">&times;</button>
                            </div>
                            <div className="flex-grow relative">
                                <div ref={mapRef} className="absolute inset-0 z-0"></div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
