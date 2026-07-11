import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Package, Search, Filter } from 'lucide-react';
import { useState } from 'react';

export default function Commandes({ auth, commandes }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatut, setFilterStatut] = useState('tous');

    const filteredCommandes = commandes.filter(cmd => {
        const matchesSearch = 
            cmd.id.toString().includes(searchTerm) || 
            cmd.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
            cmd.partenaire.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cmd.livreur.toLowerCase().includes(searchTerm.toLowerCase());
            
        const matchesStatut = filterStatut === 'tous' || cmd.statut === filterStatut;
        
        return matchesSearch && matchesStatut;
    });

    const getStatusColor = (statut) => {
        switch(statut) {
            case 'livree': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
            case 'annulee': return 'bg-red-100 text-red-800 border border-red-200';
            case 'en_livraison': return 'bg-blue-100 text-blue-800 border border-blue-200';
            case 'acceptee': return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
            default: return 'bg-amber-100 text-amber-800 border border-amber-200';
        }
    };

    return (
        <AuthenticatedLayout header="Gestion des Commandes">
            <Head title="Toutes les Commandes — Admin" />

            <div className="page-header mb-8">
                <h1 className="page-title flex items-center gap-3">
                    <Package className="text-orange-500 w-8 h-8" /> 
                    Toutes les Commandes
                </h1>
                <p className="page-subtitle">Consultez l'historique et l'état de toutes les commandes passées sur la plateforme.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Rechercher par ID, client, boutique, livreur..."
                            className="w-full pl-10 pr-4 py-2 border-slate-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Filter className="text-slate-400 w-5 h-5" />
                        <select
                            className="border-slate-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 shadow-sm w-full sm:w-auto"
                            value={filterStatut}
                            onChange={(e) => setFilterStatut(e.target.value)}
                        >
                            <option value="tous">Tous les statuts</option>
                            <option value="en_attente">En attente</option>
                            <option value="acceptee">Acceptée</option>
                            <option value="en_livraison">En livraison</option>
                            <option value="livree">Livrée</option>
                            <option value="annulee">Annulée</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-slate-200 text-sm font-medium text-slate-500">
                                <th className="p-4 whitespace-nowrap">ID Cmd</th>
                                <th className="p-4 whitespace-nowrap">Date</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Client</th>
                                <th className="p-4">Partenaire (Boutique)</th>
                                <th className="p-4">Livreur</th>
                                <th className="p-4">Montant</th>
                                <th className="p-4 text-center">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {filteredCommandes.length > 0 ? (
                                filteredCommandes.map((cmd) => (
                                    <motion.tr 
                                        key={cmd.id} 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="p-4 font-bold text-slate-900">#{cmd.id}</td>
                                        <td className="p-4 text-slate-600 whitespace-nowrap">{cmd.date}</td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-700 font-medium text-xs">
                                                {cmd.type}
                                            </span>
                                        </td>
                                        <td className="p-4 font-medium text-slate-800">{cmd.client}</td>
                                        <td className="p-4 text-indigo-700 font-medium">🏪 {cmd.partenaire}</td>
                                        <td className="p-4 text-blue-700">{cmd.livreur !== 'Non assigné' ? `🛵 ${cmd.livreur}` : <span className="text-slate-400 italic">Non assigné</span>}</td>
                                        <td className="p-4 font-bold text-slate-900 whitespace-nowrap">{Number(cmd.montant).toLocaleString('fr-FR')} FCFA</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize inline-block ${getStatusColor(cmd.statut)}`}>
                                                {cmd.statut.replace('_', ' ')}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="p-8 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Package className="w-12 h-12 text-slate-300 mb-3" />
                                            <p className="text-lg font-medium text-slate-600">Aucune commande trouvée</p>
                                            <p className="text-sm text-slate-400 mt-1">Modifiez vos filtres de recherche.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div className="p-4 border-t border-slate-200 bg-slate-50 text-sm text-slate-500 flex justify-between items-center">
                    <span>Affichage de {filteredCommandes.length} commande(s) sur {commandes.length}</span>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
