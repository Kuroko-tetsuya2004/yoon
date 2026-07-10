import { useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'));
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
            <Head title="Confirmer le mot de passe" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100"
            >
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 bg-orange-100 text-orange-500 flex items-center justify-center rounded-xl text-2xl font-bold shadow-sm">
                        🔒
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Zone sécurisée</h2>
                <p className="text-center text-slate-500 text-sm mb-6">
                    Il s'agit d'une zone sécurisée de l'application. Veuillez confirmer votre mot de passe avant de continuer.
                </p>

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label htmlFor="password" className="form-label">Mot de passe</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className={`form-input ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                            autoComplete="current-password"
                            autoFocus
                        />
                        {errors.password && <div className="form-error">{errors.password}</div>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="btn-primary w-full btn-lg mt-4"
                    >
                        {processing ? 'Vérification...' : 'Confirmer le mot de passe'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
