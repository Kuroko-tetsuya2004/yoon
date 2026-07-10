import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Livreurs({ auth, livreurs }) {
    const { patch } = useForm();

    const validerLivreur = (id) => {
        patch(route('admin.livreurs.valider', id));
    };

    const suspendreLivreur = (id) => {
        if(confirm("Êtes-vous sûr de vouloir suspendre ou rejeter ce livreur ?")) {
            patch(route('admin.livreurs.suspendre', id));
        }
    };

    return (
        <AuthenticatedLayout header="Validation des Livreurs">
            <Head title="Livreurs — Admin" />

            <div className="page-header">
                <h1 className="page-title">Livreurs Inscrits</h1>
                <p className="page-subtitle">Gérez les comptes livreurs, validez leurs inscriptions ou suspendez leurs accès.</p>
            </div>

            <div className="card">
                <div className="overflow-x-auto">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Livreur</th>
                                <th>Contact</th>
                                <th>Transport</th>
                                <th>Statut</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {livreurs.length > 0 ? (
                                livreurs.map(livreur => (
                                    <motion.tr 
                                        key={livreur.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <td>
                                            <div className="font-semibold text-slate-900">{livreur.name}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">Inscrit le {new Date(livreur.created_at).toLocaleDateString('fr-FR')}</div>
                                        </td>
                                        <td>
                                            <div className="text-slate-900">{livreur.telephone}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">{livreur.email}</div>
                                        </td>
                                        <td>
                                            {livreur.moyen_transport ? (
                                                <span className="badge badge-blue">
                                                    {livreur.moyen_transport === 'Moto' ? '🏍️' : livreur.moyen_transport === 'Vélo' ? '🚲' : livreur.moyen_transport === 'Camionnette' ? '🚚' : '🚗'} {livreur.moyen_transport}
                                                </span>
                                            ) : (
                                                <span className="badge badge-gray">Non renseigné</span>
                                            )}
                                        </td>
                                        <td>
                                            {livreur.statut_validation === 'valide' ? (
                                                <span className="badge badge-green">Validé</span>
                                            ) : livreur.statut_validation === 'rejete' ? (
                                                <span className="badge badge-red">Rejeté</span>
                                            ) : (
                                                <span className="badge badge-yellow">En attente</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="flex justify-end gap-2">
                                                {livreur.statut_validation !== 'valide' && (
                                                    <button onClick={() => validerLivreur(livreur.id)} className="btn-success btn-sm">
                                                        Valider
                                                    </button>
                                                )}
                                                {livreur.statut_validation !== 'rejete' && (
                                                    <button onClick={() => suspendreLivreur(livreur.id)} className="btn-danger btn-sm">
                                                        Suspendre
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-slate-500">
                                        Aucun livreur inscrit pour le moment.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
