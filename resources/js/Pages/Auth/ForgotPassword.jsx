import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
            <Head title="Mot de passe oublié" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100"
            >
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 bg-orange-100 text-orange-500 flex items-center justify-center rounded-xl text-2xl font-bold shadow-sm">
                        Y
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Mot de passe oublié ?</h2>
                <p className="text-center text-slate-500 text-sm mb-6">
                    Pas de problème. Indiquez-nous votre adresse email et nous vous enverrons un lien de réinitialisation.
                </p>

                {status && (
                    <div className="alert-success mb-6">
                        <span>✓</span>
                        <span>{status}</span>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="form-label">Adresse Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className={`form-input ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
                            autoFocus
                            required
                        />
                        {errors.email && <div className="form-error">{errors.email}</div>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="btn-primary w-full btn-lg"
                    >
                        {processing ? 'Envoi en cours...' : 'Envoyer le lien'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link href={route('login')} className="text-sm font-medium text-slate-500 hover:text-orange-500 transition">
                        ← Retour à la connexion
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
