import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import FakePaymentModal from '@/Components/FakePaymentModal';

export default function CreateMateriel({ auth, reperes, produit, commandesExistantes, flash }) {
    const { data, setData, post, processing, errors } = useForm({
        repere_id: reperes.find(r => r.is_default)?.id || (reperes.length > 0 ? reperes[0].id : ''),
        produit_id: produit.id,
        quantite: 1,
        date_debut: '',
        date_fin: '',
        creneau: 'Dès que possible',
        mode_paiement: 'especes'
    });

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const jours = data.date_debut && data.date_fin ? Math.max(1, (new Date(data.date_fin) - new Date(data.date_debut)) / (1000 * 60 * 60 * 24) + 1) : 1;
    const montantTotal = produit.prix * data.quantite * jours;

    const submit = (e) => {
        e.preventDefault();
        if (data.mode_paiement !== 'especes') {
            setIsPaymentModalOpen(true);
        } else {
            post(route('commandes.materiel.store'));
        }
    };

    const handlePaymentSuccess = () => {
        setIsPaymentModalOpen(false);
        post(route('commandes.materiel.store'));
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Louer du matériel événementiel</h2>}>
            <Head title="Location Matériel" />

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
                                            <div className="p-4 rounded-lg border-2 border-gray-200 hover:bg-gray-50 peer-checked:border-purple-500 peer-checked:bg-purple-50 transition">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-bold text-gray-900">{repere.nom}</span>
                                                    {repere.is_default && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-medium">Par défaut</span>}
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
                                <h3 className="text-lg font-medium text-gray-900 mb-4">2. Matériel sélectionné</h3>
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center">
                                    {produit.image ? (
                                        <img src={produit.photo_url || `/storage/${produit.image}`} className="w-20 h-20 object-cover rounded mr-4 bg-white p-1" alt={produit.nom} />
                                    ) : (
                                        <div className="w-20 h-20 bg-gray-200 rounded mr-4 flex items-center justify-center text-gray-500 text-3xl">🎉</div>
                                    )}
                                    <div>
                                        <h4 className="font-bold text-lg text-gray-900">{produit.nom}</h4>
                                        <p className="text-sm text-gray-500">{produit.description}</p>
                                        <p className="text-sm font-medium text-purple-600 mt-1">Fournisseur : {produit.partenaire?.name}</p>
                                        <p className="font-bold text-gray-900 mt-2">{Number(produit.prix).toLocaleString('fr-FR')} FCFA / jour</p>
                                    </div>
                                </div>
                            </div>

                            {/* Réservations existantes */}
                            {commandesExistantes && commandesExistantes.length > 0 && (
                                <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                                    <h4 className="font-medium text-amber-800 mb-2 flex items-center">
                                        <span className="mr-2">⚠️</span>
                                        Dates déjà réservées pour ce matériel
                                    </h4>
                                    <p className="text-sm text-amber-700 mb-3">Veuillez choisir des dates qui ne chevauchent pas les périodes suivantes :</p>
                                    <div className="space-y-2">
                                        {commandesExistantes.map(cmd => (
                                            <div key={cmd.id} className="flex items-center text-sm bg-white rounded px-3 py-2 border border-amber-100">
                                                <span className="font-medium text-gray-800">
                                                    Du {new Date(cmd.date_debut).toLocaleDateString()} au {new Date(cmd.date_fin).toLocaleDateString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantité et Dates */}
                            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="quantite" className="block font-medium text-sm text-gray-700 mb-2">Quantité</label>
                                    <input 
                                        type="number"
                                        id="quantite" 
                                        min="1"
                                        value={data.quantite}
                                        onChange={e => setData('quantite', e.target.value)}
                                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-md shadow-sm w-full"
                                    />
                                    {errors.quantite && <p className="mt-2 text-sm text-red-600">{errors.quantite}</p>}
                                </div>
                                <div>
                                    <label htmlFor="date_debut" className="block font-medium text-sm text-gray-700 mb-2">Date de début</label>
                                    <input 
                                        type="date"
                                        id="date_debut"
                                        min={new Date().toISOString().split('T')[0]}
                                        value={data.date_debut}
                                        onChange={e => setData('date_debut', e.target.value)}
                                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-md shadow-sm w-full"
                                        required
                                    />
                                    {errors.date_debut && <p className="mt-2 text-sm text-red-600">{errors.date_debut}</p>}
                                </div>
                                <div>
                                    <label htmlFor="date_fin" className="block font-medium text-sm text-gray-700 mb-2">Date de fin</label>
                                    <input 
                                        type="date"
                                        id="date_fin"
                                        min={data.date_debut || new Date().toISOString().split('T')[0]}
                                        value={data.date_fin}
                                        onChange={e => setData('date_fin', e.target.value)}
                                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-md shadow-sm w-full"
                                        required
                                    />
                                    {errors.date_fin && <p className="mt-2 text-sm text-red-600">{errors.date_fin}</p>}
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
                                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-md shadow-sm w-full"
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
                                        className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-md shadow-sm w-full"
                                    >
                                        <option value="especes">Paiement à la livraison (Espèces)</option>
                                        <option value="wave">Wave</option>
                                        <option value="orange_money">Orange Money</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-gray-200">
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition transform hover:-translate-y-0.5 text-lg disabled:opacity-50"
                                >
                                    {processing ? 'En cours...' : 'Confirmer la réservation'}
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
