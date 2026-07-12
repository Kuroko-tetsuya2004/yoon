import { useEffect, useRef, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

// Fix for default leaflet icons in Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function Location({ auth }) {
    const user = auth.user;
    
    // Initialiser les coordonnées par défaut (Dakar si vide)
    const initialLat = user.latitude ? Number(user.latitude) : 14.6928;
    const initialLng = user.longitude ? Number(user.longitude) : -17.4467;

    const { data, setData, post, processing, errors } = useForm({
        latitude: user.latitude || '',
        longitude: user.longitude || '',
        adresse: user.adresse || '',
        description_boutique: user.description_boutique || '',
    });

    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markerInstance = useRef(null);
    const [isLocating, setIsLocating] = useState(false);

    useEffect(() => {
        // BUG-10 Fix: guard contre double initialisation en React Strict Mode
        if (mapInstance.current) return;

        // Initialiser la carte Leaflet
        mapInstance.current = L.map(mapRef.current).setView([initialLat, initialLng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(mapInstance.current);

        // Créer le marqueur déplaçable
        markerInstance.current = L.marker([initialLat, initialLng], { draggable: true }).addTo(mapInstance.current);

        // Mettre à jour les coordonnées lors du glissement du marqueur
        markerInstance.current.on('dragend', function (event) {
            const marker = event.target;
            const position = marker.getLatLng();
            setData(data => ({
                ...data,
                latitude: position.lat,
                longitude: position.lng
            }));
            fetchAddress(position.lat, position.lng);
        });

        // Clic sur la carte pour déplacer le marqueur
        mapInstance.current.on('click', function (e) {
            markerInstance.current.setLatLng(e.latlng);
            setData(data => ({
                ...data,
                latitude: e.latlng.lat,
                longitude: e.latlng.lng
            }));
            fetchAddress(e.latlng.lat, e.latlng.lng);
        });

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    const fetchAddress = async (lat, lng) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
            const json = await response.json();
            if (json && json.display_name) {
                setData('adresse', json.display_name);
            }
        } catch (error) {
            console.error("Erreur de géocodage inverse :", error);
        }
    };

    const handleLocateMe = () => {
        setIsLocating(true);
        if (!navigator.geolocation) {
            alert("La géolocalisation n'est pas supportée par votre navigateur.");
            setIsLocating(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                setData(data => ({ ...data, latitude: lat, longitude: lng }));
                mapInstance.current.setView([lat, lng], 16);
                markerInstance.current.setLatLng([lat, lng]);
                fetchAddress(lat, lng);
                setIsLocating(false);
            },
            () => {
                alert("Impossible d'obtenir votre position. Veuillez vérifier les permissions de votre navigateur.");
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const submit = (e) => {
        e.preventDefault();
        if (!data.latitude || !data.longitude) {
            alert("Veuillez définir une position sur la carte.");
            return;
        }
        post(route('partenaire.location.update'));
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Géolocalisation de la Boutique</h2>}>
            <Head title="Géolocaliser ma boutique" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white overflow-hidden shadow-sm sm:rounded-xl p-6 border border-slate-100"
                    >
                        
                        {/* Étape 1 : Bouton de Détection Automatique */}
                        <div className="mb-8">
                            <button 
                                type="button" 
                                onClick={handleLocateMe}
                                disabled={isLocating}
                                className="w-full flex justify-center items-center py-5 px-4 border-2 border-indigo-600 rounded-xl shadow-md text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-all duration-300 transform hover:scale-[1.01] disabled:opacity-50 disabled:scale-100"
                            >
                                <span className={`mr-3 ${isLocating ? 'animate-spin' : 'animate-bounce'}`}>
                                    {isLocating ? '⏳' : '📍'}
                                </span>
                                {isLocating ? "Recherche de votre position..." : "Étape 1 : ME GÉOLOCALISER (Cliquez ici)"}
                            </button>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Formulaire */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Informations de la Boutique</h3>
                                        <p className="text-sm text-gray-500">Ces détails aideront le livreur à vous trouver rapidement pour récupérer les commandes.</p>
                                    </div>

                                    <div>
                                        <label htmlFor="adresse" className="block font-medium text-sm text-gray-700">Adresse de la Boutique (Géolocalisée automatiquement ou modifiable)</label>
                                        <textarea
                                            id="adresse"
                                            rows="2"
                                            value={data.adresse}
                                            onChange={e => setData('adresse', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm"
                                            required
                                            placeholder="Cliquez sur 'Me géolocaliser' ou sur la carte pour remplir automatiquement."
                                        />
                                        {errors.adresse && <p className="mt-2 text-sm text-red-600">{errors.adresse}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="description_boutique" className="block font-medium text-sm text-gray-700">Description / Indications pour le livreur (Optionnel)</label>
                                        <textarea
                                            id="description_boutique"
                                            rows="3"
                                            value={data.description_boutique}
                                            onChange={e => setData('description_boutique', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm"
                                            placeholder="Ex: Boutique avec enseigne jaune en face de la mosquée, porte vitrée..."
                                        />
                                        {errors.description_boutique && <p className="mt-2 text-sm text-red-600">{errors.description_boutique}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-500">Latitude</label>
                                            <input type="text" readOnly value={data.latitude} className="mt-1 block w-full bg-gray-50 border-gray-200 text-gray-500 rounded-lg text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500">Longitude</label>
                                            <input type="text" readOnly value={data.longitude} className="mt-1 block w-full bg-gray-50 border-gray-200 text-gray-500 rounded-lg text-sm" />
                                        </div>
                                    </div>
                                </div>

                                {/* Carte Leaflet */}
                                <div>
                                    <label className="block mb-2 font-bold text-gray-700">Vérifiez et affinez votre position sur la carte</label>
                                    <p className="text-sm text-gray-600 mb-3">Déplacez le marqueur ou cliquez directement sur la carte pour désigner l'emplacement de votre commerce.</p>
                                    
                                    <div ref={mapRef} className="h-96 w-full rounded-2xl shadow-inner border-2 border-gray-200 relative z-0"></div>
                                    
                                    {errors.latitude || errors.longitude ? (
                                        <p className="mt-2 text-sm text-red-600">Veuillez définir une position valide sur la carte.</p>
                                    ) : null}
                                </div>
                            </div>

                            <div className="flex items-center justify-end mt-8 border-t border-gray-100 pt-6">
                                <Link
                                    href={route('partenaire.dashboard')}
                                    className="bg-white py-2.5 px-5 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none transition"
                                >
                                    Annuler
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="ml-3 inline-flex justify-center py-2.5 px-6 border border-transparent shadow-md text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition disabled:opacity-50"
                                >
                                    {processing ? 'Enregistrement...' : 'Enregistrer la position de ma boutique'}
                                </button>
                            </div>
                        </form>

                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
