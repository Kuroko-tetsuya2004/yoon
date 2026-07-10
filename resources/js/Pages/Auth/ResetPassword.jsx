import { useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'));
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
            <Head title="Réinitialiser le mot de passe" />

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

                <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">Nouveau mot de passe</h2>

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
                            autoComplete="username"
                        />
                        {errors.email && <div className="form-error">{errors.email}</div>}
                    </div>

                    <div>
                        <label htmlFor="password" className="form-label">Nouveau mot de passe</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className={`form-input ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                            autoComplete="new-password"
                            autoFocus
                        />
                        {errors.password && <div className="form-error">{errors.password}</div>}
                    </div>

                    <div>
                        <label htmlFor="password_confirmation" className="form-label">Confirmer le mot de passe</label>
                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className={`form-input ${errors.password_confirmation ? 'border-red-400 focus:ring-red-400' : ''}`}
                            autoComplete="new-password"
                        />
                        {errors.password_confirmation && <div className="form-error">{errors.password_confirmation}</div>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="btn-primary w-full btn-lg mt-4"
                    >
                        {processing ? 'Mise à jour...' : 'Réinitialiser le mot de passe'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
