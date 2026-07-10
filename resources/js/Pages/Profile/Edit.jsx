import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Edit({ auth, status }) {
    const user = usePage().props.auth.user;

    const { data: infoData, setData: setInfoData, patch: updateInfo, processing: infoProcessing, errors: infoErrors, recentlySuccessful: infoSuccess } = useForm({
        name: user.name,
        email: user.email,
        telephone: user.telephone,
        photo_devanture: null,
    });

    const { data: pwdData, setData: setPwdData, put: updatePwd, processing: pwdProcessing, errors: pwdErrors, reset: resetPwd, recentlySuccessful: pwdSuccess } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const { data: rappelData, setData: setRappelData, post: updateRappel, processing: rappelProcessing, recentlySuccessful: rappelSuccess } = useForm({
        rappel_actif: user.rappel_actif || false,
        frequence_rappel_jours: user.frequence_rappel_jours || 30,
    });

    const submitInfo = (e) => {
        e.preventDefault();
        updateInfo(route('profile.update'));
    };

    const submitPwd = (e) => {
        e.preventDefault();
        updatePwd(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => resetPwd(),
        });
    };

    const submitRappel = (e) => {
        e.preventDefault();
        updateRappel(route('profile.rappel'));
    };

    return (
        <AuthenticatedLayout header="Mon Profil">
            <Head title="Profil — Yoon" />

            <div className="page-header">
                <h1 className="page-title">Informations Personnelles</h1>
                <p className="page-subtitle">Gérez vos informations de compte, vos préférences et votre sécurité.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Informations */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 space-y-6">
                    <div className="card p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Informations du compte</h2>
                        <form onSubmit={submitInfo} className="space-y-4">
                            <div>
                                <label className="form-label">Nom complet</label>
                                <input type="text" value={infoData.name} onChange={e => setInfoData('name', e.target.value)} className={`form-input ${infoErrors.name ? 'border-red-500' : ''}`} required />
                                {infoErrors.name && <p className="form-error">{infoErrors.name}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Adresse Email</label>
                                    <input type="email" value={infoData.email} onChange={e => setInfoData('email', e.target.value)} className={`form-input ${infoErrors.email ? 'border-red-500' : ''}`} required />
                                    {infoErrors.email && <p className="form-error">{infoErrors.email}</p>}
                                </div>
                                <div>
                                    <label className="form-label">Numéro de téléphone</label>
                                    <input type="text" value={infoData.telephone} onChange={e => setInfoData('telephone', e.target.value)} className={`form-input ${infoErrors.telephone ? 'border-red-500' : ''}`} required pattern="[0-9]{9}" />
                                    {infoErrors.telephone && <p className="form-error">{infoErrors.telephone}</p>}
                                </div>
                            </div>
                            {user.role === 'partenaire' && (
                                <div>
                                    <label className="form-label">Nouvelle photo devanture (optionnel)</label>
                                    <input type="file" onChange={e => setInfoData('photo_devanture', e.target.files[0])} className="form-input p-1.5" accept="image/*" />
                                    {infoErrors.photo_devanture && <p className="form-error">{infoErrors.photo_devanture}</p>}
                                </div>
                            )}
                            <div className="flex items-center gap-4 mt-4">
                                <button type="submit" disabled={infoProcessing} className="btn-primary">Enregistrer les modifications</button>
                                {infoSuccess && <span className="text-emerald-600 text-sm font-medium">✓ Enregistré.</span>}
                            </div>
                        </form>
                    </div>

                    {/* Rappel Client */}
                    {user.role === 'client' && (
                        <div className="card p-6">
                            <h2 className="text-lg font-bold text-slate-900 mb-4">Préférences de rappels</h2>
                            <p className="text-sm text-slate-500 mb-4">Soyez notifié lorsque vous devriez commander à nouveau votre bouteille de gaz.</p>
                            <form onSubmit={submitRappel} className="space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={rappelData.rappel_actif} onChange={e => setRappelData('rappel_actif', e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-orange-500 focus:ring-orange-400" />
                                    <span className="text-sm font-semibold text-slate-700">Activer les rappels de commande</span>
                                </label>
                                {rappelData.rappel_actif && (
                                    <div className="mt-4 pl-8 border-l-2 border-slate-200">
                                        <label className="form-label">Fréquence de rappel (en jours)</label>
                                        <div className="flex items-center gap-3">
                                            <input type="number" min="1" value={rappelData.frequence_rappel_jours} onChange={e => setRappelData('frequence_rappel_jours', e.target.value)} className="form-input w-24" />
                                            <span className="text-sm text-slate-500">jours</span>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-4 mt-4">
                                    <button type="submit" disabled={rappelProcessing} className="btn-secondary">Mettre à jour les rappels</button>
                                    {rappelSuccess && <span className="text-emerald-600 text-sm font-medium">✓ Préférences sauvées.</span>}
                                </div>
                            </form>
                        </div>
                    )}
                </motion.div>

                {/* Sécurité */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
                    <div className="card p-6 border-red-100">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span>🔒</span> Sécurité
                        </h2>
                        <form onSubmit={submitPwd} className="space-y-4">
                            <div>
                                <label className="form-label">Mot de passe actuel</label>
                                <input type="password" value={pwdData.current_password} onChange={e => setPwdData('current_password', e.target.value)} className={`form-input ${pwdErrors.current_password ? 'border-red-500' : ''}`} required />
                                {pwdErrors.current_password && <p className="form-error">{pwdErrors.current_password}</p>}
                            </div>
                            <div>
                                <label className="form-label">Nouveau mot de passe</label>
                                <input type="password" value={pwdData.password} onChange={e => setPwdData('password', e.target.value)} className={`form-input ${pwdErrors.password ? 'border-red-500' : ''}`} required />
                                {pwdErrors.password && <p className="form-error">{pwdErrors.password}</p>}
                            </div>
                            <div>
                                <label className="form-label">Confirmer le mot de passe</label>
                                <input type="password" value={pwdData.password_confirmation} onChange={e => setPwdData('password_confirmation', e.target.value)} className={`form-input ${pwdErrors.password_confirmation ? 'border-red-500' : ''}`} required />
                                {pwdErrors.password_confirmation && <p className="form-error">{pwdErrors.password_confirmation}</p>}
                            </div>
                            <div className="pt-2">
                                <button type="submit" disabled={pwdProcessing} className="btn-primary w-full">Changer de mot de passe</button>
                                {pwdSuccess && <p className="text-emerald-600 text-sm font-medium mt-2 text-center">✓ Mot de passe mis à jour.</p>}
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AuthenticatedLayout>
    );
}
