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

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        adresse: '',
        description: '',
        latitude: '',
        longitude: '',
        photo: null,
    });

    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markerInstance = useRef(null);
    const [isLocating, setIsLocating] = useState(false);

    useEffect(() => {
        // Initialize map centered on Dakar
        mapInstance.current = L.map(mapRef.current).setView([14.6928, -17.4467], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(mapInstance.current);

        markerInstance.current = L.marker([14.6928, -17.4467], { draggable: true }).addTo(mapInstance.current);

        // Update coordinates on marker drag
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

        // Click on map to move marker
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
            mapInstance.current?.remove();
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
            console.error("Erreur géocodage inverse :", error);
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
        post(route('reperes.store'));
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Ajouter un repère</h2>}>
            <Head title="Ajouter un repère" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6"
                    >
                        
                        <div className="mb-8">
                            <button 
                                type="button" 
                                onClick={handleLocateMe}
                                disabled={isLocating}
                                className="w-full flex justify-center items-center py-5 px-4 border-2 border-indigo-600 rounded-xl shadow-lg text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-all duration-300 transform hover:scale-[1.01] disabled:opacity-50 disabled:scale-100"
                            >
                                <span className={`mr-3 ${isLocating ? 'animate-spin' : 'animate-bounce'}`}>
                                    {isLocating ? '⏳' : '📍'}
                                </span>
                                {isLocating ? "Recherche en cours..." : "Étape 1 : ME GÉOLOCALISER (Cliquez ici)"}
                            </button>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Formulaire */}
                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="nom" className="block font-medium text-sm text-gray-700">Nom du repère (ex: Domicile, Bureau)</label>
                                        <input
                                            id="nom"
                                            type="text"
                                            value={data.nom}
                                            onChange={e => setData('nom', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            required
                                            autoFocus
                                        />
                                        {errors.nom && <p className="mt-2 text-sm text-red-600">{errors.nom}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="adresse" className="block font-medium text-sm text-gray-700">Adresse (Géolocalisée automatiquement mais modifiable)</label>
                                        <textarea
                                            id="adresse"
                                            rows="2"
                                            value={data.adresse}
                                            onChange={e => setData('adresse', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            required
                                            placeholder="Cliquez sur 'Me géolocaliser' en haut pour remplir cette case automatiquement."
                                        />
                                        {errors.adresse && <p className="mt-2 text-sm text-red-600">{errors.adresse}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="description" className="block font-medium text-sm text-gray-700">Description détaillée pour le livreur</label>
                                        <textarea
                                            id="description"
                                            rows="3"
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            placeholder="Veuillez compléter avec des indications (Ex: Portail bleu à côté de la pharmacie, 2ème étage...)"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Au Sénégal, la géolocalisation seule ne suffit pas. Une description (facultative) est recommandée.</p>
                                        {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="photo" className="block font-bold text-sm text-indigo-700">Étape 2 : Ajouter une photo de la façade (Optionnel mais recommandé)</label>
                                        <input
                                            id="photo"
                                            type="file"
                                            accept="image/*"
                                            onChange={e => setData('photo', e.target.files[0])}
                                            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border border-gray-200 rounded-xl"
                                        />
                                        {errors.photo && <p className="mt-2 text-sm text-red-600">{errors.photo}</p>}
                                    </div>
                                </div>

                                {/* Carte */}
                                <div>
                                    <label className="block mb-2 font-bold text-gray-700">Vérifiez votre position sur la carte</label>
                                    <p className="text-sm text-gray-600 mb-3">Vous pouvez déplacer le marqueur si la position détectée n'est pas exacte.</p>
                                    
                                    <div ref={mapRef} className="h-96 w-full rounded-2xl shadow-inner border-2 border-gray-200 relative z-0"></div>
                                    
                                    {errors.latitude || errors.longitude ? (
                                        <p className="mt-2 text-sm text-red-600">Veuillez définir une position sur la carte.</p>
                                    ) : null}
                                </div>
                            </div>

                            <div className="flex items-center justify-end mt-8 border-t border-gray-200 pt-6">
                                <Link
                                    href={route('reperes.index')}
                                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Annuler
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    {processing ? 'Enregistrement...' : 'Enregistrer ce repère'}
                                </button>
                            </div>
                        </form>

                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
