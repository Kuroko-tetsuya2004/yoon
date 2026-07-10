import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Index({ commandes, flash }) {
    const getStatusColor = (statut) => {
        switch (statut) {
            case 'en_attente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'acceptee': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'assignee': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'en_cours_recuperation': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'recuperee': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'en_route': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
            case 'livree': return 'bg-green-100 text-green-800 border-green-200';
            case 'refusee':
            case 'annulee': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusLabel = (statut) => {
        const statusMap = {
            'en_attente': 'En attente',
            'acceptee': 'Acceptée',
            'assignee': 'Livreur assigné',
            'en_cours_recuperation': 'Livreur en route vers la boutique',
            'recuperee': 'Récupérée par le livreur',
            'en_route': 'En cours de livraison',
            'livree': 'Livrée',
            'refusee': 'Refusée',
            'annulee': 'Annulée'
        };
        return statusMap[statut] || statut;
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'gaz': return '⚡';
            case 'pondereux': return '🧱';
            case 'materiel': return '🎉';
            default: return '📦';
        }
    };

    const formatPrice = (price) => Number(price).toLocaleString('fr-FR');

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mes Commandes</h2>}>
            <Head title="Mes Commandes" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {commandes.length === 0 ? (
                                <div className="text-center py-10">
                                    <div className="text-5xl text-gray-300 mb-4">🛒</div>
                                    <p className="text-lg text-gray-500">Vous n'avez passé aucune commande pour le moment.</p>
                                    <Link href={route('dashboard')} className="mt-4 inline-block text-indigo-600 hover:text-indigo-900 font-semibold">
                                        Explorer le catalogue
                                    </Link>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commande</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {commandes.map(commande => (
                                                <motion.tr 
                                                    key={commande.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    whileHover={{ backgroundColor: '#f9fafb' }}
                                                    className="transition duration-150"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">#CMD-{commande.id.toString().padStart(5, '0')}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center text-sm text-gray-900 capitalize">
                                                            <span className="mr-2">{getTypeIcon(commande.type_commande)}</span>
                                                            {commande.type_commande}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-bold text-gray-900">{formatPrice(commande.montant_total)} FCFA</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(commande.statut)}`}>
                                                            {getStatusLabel(commande.statut)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(commande.created_at).toLocaleDateString('fr-FR', {
                                                            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Link href={route('commandes.show', commande.id)} className="text-indigo-600 hover:text-indigo-900 font-bold bg-indigo-50 px-3 py-1 rounded hover:bg-indigo-100 transition">
                                                            Voir détails & Suivi
                                                        </Link>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
