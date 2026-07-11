import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash, admin_badges } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // Auto-hide flash messages after 5 seconds
    const [visibleFlash, setVisibleFlash] = useState(flash);
    useEffect(() => {
        setVisibleFlash(flash);
        if (flash?.success || flash?.error) {
            const timer = setTimeout(() => setVisibleFlash({}), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const getNavigationLinks = () => {
        const links = [];

        if (auth.user.role === 'client') {
            links.push(
                { name: 'Acheter', href: route('dashboard'), active: route().current('dashboard'), icon: '🛍️' },
                { name: 'Mes Adresses', href: route('reperes.index'), active: route().current('reperes.*'), icon: '📍' },
                { name: 'Mes Commandes', href: route('commandes.index'), active: route().current('commandes.*'), icon: '📦' }
            );
        } else if (auth.user.role === 'partenaire') {
            links.push(
                { name: 'Mon Catalogue', href: route('partenaire.produits.index'), active: route().current('partenaire.produits.*') || route().current('partenaire.dashboard'), icon: '🏷️' },
                { name: 'Commandes Reçues', href: route('partenaire.commandes.index'), active: route().current('partenaire.commandes.*'), icon: '🛒' }
            );
        } else if (auth.user.role === 'livreur') {
            links.push(
                { name: 'Tableau de bord', href: route('livreur.dashboard'), active: route().current('livreur.dashboard'), icon: '📊' }
            );
        } else if (auth.user.role === 'administrateur') {
            links.push(
                { name: 'Tableau de bord', href: route('admin.dashboard'), active: route().current('admin.dashboard'), icon: '📊' },
                { name: 'Partenaires', href: route('admin.partenaires'), active: route().current('admin.partenaires'), icon: '🤝', badge: admin_badges?.partenaires > 0 ? admin_badges.partenaires : null },
                { name: 'Livreurs', href: route('admin.livreurs'), active: route().current('admin.livreurs'), icon: '🏍️', badge: admin_badges?.livreurs > 0 ? admin_badges.livreurs : null },
                { name: 'Litiges', href: route('admin.litiges'), active: route().current('admin.litiges'), icon: '⚠️' }
            );
        }

        return links;
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shadow-xl z-20 fixed h-full">
                <div className="h-16 flex items-center px-6 border-b border-slate-800 mb-6 bg-slate-950/50">
                    <Link href={route('dashboard')} className="flex items-center gap-3 group">
                        <div className="w-8 h-8 bg-orange-500 text-white flex items-center justify-center rounded-lg text-lg font-bold shadow-lg shadow-orange-500/20 group-hover:bg-orange-400 transition">Y</div>
                        <span className="text-xl font-bold text-white tracking-tight">Yoon</span>
                    </Link>
                </div>

                <div className="px-4 pb-6 border-b border-slate-800/50 mb-4">
                    <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            {auth.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-white truncate">{auth.user.name}</p>
                            <p className="text-xs text-slate-400 truncate capitalize">{auth.user.role}</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                    {getNavigationLinks().map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                link.active
                                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-lg">{link.icon}</span>
                                {link.name}
                            </div>
                            {link.badge && (
                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    {link.badge}
                                </span>
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    >
                        <span className="text-lg">🚪</span>
                        Déconnexion
                    </Link>
                </div>
            </aside>

            {/* Overlay Mobile */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Mobile */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.aside
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                        className="fixed inset-y-0 left-0 w-64 bg-slate-900 text-slate-300 shadow-2xl z-50 flex flex-col md:hidden"
                    >
                        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950/50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-orange-500 text-white flex items-center justify-center rounded-lg text-lg font-bold">Y</div>
                                <span className="text-xl font-bold text-white">Yoon</span>
                            </div>
                            <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                        </div>
                        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                            {getNavigationLinks().map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                                        link.active ? 'bg-orange-500 text-white' : 'hover:bg-slate-800 hover:text-white'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">{link.icon}</span>
                                        {link.name}
                                    </div>
                                    {link.badge && (
                                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                            {link.badge}
                                        </span>
                                    )}
                                </Link>
                            ))}
                        </nav>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex flex-col md:ml-64 min-w-0 min-h-screen transition-all duration-300">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        {header && <div className="font-semibold text-lg text-slate-800 hidden sm:block">{header}</div>}
                    </div>

                    <div className="flex items-center gap-4 relative">
                        {/* Status badge si non validé */}
                        {auth.user.statut_validation !== 'valide' && auth.user.role !== 'client' && auth.user.role !== 'administrateur' && (
                            <span className="hidden sm:inline-flex badge badge-yellow">En attente de validation</span>
                        )}

                        <button
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className="flex items-center gap-2 hover:bg-slate-50 p-1.5 pl-3 rounded-full border border-transparent hover:border-slate-200 transition"
                        >
                            <span className="text-sm font-medium text-slate-700 hidden sm:block">{auth.user.name}</span>
                            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                                {auth.user.name.charAt(0).toUpperCase()}
                            </div>
                        </button>

                        <AnimatePresence>
                            {userMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50 overflow-hidden"
                                    >
                                        <div className="px-4 py-2 border-b border-slate-100 mb-1 sm:hidden">
                                            <p className="text-sm font-semibold text-slate-800 truncate">{auth.user.name}</p>
                                        </div>
                                        <Link href={route('profile.edit')} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition">
                                            <span>👤</span> Mon Profil
                                        </Link>
                                        <Link href={route('logout')} method="post" as="button" className="flex items-center w-full text-left gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition">
                                            <span>🚪</span> Déconnexion
                                        </Link>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full relative">
                    {/* Global Flash Messages */}
                    <AnimatePresence>
                        {visibleFlash?.success && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="alert-success mb-6 shadow-sm"
                            >
                                <span>✅</span>
                                <div>{visibleFlash.success}</div>
                            </motion.div>
                        )}
                        {visibleFlash?.error && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="alert-error mb-6 shadow-sm"
                            >
                                <span>❌</span>
                                <div>{visibleFlash.error}</div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Page Mobile Header Fallback */}
                    {header && <div className="font-semibold text-xl text-slate-800 mb-6 sm:hidden">{header}</div>}

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
