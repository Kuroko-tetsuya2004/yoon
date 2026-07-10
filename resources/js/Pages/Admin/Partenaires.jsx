import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Partenaires({ auth, partenaires }) {
    const { patch } = useForm();

    const validerPartenaire = (id) => {
        patch(route('admin.partenaires.valider', id));
    };

    const suspendrePartenaire = (id) => {
        if(confirm("Êtes-vous sûr de vouloir suspendre ou rejeter ce partenaire ?")) {
            patch(route('admin.partenaires.suspendre', id));
        }
    };

    const limitString = (str, limit) => {
        if (!str) return 'Non renseigné';
        return str.length > limit ? str.substring(0, limit) + '...' : str;
    };

    return (
        <AuthenticatedLayout header="Validation des Partenaires">
            <Head title="Partenaires — Admin" />

            <div className="page-header">
                <h1 className="page-title">Partenaires Inscrits</h1>
                <p className="page-subtitle">Gérez les comptes partenaires (Boutiques, Dépôts), validez leurs inscriptions ou suspendez leurs accès.</p>
            </div>

            <div className="card">
                <div className="overflow-x-auto">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Partenaire</th>
                                <th>Contact</th>
                                <th>Boutique</th>
                                <th>Statut</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {partenaires.length > 0 ? (
                                partenaires.map(partenaire => (
                                    <motion.tr 
                                        key={partenaire.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <td>
                                            <div className="font-semibold text-slate-900">{partenaire.name}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">Inscrit le {new Date(partenaire.created_at).toLocaleDateString('fr-FR')}</div>
                                        </td>
                                        <td>
                                            <div className="text-slate-900">{partenaire.telephone}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">{partenaire.email}</div>
                                        </td>
                                        <td className="max-w-xs">
                                            <div className="text-slate-600 truncate" title={partenaire.description_boutique || ''}>
                                                {limitString(partenaire.description_boutique, 40)}
                                            </div>
                                        </td>
                                        <td>
                                            {partenaire.statut_validation === 'valide' ? (
                                                <span className="badge badge-green">Validé</span>
                                            ) : partenaire.statut_validation === 'rejete' ? (
                                                <span className="badge badge-red">Rejeté</span>
                                            ) : (
                                                <span className="badge badge-yellow">En attente</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="flex justify-end gap-2">
                                                {partenaire.statut_validation !== 'valide' && (
                                                    <button onClick={() => validerPartenaire(partenaire.id)} className="btn-success btn-sm">
                                                        Valider
                                                    </button>
                                                )}
                                                {partenaire.statut_validation !== 'rejete' && (
                                                    <button onClick={() => suspendrePartenaire(partenaire.id)} className="btn-danger btn-sm">
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
                                        Aucun partenaire inscrit pour le moment.
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
