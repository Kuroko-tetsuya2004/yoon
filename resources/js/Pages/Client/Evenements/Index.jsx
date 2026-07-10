import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Index({ auth, evenements }) {
    return (
        <AuthenticatedLayout header="Mes Événements">
            <Head title="Événements — Yoon" />

            <div className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="page-title">Mes Événements</h1>
                    <p className="page-subtitle">Gérez la logistique de vos événements spéciaux.</p>
                </div>
                <Link href={route('evenements.create')} className="btn-primary shrink-0 self-start sm:self-auto">
                    + Créer un événement
                </Link>
            </div>

            <div className="card">
                <div className="overflow-x-auto">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Événement</th>
                                <th>Date Prévue</th>
                                <th>Prestations</th>
                                <th>Total</th>
                                <th>Statut</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {evenements.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-slate-500">
                                        Vous n'avez créé aucun événement pour le moment.
                                    </td>
                                </tr>
                            ) : (
                                evenements.map(evt => (
                                    <motion.tr 
                                        key={evt.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <td>
                                            <div className="font-semibold text-slate-900">{evt.titre}</div>
                                            <div className="text-xs text-slate-500 capitalize">{evt.type_evenement}</div>
                                        </td>
                                        <td>
                                            <div className="text-slate-900">{new Date(evt.date_evenement).toLocaleDateString('fr-FR')}</div>
                                        </td>
                                        <td>
                                            <span className="badge badge-gray">{evt.prestations.length} prestation(s)</span>
                                        </td>
                                        <td>
                                            <div className="font-bold text-orange-600">
                                                {Number(evt.commande?.montant_total).toLocaleString('fr-FR')} FCFA
                                            </div>
                                        </td>
                                        <td>
                                            {evt.commande?.statut === 'panier' && <span className="badge badge-gray">En préparation</span>}
                                            {evt.commande?.statut === 'en_attente' && <span className="badge badge-yellow">En attente</span>}
                                            {evt.commande?.statut === 'validee' && <span className="badge badge-blue">Validé</span>}
                                            {evt.commande?.statut === 'terminee' && <span className="badge badge-green">Terminé</span>}
                                        </td>
                                        <td>
                                            <div className="flex justify-end">
                                                <Link href={route('evenements.show', evt.id)} className="btn-secondary btn-sm">
                                                    Détails
                                                </Link>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
