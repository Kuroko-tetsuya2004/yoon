import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Litiges({ auth, litiges }) {
    const { data, setData, patch, processing, reset } = useForm({ resolution: '' });
    const [resolModalId, setResolModalId] = useState(null);
    const [viewResolution, setViewResolution] = useState(null);

    const submitResolution = (e, id) => {
        e.preventDefault();
        patch(route('admin.litiges.resoudre', id), {
            onSuccess: () => {
                setResolModalId(null);
                reset();
            }
        });
    };

    return (
        <AuthenticatedLayout header="Gestion des Litiges">
            <Head title="Litiges — Admin" />

            <div className="page-header">
                <h1 className="page-title">Litiges Signalés</h1>
                <p className="page-subtitle">Suivez et résolvez les litiges remontés par les clients ou les partenaires.</p>
            </div>

            <div className="card">
                <div className="overflow-x-auto">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Commande</th>
                                <th>Signalé par</th>
                                <th>Rôle</th>
                                <th>Description</th>
                                <th>Statut</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {litiges.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-slate-500">Aucun litige signalé.</td>
                                </tr>
                            ) : (
                                litiges.map(litige => (
                                    <motion.tr 
                                        key={litige.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <td>
                                            <div className="font-semibold text-slate-900"># {litige.commande_id}</div>
                                            <div className="text-xs text-slate-500">{new Date(litige.created_at).toLocaleString('fr-FR')}</div>
                                        </td>
                                        <td className="font-medium text-slate-900">
                                            {litige.user?.name}
                                        </td>
                                        <td>
                                            <span className="badge badge-gray capitalize">{litige.user?.role}</span>
                                        </td>
                                        <td className="max-w-xs">
                                            <div className="text-slate-600 truncate" title={litige.description}>
                                                {litige.description.length > 40 ? litige.description.substring(0, 40) + '...' : litige.description}
                                            </div>
                                        </td>
                                        <td>
                                            {litige.statut === 'ouvert' ? (
                                                <span className="badge badge-red">Ouvert</span>
                                            ) : (
                                                <span className="badge badge-green">Résolu</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="flex justify-end">
                                                {litige.statut === 'ouvert' ? (
                                                    <button 
                                                        onClick={() => setResolModalId(litige.id)} 
                                                        className="btn-primary btn-sm"
                                                    >
                                                        Résoudre
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => setViewResolution(litige.resolution)} 
                                                        className="btn-secondary btn-sm"
                                                    >
                                                        Voir la résolution
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Résolution */}
            <AnimatePresence>
                {resolModalId && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4"
                            onClick={() => setResolModalId(null)}
                        >
                            <motion.div 
                                initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }}
                                className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="p-6 border-b border-slate-100">
                                    <h3 className="text-xl font-bold text-slate-900">Résoudre le Litige</h3>
                                </div>
                                <div className="p-6">
                                    <div className="alert-warning mb-4">
                                        <span className="text-lg">⚠️</span>
                                        <div>
                                            <span className="block font-semibold">Description du problème</span>
                                            <span className="block mt-1 text-slate-700">{litiges.find(l => l.id === resolModalId)?.description}</span>
                                        </div>
                                    </div>
                                    <form onSubmit={(e) => submitResolution(e, resolModalId)}>
                                        <label className="form-label">Solution apportée</label>
                                        <textarea 
                                            value={data.resolution}
                                            onChange={e => setData('resolution', e.target.value)}
                                            rows="4" 
                                            required 
                                            className="form-textarea" 
                                            placeholder="Décrivez comment vous avez résolu ce litige..."
                                        />
                                        <div className="flex justify-end gap-3 mt-6">
                                            <button type="button" onClick={() => setResolModalId(null)} className="btn-ghost">Annuler</button>
                                            <button type="submit" disabled={processing} className="btn-primary">Marquer comme résolu</button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Modal de Vue Résolution */}
            <AnimatePresence>
                {viewResolution && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4"
                            onClick={() => setViewResolution(null)}
                        >
                            <motion.div 
                                initial={{ y: 20, scale: 0.95 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.95 }}
                                className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden"
                                onClick={e => e.stopPropagation()}
                            >
                                <div className="p-6 border-b border-slate-100">
                                    <h3 className="text-xl font-bold text-slate-900">Détails de la résolution</h3>
                                </div>
                                <div className="p-6">
                                    <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 mb-6">
                                        {viewResolution}
                                    </div>
                                    <div className="flex justify-end">
                                        <button type="button" onClick={() => setViewResolution(null)} className="btn-secondary">Fermer</button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
