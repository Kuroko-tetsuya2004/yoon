import React, { useEffect, useRef, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

// ─── Error Boundary ───────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(error) { return { hasError: true, error }; }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '30px', background: '#fff1f0', border: '1px solid #ffa39e', borderRadius: 8, margin: 20 }}>
                    <h2 style={{ color: '#cf1322' }}>⚠️ Erreur dans le Module Courses</h2>
                    <pre style={{ color: '#820014', fontSize: 13, whiteSpace: 'pre-wrap' }}>{this.state.error?.toString()}</pre>
                    <button onClick={() => window.location.reload()} style={{ marginTop: 12, padding: '8px 16px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                        Recharger la page
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

// ─── Composant Principal ───────────────────────────────────────────────────────
export default function Courses(props) {
    return <ErrorBoundary><CoursesContent {...props} /></ErrorBoundary>;
}

function CoursesContent({ auth, livraisons: livraisonsRaw, proposition, partenaireProposition, flash }) {
    const livraisons = Array.isArray(livraisonsRaw) ? livraisonsRaw : Object.values(livraisonsRaw || {});

    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const routingControl = useRef(null);
    const [selectedLivraison, setSelectedLivraison] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    // ── Initialisation de la carte Leaflet ──────────────────────────────────
    useEffect(() => {
        if (!mapInstance.current && mapRef.current && livraisons.length > 0) {
            mapInstance.current = L.map(mapRef.current).setView([14.6928, -17.4467], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap'
            }).addTo(mapInstance.current);
        }

        return () => {
            if (mapInstance.current) {
                if (routingControl.current) {
                    try { mapInstance.current.removeControl(routingControl.current); } catch (_) {}
                    routingControl.current = null;
                }
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [livraisons.length]);

    // ── Géolocalisation: envoi de position toutes les 30s ───────────────────
    useEffect(() => {
        const sendLocationUpdate = () => {
            if (!navigator.geolocation) return;
            navigator.geolocation.getCurrentPosition((position) => {
                const newLat = position.coords.latitude;
                const newLng = position.coords.longitude;
                axios.post(route('livreur.location.update'), { latitude: newLat, longitude: newLng })
                    .catch(err => console.error('Erreur MAJ GPS:', err));
            }, (err) => console.warn('Géolocalisation indisponible:', err));
        };

        sendLocationUpdate();
        const interval = setInterval(sendLocationUpdate, 30000);
        return () => clearInterval(interval);
    }, []);

    // ── Polling de secours: rafraîchissement automatique des données toutes les 10s ──
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ['livraisons', 'proposition', 'partenaireProposition'],
                preserveState: true,
                preserveScroll: true
            });
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    // ── Affichage de l'itinéraire sur la carte ───────────────────────────────
    const showMap = (livraison) => {
        setSelectedLivraison(livraison);
        if (!mapInstance.current) return;

        // Supprimer uniquement les anciens marqueurs (l'itinéraire sera mis à jour par setWaypoints)
        mapInstance.current.eachLayer(layer => {
            if (layer instanceof L.Marker) mapInstance.current.removeLayer(layer);
        });

        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition((position) => {
            if (!mapInstance.current) return;
            const livreurLat = position.coords.latitude;
            const livreurLng = position.coords.longitude;
            const partLat = livraison.partenaire?.latitude;
            const partLng = livraison.partenaire?.longitude;
            const clientLat = livraison.commande?.repere?.latitude;
            const clientLng = livraison.commande?.repere?.longitude;

            let waypoints = [];
            if (livraison.statut_livraison === 'en_attente' && partLat && partLng && clientLat && clientLng) {
                waypoints = [L.latLng(livreurLat, livreurLng), L.latLng(partLat, partLng), L.latLng(clientLat, clientLng)];
            } else if (livraison.statut_livraison === 'en_route' && clientLat && clientLng) {
                waypoints = [L.latLng(livreurLat, livreurLng), L.latLng(clientLat, clientLng)];
            } else if (livraison.statut_livraison === 'retour_boutique' && partLat && partLng) {
                waypoints = [L.latLng(livreurLat, livreurLng), L.latLng(partLat, partLng)];
            }

            if (waypoints.length === 0) {
                if (routingControl.current) {
                    try { mapInstance.current.removeControl(routingControl.current); } catch (_) {}
                    routingControl.current = null;
                }
                return;
            }

            if (!routingControl.current) {
                routingControl.current = L.Routing.control({
                    waypoints,
                    routeWhileDragging: false,
                    addWaypoints: false,
                    fitSelectedRoutes: true,
                    show: false,
                    lineOptions: { styles: [{ color: '#4f46e5', weight: 6 }] }
                }).addTo(mapInstance.current);
            } else {
                routingControl.current.setWaypoints(waypoints);
            }

            // Marqueur boutique
            if (partLat && partLng) {
                const photoUrl = livraison.partenaire?.photo_devanture
                    ? (livraison.partenaire.photo_devanture_url || `/storage/${livraison.partenaire.photo_devanture}`)
                    : null;
                L.marker([partLat, partLng]).addTo(mapInstance.current).bindPopup(`
                    <div style="text-align:center">
                        <b>Boutique: ${livraison.partenaire?.name || ''}</b><br/>
                        ${photoUrl ? `<img src="${photoUrl}" style="width:100px;margin-top:5px;border-radius:4px"/>` : ''}
                    </div>`);
            }
            // Marqueur client
            if (clientLat && clientLng && livraison.statut_livraison !== 'retour_boutique') {
                const photoUrl = livraison.commande?.repere?.photo ? `/storage/${livraison.commande.repere.photo}` : null;
                L.marker([clientLat, clientLng]).addTo(mapInstance.current).bindPopup(`
                    <div style="text-align:center">
                        <b>Client: ${livraison.commande?.client?.name || ''}</b><br/>
                        ${photoUrl ? `<img src="${photoUrl}" style="width:100px;margin-top:5px;border-radius:4px"/>` : ''}
                    </div>`).openPopup();
            }
        }, (err) => console.warn('Géolocalisation indisponible:', err));
    };

    const updateLivraisonStatus = (e, id, status) => {
        e.stopPropagation();
        if (updatingId) return;
        setUpdatingId(id);
        router.patch(route('livreur.livraisons.update', id), { statut_livraison: status }, {
            onFinish: () => setUpdatingId(null),
            onError: () => setUpdatingId(null),
        });
    };

    const getMapTitle = () => {
        if (!selectedLivraison) return 'Itinéraire';
        switch (selectedLivraison.statut_livraison) {
            case 'en_attente': return 'Itinéraire complet (Vers boutique puis Client)';
            case 'en_route': return 'Itinéraire vers le client';
            case 'retour_boutique': return 'Itinéraire retour vers la boutique (Consigne)';
            default: return 'Itinéraire';
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Module Courses</h2>}>
            <Head title="Mes Courses" />

            <div className="pb-12 pt-2 sm:pt-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    {flash?.success && (
                        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                            {flash.error}
                        </div>
                    )}

                    {/* Proposition de livraison active */}
                    {proposition && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-blue-50 p-6 rounded-xl shadow-md border-l-4 border-blue-500"
                        >
                            <h3 className="text-xl font-bold text-blue-900 mb-2">🚀 Nouvelle course proposée !</h3>
                            <p className="text-blue-800 mb-4">Une commande à proximité nécessite un livreur.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <h4 className="font-semibold text-gray-700 text-sm uppercase">Récupération (Boutique)</h4>
                                    <p className="font-bold mt-1">{partenaireProposition?.name || proposition.adresse_depart || '—'}</p>
                                    <p className="text-sm text-gray-600">{partenaireProposition?.description_boutique || ''}</p>
                                    {partenaireProposition?.photo_devanture && (
                                        <img
                                            src={partenaireProposition.photo_devanture_url || `/storage/${partenaireProposition.photo_devanture}`}
                                            className="h-16 w-auto mt-2 rounded border"
                                            alt="Devanture"
                                        />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-700 text-sm uppercase">Livraison (Client)</h4>
                                    <p className="font-bold mt-1">{proposition.commande?.client?.name || 'Client Inconnu'}</p>
                                    <p className="text-sm text-gray-950 mt-1">📍 {proposition.adresse_arrivee || '—'}</p>
                                    <p className="text-sm text-gray-600">{proposition.commande?.repere?.nom} - {proposition.commande?.repere?.description}</p>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded mb-4 flex justify-between items-center shadow-sm">
                                <div>
                                    <p className="text-sm text-gray-500">Distance Totale</p>
                                    <p className="font-bold text-lg text-blue-700">{proposition.distance_km ?? '?'} km</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Frais de Livraison</p>
                                    <p className="font-bold text-lg text-emerald-600">{Number(proposition.frais_livraison ?? 0).toLocaleString('fr-FR')} FCFA</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => router.patch(route('livreur.propositions.accepter', proposition.id))}
                                    className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow transition"
                                >
                                    Accepter la course
                                </button>
                                <button
                                    onClick={() => router.patch(route('livreur.propositions.refuser', proposition.id))}
                                    className="w-full sm:w-auto bg-white border border-red-300 text-red-600 hover:bg-red-50 font-bold py-3 px-6 rounded-lg shadow-sm transition"
                                >
                                    Refuser
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Livraisons en cours + Carte */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Liste des livraisons */}
                        <div className="lg:col-span-5">
                            <h3 className="text-lg font-medium text-slate-900 mb-4">Mes courses actives</h3>
                            {livraisons.length === 0 ? (
                                <div className="bg-white p-6 rounded-lg shadow-sm text-gray-500 text-center border border-slate-100">
                                    Aucune livraison en cours pour le moment.
                                </div>
                            ) : (
                                livraisons.map(livraison => (
                                    <motion.div
                                        key={livraison.id}
                                        whileHover={{ scale: 1.01 }}
                                        onClick={() => showMap(livraison)}
                                        className={`bg-white p-5 rounded-xl shadow-sm mb-4 border-l-4 cursor-pointer transition border border-slate-100 ${
                                            livraison.statut_livraison === 'en_route' ? 'border-l-indigo-500' :
                                            livraison.statut_livraison === 'en_attente' ? 'border-l-yellow-400' :
                                            livraison.statut_livraison === 'retour_boutique' ? 'border-l-orange-500' : 'border-l-green-500'
                                        } ${selectedLivraison?.id === livraison.id ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-gray-900">Commande #{String(livraison.commande_id).padStart(5, '0')}</p>
                                                <p className="text-sm text-gray-600 mt-1">Client : {livraison.commande?.client?.name || 'Client Inconnu'}</p>
                                                <p className="text-xs text-gray-900 mt-1 font-medium">📍 {livraison.commande?.repere?.adresse || 'Adresse non spécifiée'}</p>
                                                {livraison.commande?.type_commande === 'gaz' && (
                                                    <>
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                                                            Gaz - {livraison.commande?.gaz?.quantite}x {livraison.commande?.gaz?.type_bonbonne}
                                                        </span>
                                                        {livraison.commande?.gaz?.contenant_vide && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 mt-2 ml-2">
                                                                ⚠️ Récupérer vide
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                                    livraison.statut_livraison === 'en_route' ? 'bg-indigo-100 text-indigo-800' :
                                                    livraison.statut_livraison === 'livree' ? 'bg-green-100 text-green-800' :
                                                    livraison.statut_livraison === 'retour_boutique' ? 'bg-orange-100 text-orange-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {livraison.statut_livraison === 'en_attente' ? 'Aller à la boutique' :
                                                     livraison.statut_livraison === 'en_route' ? 'En livraison' :
                                                     livraison.statut_livraison === 'retour_boutique' ? 'Retourner consigne' : 'Livrée'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-gray-100 flex space-x-2" onClick={e => e.stopPropagation()}>
                                            {livraison.statut_livraison === 'en_attente' && (
                                                <button
                                                    disabled={updatingId === livraison.id}
                                                    onClick={(e) => updateLivraisonStatus(e, livraison.id, 'en_route')}
                                                    className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg text-sm transition shadow-sm"
                                                >
                                                    {updatingId === livraison.id ? 'Mise à jour...' : "J'ai récupéré la commande"}
                                                </button>
                                            )}
                                            {livraison.statut_livraison === 'en_route' && (
                                                <div className="w-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-center py-2 px-4 rounded-lg text-sm shadow-sm font-medium">
                                                    En attente de confirmation par le client...
                                                </div>
                                            )}
                                            {livraison.statut_livraison === 'retour_boutique' && (
                                                <div className="w-full bg-orange-50 text-orange-800 p-3 rounded-lg border border-orange-200 text-sm">
                                                    <p className="font-bold mb-1">Logistique Inversée</p>
                                                    <p>Veuillez ramener la bouteille vide à la boutique du partenaire ({livraison.partenaire?.name || 'Partenaire'}). La course se terminera lorsque le partenaire confirmera la réception.</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Carte Interactive */}
                        <div className="lg:col-span-7">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 h-[450px] md:h-[600px] sticky top-6 flex flex-col">
                                <h3 className="text-lg font-medium text-slate-900 mb-2">{getMapTitle()}</h3>
                                <div ref={mapRef} className="w-full flex-grow rounded-lg bg-gray-100 relative z-0 border border-slate-200">
                                    {livraisons.length === 0 && (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 z-10 bg-gray-50 bg-opacity-90 rounded-lg">
                                            <div className="text-center">
                                                <div className="text-4xl mb-2">🏍️</div>
                                                <p className="font-semibold text-slate-700">Aucune course active</p>
                                                <p className="text-sm text-slate-500">Les propositions de livraison s'afficheront ici en temps réel.</p>
                                            </div>
                                        </div>
                                    )}
                                    {livraisons.length > 0 && !selectedLivraison && (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 z-10 bg-gray-50 bg-opacity-90 rounded-lg">
                                            <div className="text-center">
                                                <div className="text-4xl mb-2">🗺️</div>
                                                <p className="font-semibold text-slate-700">Sélectionnez une course active</p>
                                                <p className="text-sm text-slate-500">Cliquez sur une course à gauche pour afficher son itinéraire sur la carte.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
