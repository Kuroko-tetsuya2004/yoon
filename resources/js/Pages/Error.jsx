import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Error({ status, message }) {
    const title = {
        503: 'Service Indisponible',
        500: 'Erreur Serveur',
        404: 'Page Non Trouvée',
        403: 'Accès Refusé',
    }[status] || 'Erreur';

    const defaultDescription = {
        503: 'Le service est temporairement indisponible. Veuillez réessayer plus tard.',
        500: 'Oops, un problème est survenu sur nos serveurs.',
        404: 'La page que vous recherchez n\'existe pas.',
        403: 'Vous n\'avez pas la permission d\'accéder à cette page.',
    }[status];

    const description = message || defaultDescription;

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 selection:bg-orange-500 selection:text-white">
            <Head title={title} />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <div className="flex justify-center items-center mb-8 gap-3">
                    <div className="w-12 h-12 bg-orange-500 text-white flex items-center justify-center rounded-xl text-2xl font-bold shadow-lg shadow-orange-500/20">Y</div>
                    <span className="text-4xl font-bold text-white tracking-tight">Yoon</span>
                </div>

                <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 mb-4">
                    {status}
                </h1>
                
                <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">
                    {title}
                </h2>
                
                <p className="text-slate-400 text-lg max-w-md mx-auto mb-10">
                    {description}
                </p>

                <Link 
                    href={route('dashboard')} 
                    className="inline-block px-8 py-4 bg-orange-500 text-white font-bold rounded-full shadow-lg shadow-orange-500/30 hover:bg-orange-600 hover:shadow-orange-600/40 transition-all transform hover:-translate-y-1"
                >
                    Retour à l'accueil
                </Link>
            </motion.div>
        </div>
    );
}
