import { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Show({ auth, commande, flash }) {
    const { post: postForm, processing } = useForm();


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

                            {/* Lien vers le Suivi Livreur */}
                            {commande.livraison && (
                                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-8 flex justify-between items-center">
                                    <div>
                                        <h4 className="text-blue-900 font-bold text-lg flex items-center">
                                            <span className="mr-2">🚚</span> Livraison assignée
                                        </h4>
                                        <p className="text-blue-800 text-sm mt-1">Votre commande a été prise en charge par un livreur.</p>
                                    </div>
                                    <Link 
                                        href={route('commandes.suivi_livraison', commande.id)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow transition"
                                    >
                                        Suivre ma livraison &rarr;
                                    </Link>
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
