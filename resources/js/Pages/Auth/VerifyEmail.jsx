import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
            <Head title="Vérification de l'email" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100"
            >
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 bg-orange-100 text-orange-500 flex items-center justify-center rounded-xl text-2xl font-bold shadow-sm">
                        ✉️
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Vérifiez votre email</h2>
                <p className="text-center text-slate-500 text-sm mb-6">
                    Merci pour votre inscription ! Avant de commencer, pourriez-vous vérifier votre adresse email en cliquant sur le lien que nous venons de vous envoyer ? Si vous n'avez pas reçu l'email, nous vous en enverrons un autre avec plaisir.
                </p>

                {status === 'verification-link-sent' && (
                    <div className="alert-success mb-6">
                        <span>✓</span>
                        <span>Un nouveau lien de vérification a été envoyé à l'adresse email que vous avez fournie lors de l'inscription.</span>
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className="flex flex-col gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="btn-primary w-full btn-lg"
                        >
                            {processing ? 'Envoi en cours...' : "Renvoyer l'email de vérification"}
                        </button>

                        <div className="flex items-center justify-between mt-2">
                            <Link
                                href={route('profile.edit')}
                                className="text-sm text-slate-500 hover:text-slate-900 transition"
                            >
                                Modifier le profil
                            </Link>

                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="text-sm text-slate-500 hover:text-red-500 transition"
                            >
                                Déconnexion
                            </Link>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
