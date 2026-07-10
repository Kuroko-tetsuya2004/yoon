import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        telephone: '',
        password: '',
        remember: false,
    });
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        return () => { reset('password'); };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen flex">
            <Head title="Connexion — Yoon" />

            {/* Panneau gauche — illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-12 relative overflow-hidden">
                {/* Cercles décoratifs */}
                <div className="absolute -top-20 -left-20 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-700/60 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg">Y</div>
                        <span className="text-white font-bold text-2xl tracking-tight">Yoon</span>
                    </div>
                </div>

                <div className="relative z-10 space-y-6">
                    <h1 className="text-4xl font-bold text-white leading-tight">
                        Livraisons rapides,<br />
                        <span className="text-orange-400">partout au Sénégal.</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-sm leading-relaxed">
                        Gaz, matériaux pondéreux, matériel événementiel — commandez en quelques clics.
                    </p>

                    <div className="flex flex-col gap-3 mt-4">
                        {[
                            { icon: '⚡', text: 'Livraison express de gaz butane' },
                            { icon: '🧱', text: 'Transport de matériaux pondéreux' },
                            { icon: '🎉', text: 'Location de matériel événementiel' },
                        ].map((item) => (
                            <div key={item.text} className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-orange-500/20 text-orange-400 rounded-lg flex items-center justify-center text-sm">{item.icon}</div>
                                <span className="text-slate-300 text-sm">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-slate-600 text-xs">© {new Date().getFullYear()} Yoon — Dakar, Sénégal</div>
            </div>

            {/* Panneau droit — formulaire */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-slate-50">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="w-full max-w-md"
                >
                    {/* Logo mobile */}
                    <div className="flex lg:hidden items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg">Y</div>
                        <span className="font-bold text-2xl text-slate-900 tracking-tight">Yoon</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">Bon retour 👋</h2>
                        <p className="text-slate-500 mt-1 text-sm">Connectez-vous à votre compte</p>
                    </div>

                    {status && (
                        <div className="alert-success mb-6">
                            <span>✓</span>
                            <span>{status}</span>
                        </div>
                    )}

                    {(errors.telephone || errors.password) && (
                        <div className="alert-error mb-6">
                            <span>✕</span>
                            <span>{errors.telephone || errors.password || 'Identifiants incorrects.'}</span>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        {/* Numéro de téléphone */}
                        <div>
                            <label htmlFor="telephone" className="form-label">
                                Numéro de téléphone
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm select-none">
                                    📞
                                </span>
                                <input
                                    id="telephone"
                                    type="tel"
                                    name="telephone"
                                    pattern="[0-9]{9}"
                                    maxLength={9}
                                    title="Entrez exactement 9 chiffres"
                                    value={data.telephone}
                                    onChange={(e) => setData('telephone', e.target.value.replace(/\D/g, '').slice(0, 9))}
                                    placeholder="7X XXX XX XX"
                                    autoComplete="tel"
                                    autoFocus
                                    className={`form-input pl-10 ${errors.telephone ? 'border-red-400 focus:ring-red-400' : ''}`}
                                    required
                                />
                            </div>
                            <p className="mt-1.5 text-xs text-slate-400">9 chiffres sans espaces ni indicatif pays</p>
                        </div>

                        {/* Mot de passe */}
                        <div>
                            <label htmlFor="password" className="form-label">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm select-none">🔒</span>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Votre mot de passe"
                                    autoComplete="current-password"
                                    className={`form-input pl-10 pr-12 ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition text-sm"
                                    tabIndex={-1}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        {/* Se souvenir + mot de passe oublié */}
                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400 cursor-pointer"
                                />
                                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition">Se souvenir de moi</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-orange-500 hover:text-orange-600 font-medium transition"
                                >
                                    Mot de passe oublié ?
                                </Link>
                            )}
                        </div>

                        {/* Bouton connexion */}
                        <button
                            type="submit"
                            disabled={processing || data.telephone.length !== 9}
                            className="btn-primary w-full btn-lg mt-2"
                        >
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                    </svg>
                                    Connexion...
                                </span>
                            ) : 'Se connecter'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Pas encore de compte ?{' '}
                        <Link href={route('register')} className="text-orange-500 hover:text-orange-600 font-semibold transition">
                            Créer un compte
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
