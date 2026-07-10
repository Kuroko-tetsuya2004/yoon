import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Show({ auth, evenement, materiels }) {
    const { post: postPrestation, processing: prestationProcessing } = useForm({});
    const { delete: deletePrestation } = useForm();
    const { post: postCheckout, processing: checkoutProcessing, data: checkoutData, setData: setCheckoutData } = useForm({
        mode_paiement: 'orange_money'
    });

    const [selectedMateriel, setSelectedMateriel] = useState('');
    const [quantite, setQuantite] = useState(1);

    const addPrestation = (e) => {
        e.preventDefault();
        postPrestation(route('evenements.add_prestation', evenement.id), {
            data: { produit_id: selectedMateriel, quantite: quantite },
            onSuccess: () => {
                setSelectedMateriel('');
                setQuantite(1);
            }
        });
    };

    const removePrestation = (prestationId) => {
        if(confirm('Retirer cette prestation ?')) {
            deletePrestation(route('evenements.remove_prestation', [evenement.id, prestationId]));
        }
    };

    const handleCheckout = (e) => {
        e.preventDefault();
        postCheckout(route('evenements.checkout', evenement.id));
    };

    const formatPrice = (price) => Number(price).toLocaleString('fr-FR');
    const isPanier = evenement.commande.statut === 'panier';

    return (
        <AuthenticatedLayout header="Détails de l'événement">
            <Head title={`Événement : ${evenement.titre}`} />

            <div className="page-header mb-6">
                <Link href={route('evenements.index')} className="text-sm text-slate-500 hover:text-orange-500 mb-2 inline-block">
                    ← Retour aux événements
                </Link>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="page-title">{evenement.titre}</h1>
                        <p className="page-subtitle capitalize">{evenement.type_evenement} prévu le {new Date(evenement.date_evenement).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div>
                        {isPanier ? (
                            <span className="badge badge-gray text-base px-4 py-2">En préparation</span>
                        ) : (
                            <span className="badge badge-green text-base px-4 py-2">Validé</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Liste des Prestations */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card p-0">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-900">Prestations & Matériels</h2>
                        </div>
                        
                        {evenement.prestations.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                Aucun matériel ou prestation n'a été ajouté à cet événement.
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {evenement.prestations.map((prestation, idx) => (
                                    <motion.div 
                                        key={prestation.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50 transition"
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-slate-900">{prestation.produit.nom}</h3>
                                            <p className="text-sm text-slate-500 mt-1">
                                                Fourni par : {prestation.partenaire?.name}
                                            </p>
                                            <div className="flex items-center gap-3 mt-2 text-sm">
                                                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">Quantité : {prestation.quantite}</span>
                                                <span className="text-slate-500">Prix unitaire : {formatPrice(prestation.prix_unitaire)} FCFA</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                                            <div className="text-right">
                                                <div className="font-bold text-slate-900">{formatPrice(prestation.prix_unitaire * prestation.quantite)} FCFA</div>
                                                <div className="text-xs text-orange-600 font-medium">Caution : {formatPrice(prestation.caution)} FCFA</div>
                                            </div>
                                            {isPanier && (
                                                <button onClick={() => removePrestation(prestation.id)} className="text-red-500 hover:text-red-700 p-1">
                                                    🗑️ Retirer
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Formulaire d'ajout de prestation (visible uniquement si panier) */}
                    {isPanier && (
                        <div className="card p-6 border-dashed border-2 border-slate-200 bg-slate-50/50">
                            <h3 className="text-md font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <span>+</span> Ajouter du matériel (Chaises, Bâches, Sono...)
                            </h3>
                            <form onSubmit={addPrestation} className="flex flex-col sm:flex-row items-end gap-4">
                                <div className="flex-1 w-full">
                                    <label className="form-label">Sélectionner un matériel</label>
                                    <select 
                                        value={selectedMateriel} 
                                        onChange={e => setSelectedMateriel(e.target.value)}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">-- Choisir --</option>
                                        {materiels.map(mat => (
                                            <option key={mat.id} value={mat.id}>
                                                {mat.nom} - {formatPrice(mat.prix)} FCFA (Caution: ~50%)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-full sm:w-32">
                                    <label className="form-label">Quantité</label>
                                    <input 
                                        type="number" 
                                        min="1" 
                                        value={quantite} 
                                        onChange={e => setQuantite(e.target.value)}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <button type="submit" disabled={!selectedMateriel || prestationProcessing} className="btn-secondary w-full sm:w-auto">
                                    Ajouter
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Sidebar Total & Paiement */}
                <div className="space-y-6">
                    <div className="card p-6 sticky top-24">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Récapitulatif</h2>
                        
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-slate-600 text-sm">
                                <span>Sous-total Prestations</span>
                                <span>{formatPrice(evenement.prestations.reduce((acc, p) => acc + (p.prix_unitaire * p.quantite), 0))} FCFA</span>
                            </div>
                            <div className="flex justify-between text-orange-600 text-sm font-medium">
                                <span>Cautions (Remboursables)</span>
                                <span>{formatPrice(evenement.prestations.reduce((acc, p) => acc + Number(p.caution), 0))} FCFA</span>
                            </div>
                            <div className="pt-3 border-t border-slate-100 flex justify-between font-bold text-slate-900 text-lg">
                                <span>Total estimé</span>
                                <span>{formatPrice(evenement.commande.montant_total)} FCFA</span>
                            </div>
                        </div>

                        {isPanier ? (
                            <form onSubmit={handleCheckout}>
                                <div className="mb-4">
                                    <label className="form-label text-sm">Mode de paiement</label>
                                    <div className="space-y-2 mt-2">
                                        <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:border-orange-500 transition bg-white">
                                            <input 
                                                type="radio" 
                                                name="mode_paiement" 
                                                value="orange_money" 
                                                checked={checkoutData.mode_paiement === 'orange_money'}
                                                onChange={e => setCheckoutData('mode_paiement', e.target.value)}
                                                className="text-orange-500 focus:ring-orange-500"
                                            />
                                            <span className="font-medium text-sm">Orange Money</span>
                                        </label>
                                        <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:border-blue-500 transition bg-white">
                                            <input 
                                                type="radio" 
                                                name="mode_paiement" 
                                                value="wave" 
                                                checked={checkoutData.mode_paiement === 'wave'}
                                                onChange={e => setCheckoutData('mode_paiement', e.target.value)}
                                                className="text-blue-500 focus:ring-blue-500"
                                            />
                                            <span className="font-medium text-sm">Wave</span>
                                        </label>
                                    </div>
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={checkoutProcessing || evenement.prestations.length === 0} 
                                    className="btn-primary w-full text-base py-3"
                                >
                                    Valider l'événement
                                </button>
                                {evenement.prestations.length === 0 && (
                                    <p className="text-xs text-center text-slate-500 mt-2">Ajoutez des prestations avant de valider.</p>
                                )}
                            </form>
                        ) : (
                            <div className="alert-success">
                                <span className="text-lg">✅</span>
                                <div>
                                    <span className="block font-semibold">Événement validé</span>
                                    <span className="block mt-1 text-sm">Les prestataires préparent votre commande.</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
