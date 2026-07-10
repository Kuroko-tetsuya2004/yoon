import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Create({ auth, reperes }) {
    const { data, setData, post, processing, errors } = useForm({
        titre: '',
        type_evenement: 'mariage',
        date_evenement: '',
        repere_id: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('evenements.store'));
    };

    return (
        <AuthenticatedLayout header="Créer un Événement">
            <Head title="Créer Événement — Yoon" />

            <div className="max-w-3xl mx-auto">
                <div className="page-header mb-6">
                    <Link href={route('evenements.index')} className="text-sm text-slate-500 hover:text-orange-500 mb-2 inline-block">
                        ← Retour aux événements
                    </Link>
                    <h1 className="page-title">Nouvel Événement</h1>
                    <p className="page-subtitle">Remplissez les informations de base de votre événement avant de choisir vos prestataires.</p>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-6 sm:p-8"
                >
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="form-label">Titre de l'événement</label>
                            <input 
                                type="text" 
                                value={data.titre} 
                                onChange={e => setData('titre', e.target.value)}
                                className={`form-input ${errors.titre ? 'border-red-500' : ''}`}
                                placeholder="Ex: Mariage de Sophie & Marc"
                                required
                            />
                            {errors.titre && <p className="form-error">{errors.titre}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="form-label">Type d'événement</label>
                                <select 
                                    value={data.type_evenement} 
                                    onChange={e => setData('type_evenement', e.target.value)}
                                    className="form-select"
                                    required
                                >
                                    <option value="mariage">Mariage</option>
                                    <option value="bapteme">Baptême</option>
                                    <option value="anniversaire">Anniversaire</option>
                                    <option value="reception">Réception Privée</option>
                                    <option value="autre">Autre</option>
                                </select>
                                {errors.type_evenement && <p className="form-error">{errors.type_evenement}</p>}
                            </div>

                            <div>
                                <label className="form-label">Date prévue</label>
                                <input 
                                    type="date" 
                                    value={data.date_evenement} 
                                    onChange={e => setData('date_evenement', e.target.value)}
                                    className={`form-input ${errors.date_evenement ? 'border-red-500' : ''}`}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                                {errors.date_evenement && <p className="form-error">{errors.date_evenement}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="form-label flex justify-between">
                                <span>Lieu de l'événement</span>
                                <Link href={route('reperes.create')} className="text-orange-500 hover:text-orange-600 text-xs font-semibold">
                                    + Ajouter une adresse
                                </Link>
                            </label>
                            <select 
                                value={data.repere_id} 
                                onChange={e => setData('repere_id', e.target.value)}
                                className={`form-select ${errors.repere_id ? 'border-red-500' : ''}`}
                                required
                            >
                                <option value="">-- Sélectionnez une adresse enregistrée --</option>
                                {reperes.map(rep => (
                                    <option key={rep.id} value={rep.id}>{rep.nom} - {rep.description}</option>
                                ))}
                            </select>
                            {errors.repere_id && <p className="form-error">{errors.repere_id}</p>}
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex justify-end">
                            <button type="submit" disabled={processing} className="btn-primary w-full sm:w-auto">
                                Enregistrer et Continuer
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
