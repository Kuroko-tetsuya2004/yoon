import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import FakePaymentModal from '@/Components/FakePaymentModal';

export default function CreateGaz({ auth, reperes, produit, flash }) {
    const requiresOnlinePayment = !produit.partenaire?.propre_service_livraison;

    const { data, setData, post, processing, errors } = useForm({
        repere_id: reperes.find(r => r.is_default)?.id || (reperes.length > 0 ? reperes[0].id : ''),
        produit_id: produit.id,
        quantite: 1,
        contenant_vide: true,
        creneau: 'Dès que possible',
        mode_paiement: requiresOnlinePayment ? 'wave' : 'especes',
        frais_livraison: 0
    });

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
        const R = 6371; 
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    // Recalculate delivery fee when repere changes
    let fraisLivraison = 0;
    if (requiresOnlinePayment) {
        const selectedRepere = reperes.find(r => r.id == data.repere_id);
        if (selectedRepere && produit.partenaire?.latitude && produit.partenaire?.longitude) {
            const distance = calculateDistance(
                produit.partenaire.latitude, 
                produit.partenaire.longitude, 
                selectedRepere.latitude, 
                selectedRepere.longitude
            );
            fraisLivraison = Math.min(Math.ceil(distance) * 1000, 3500);
        }
    }

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    let montantTotal = produit.prix * data.quantite;
    if (!data.contenant_vide) {
        montantTotal += 15000 * data.quantite; // Consigne
    }
    montantTotal += fraisLivraison;

    const submit = (e) => {
        e.preventDefault();
        setData('frais_livraison', fraisLivraison);
        if (data.mode_paiement !== 'especes') {
            setIsPaymentModalOpen(true);
        } else {
            post(route('commandes.gaz.store', { ...data, frais_livraison: fraisLivraison }));
        }
    };

    const handlePaymentSuccess = () => {
        setIsPaymentModalOpen(false);
        post(route('commandes.gaz.store', { ...data, frais_livraison: fraisLivraison }));
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Commander une bonbonne de gaz</h2>}>
            <Head title="Commande Gaz" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6"
                    >
                        

                        <form onSubmit={submit} className="space-y-6">
                            {/* Choix du repère */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">1. Adresse de livraison</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {reperes.map(repere => (
                                        <label key={repere.id} className="relative block cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="repere_id" 
                                                value={repere.id} 
                                                checked={data.repere_id == repere.id}
                                                onChange={e => setData('repere_id', e.target.value)}
                                                className="peer sr-only" 
                                            />
                                            <div className="p-4 rounded-lg border-2 border-gray-200 hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-bold text-gray-900">{repere.nom}</span>
                                                    {repere.is_default && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">Par défaut</span>}
                                                </div>
                                                <p className="text-sm text-gray-500">{repere.adresse || 'Point GPS localisé'}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {errors.repere_id && <p className="mt-2 text-sm text-red-600">{errors.repere_id}</p>}
                            </div>

                            {/* Produit Sélectionné */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">2. Produit sélectionné</h3>
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center">
                                    {produit.image ? (
                                        <img src={produit.photo_url || `/storage/${produit.image}`} className="w-20 h-20 object-contain rounded mr-4 bg-white p-1" alt={produit.nom} />
                                    ) : (
                                        <div className="w-20 h-20 bg-gray-200 rounded mr-4 flex items-center justify-center text-gray-500 text-3xl">⚡</div>
                                    )}
                                    <div>
                                        <h4 className="font-bold text-lg text-gray-900">{produit.nom}</h4>
                                        <p className="text-sm text-gray-500">Modèle {produit.modele}</p>
                                        <p className="text-sm font-medium text-blue-600 mt-1">Fournisseur : {produit.partenaire?.name}</p>
                                        <p className="font-bold text-gray-900 mt-2">{Number(produit.prix).toLocaleString('fr-FR')} FCFA / unité</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quantité et Bouteille vide */}
                            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="quantite" className="block font-medium text-sm text-gray-700 mb-2">Quantité</label>
                                    <select 
                                        id="quantite" 
                                        value={data.quantite}
                                        onChange={e => setData('quantite', e.target.value)}
                                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm w-full"
                                    >
                                        {[1,2,3,4,5].map(i => <option key={i} value={i}>{i} bonbonne(s)</option>)}
                                    </select>
                                    {errors.quantite && <p className="mt-2 text-sm text-red-600">{errors.quantite}</p>}
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Avez-vous une bouteille vide à rendre ?</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-start">
                                        <div className="flex items-center h-5">
                                            <input 
                                                id="contenant_vide" 
                                                type="checkbox" 
                                                checked={data.contenant_vide}
                                                onChange={e => setData('contenant_vide', e.target.checked)}
                                                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500" 
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="contenant_vide" className="font-medium text-gray-900 cursor-pointer">Oui, j'ai une bouteille vide</label>
                                            <p className="text-gray-500 mt-1">Si vous décochez cette case, une consigne sera ajoutée au prix.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Créneau et Paiement */}
                            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="creneau" className="block font-medium text-sm text-gray-700 mb-2">Créneau de livraison</label>
                                    <select 
                                        id="creneau" 
                                        value={data.creneau}
                                        onChange={e => setData('creneau', e.target.value)}
                                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm w-full"
                                    >
                                        <option value="Dès que possible">Dès que possible</option>
                                        <option value="Matin (8h-12h)">Ce matin (8h-12h)</option>
                                        <option value="Après-midi (14h-18h)">Cet après-midi (14h-18h)</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="mode_paiement" className="block font-medium text-sm text-gray-700 mb-2">Mode de paiement</label>
                                    <select 
                                        id="mode_paiement" 
                                        value={data.mode_paiement}
                                        onChange={e => setData('mode_paiement', e.target.value)}
                                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm w-full"
                                    >
                                        {!requiresOnlinePayment && (
                                            <option value="especes">Paiement à la livraison (Espèces)</option>
                                        )}
                                        <option value="wave">Wave</option>
                                        <option value="orange_money">Orange Money</option>
                                    </select>
                                    {requiresOnlinePayment && (
                                        <p className="mt-2 text-xs text-blue-600 font-medium bg-blue-50 p-2 rounded">
                                            ⚠️ Le vendeur ne dispose pas de service de livraison propre. Un coursier indépendant vous sera assigné, le paiement en ligne est requis.
                                            Frais de livraison : {fraisLivraison} FCFA
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                <div className="text-xl font-bold text-gray-900">
                                    Total à payer : {montantTotal.toLocaleString('fr-FR')} FCFA
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition transform hover:-translate-y-0.5 text-lg disabled:opacity-50"
                                >
                                    {processing ? 'En cours...' : 'Confirmer la commande'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>

            <FakePaymentModal
                isOpen={isPaymentModalOpen}
                modePaiement={data.mode_paiement}
                montant={montantTotal}
                onSuccess={handlePaymentSuccess}
                onCancel={() => setIsPaymentModalOpen(false)}
            />
        </AuthenticatedLayout>
    );
}
