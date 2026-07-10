import { Head, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Welcome({ auth }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col selection:bg-orange-500 selection:text-white">
            <Head title="Bienvenue" />

            {/* Navigation */}
            <nav className="w-full bg-white shadow-sm py-4 px-6 sm:px-10 flex justify-between items-center fixed top-0 z-50">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-3"
                >
                    <div className="w-8 h-8 bg-orange-500 text-white flex items-center justify-center rounded-lg text-lg font-bold shadow-lg shadow-orange-500/20">Y</div>
                    <span className="text-2xl font-bold text-slate-800 tracking-tight">Yoon</span>
                </motion.div>
                <div className="hidden md:flex space-x-4">
                    {auth.user ? (
                        <Link href={route('dashboard')} className="font-semibold text-gray-600 hover:text-orange-500 transition">
                            Tableau de bord
                        </Link>
                    ) : (
                        <>
                            <Link href={route('login')} className="font-semibold text-gray-600 hover:text-orange-500 transition">
                                Connexion
                            </Link>
                            <Link href={route('register')} className="ml-4 px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow hover:bg-orange-600 transition">
                                S'inscrire
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-gray-600 hover:text-orange-500 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden fixed top-[72px] left-0 w-full bg-white shadow-md z-40 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 flex flex-col space-y-4">
                            {auth.user ? (
                                <Link href={route('dashboard')} className="block font-semibold text-gray-700 hover:text-orange-500 py-2 border-b border-gray-100">
                                    Tableau de bord
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="block font-semibold text-gray-700 hover:text-orange-500 py-2 border-b border-gray-100">
                                        Connexion
                                    </Link>
                                    <Link href={route('register')} className="block w-full text-center px-4 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow mt-2">
                                        S'inscrire
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-6 pt-24">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-3xl"
                >
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
                        Livraisons <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">rapides,</span> partout au Sénégal
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 mb-10">
                        La plateforme n°1 pour vos besoins en gaz, matériaux lourds et équipements professionnels. Simple, rapide et sécurisé.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
                        <Link href={route('register')} className="px-8 py-4 bg-orange-500 text-white font-bold rounded-full shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all transform hover:-translate-y-1 w-full sm:w-auto text-center">
                            Commander maintenant
                        </Link>
                        <Link href={route('register')} className="px-8 py-4 bg-white text-orange-500 border border-orange-200 font-bold rounded-full shadow hover:bg-gray-50 transition-all w-full sm:w-auto text-center">
                            Devenir Partenaire
                        </Link>
                    </div>
                </motion.div>

                {/* Features / Animation */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-16 sm:mt-24 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
                        <div className="w-12 h-12 bg-orange-100 text-orange-500 flex justify-center items-center rounded-xl mb-6 text-2xl">⚡</div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800">Rapidité</h3>
                        <p className="text-gray-500">Un algorithme optimisé pour assigner le livreur le plus proche en quelques secondes.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
                        <div className="w-12 h-12 bg-amber-100 text-amber-600 flex justify-center items-center rounded-xl mb-6 text-2xl">🛡️</div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800">Sécurité</h3>
                        <p className="text-gray-500">Un réseau de livreurs et partenaires certifiés pour garantir vos livraisons.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
                        <div className="w-12 h-12 bg-green-100 text-green-600 flex justify-center items-center rounded-xl mb-6 text-2xl">📍</div>
                        <h3 className="text-xl font-bold mb-3 text-gray-800">Suivi en direct</h3>
                        <p className="text-gray-500">Suivez l'avancement de votre commande en temps réel sur la carte interactive.</p>
                    </div>
                </motion.div>
            </main>

            <footer className="mt-20 py-8 text-center text-gray-400 text-sm border-t border-gray-200 bg-white">
                &copy; {new Date().getFullYear()} Yoon. Tous droits réservés.
            </footer>
        </div>
    );
}
