import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Dashboard({ auth, produits, hasReperes }) {
    const categories = [
        { key: 'all', name: 'Toutes les catégories', icon: '🔍', color: 'text-gray-600', bg: 'bg-gray-100' },
        { key: 'gaz', name: 'Gaz Butane', icon: '⚡', color: 'text-blue-600', bg: 'bg-blue-100' },
        { key: 'pondereux', name: 'Produits Pondéreux', icon: '🧱', color: 'text-yellow-600', bg: 'bg-yellow-100' },
        { key: 'materiel', name: 'Matériel Événementiel', icon: '🎉', color: 'text-purple-600', bg: 'bg-purple-100' },
    ];

    const [activeCategory, setActiveCategory] = useState('all');
    const [showAddressModal, setShowAddressModal] = useState(() => {
        // Show modal if client has no reperes and hasn't dismissed it
        if (auth.user.role !== 'client' || hasReperes) return false;
        return localStorage.getItem(`dismissedAddress_${auth.user.id}`) !== 'true';
    });

    const dismissAddressModal = () => {
        localStorage.setItem(`dismissedAddress_${auth.user.id}`, 'true');
        setShowAddressModal(false);
    };

    const isCatalogEmpty = !produits || Object.keys(produits).length === 0;

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Catalogue des produits</h2>}
        >
            <Head title="Catalogue" />

            <div className="pb-12 pt-2 sm:pt-6">
                <div className="w-full">
                    {auth.user.role === 'partenaire' && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-indigo-50 border-l-4 border-indigo-500 text-indigo-700 p-4 mb-8 rounded shadow-sm"
                        >
                            <div className="flex flex-col sm:flex-row items-center justify-between">
                                <div className="mb-4 sm:mb-0">
                                    <p className="font-bold text-lg">Espace Partenaire</p>
                                    <p>Bienvenue ! Gérez votre boutique et vos articles depuis votre catalogue.</p>
                                </div>
                                <Link 
                                    href={route('partenaire.produits.index')} 
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow transition"
                                >
                                    Gérer mon catalogue
                                </Link>
                            </div>
                        </motion.div>
                    )}

                    {isCatalogEmpty ? (
                        <div className="text-center text-gray-500 py-10">
                            <div className="text-4xl mb-4">🛒</div>
                            <p className="text-lg font-medium">Aucun produit disponible pour le moment.</p>
                            <p className="mt-1 text-sm">Les partenaires ajouteront bientôt leurs offres !</p>
                        </div>
                    ) : (
                        <>
                            {/* Category Filter Tabs */}
                            <div className="flex overflow-x-auto pb-4 gap-2 mb-6 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                                {categories.map(cat => (
                                    <button
                                        key={cat.key}
                                        onClick={() => setActiveCategory(cat.key)}
                                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                                            activeCategory === cat.key 
                                            ? 'bg-gray-900 text-white shadow-md' 
                                            : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm border border-gray-200'
                                        }`}
                                    >
                                        <span className="mr-2">{cat.icon}</span>
                                        {cat.name}
                                    </button>
                                ))}
                            </div>

                            {categories.filter(c => c.key !== 'all').map((category, idx) => {
                                if (activeCategory !== 'all' && activeCategory !== category.key) return null;
                                const catProducts = produits[category.key] || [];
                                if (catProducts.length === 0) return null;

                            return (
                                <motion.div 
                                    key={category.key}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    className="mb-10"
                                >
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                        <span className={`${category.bg} ${category.color} p-2 rounded-lg mr-3 text-xl w-10 h-10 flex items-center justify-center`}>
                                            {category.icon}
                                        </span>
                                        {category.name}
                                    </h3>
                                    
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                        {catProducts.map((produit, i) => (
                                            <motion.div 
                                                key={produit.id}
                                                whileHover={{ scale: 1.05 }}
                                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full group"
                                            >
                                                <div className="relative h-32 bg-gray-50 flex items-center justify-center p-3 overflow-hidden">
                                                    {produit.photo_url ? (
                                                        <img src={produit.photo_url} alt={produit.nom_produit} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300" />
                                                    ) : produit.photo ? (
                                                        <img src={`/storage/${produit.photo}`} alt={produit.nom_produit} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300" />
                                                    ) : (
                                                        <div className="text-4xl text-gray-300">📦</div>
                                                    )}
                                                    {produit.quantite_stock > 0 ? (
                                                        <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded">En stock</span>
                                                    ) : (
                                                        <span className="absolute top-2 right-2 bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded">Épuisé</span>
                                                    )}
                                                </div>
                                                
                                                <div className="p-3 flex-1 flex flex-col">
                                                    <h4 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-1" title={produit.nom_produit}>{produit.nom_produit}</h4>
                                                    <div className="text-xs text-gray-500 mb-2">
                                                        <span className="inline-block bg-gray-100 rounded px-1">{produit.partenaire?.name || 'Partenaire'}</span>
                                                    </div>
                                                    
                                                    <div className="mt-auto flex items-end justify-between">
                                                        <span className="font-black text-gray-900">{Number(produit.prix).toLocaleString('fr-FR')} FCFA</span>
                                                    </div>
                                                    
                                                    {auth.user.role === 'client' && (
                                                        <Link
                                                            href={route(`commandes.${category.key}.create`, { produit_id: produit.id })}
                                                            className={`mt-3 w-full block text-center py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition ${
                                                                produit.quantite_stock > 0 
                                                                ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm' 
                                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                                                            }`}
                                                        >
                                                            Commander
                                                        </Link>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            );
                        })
                        }
                        </>
                    )}
                </div>
            </div>

            {/* Modal de demande d'adresse */}
            {showAddressModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl shadow-xl p-6 w-11/12 max-w-md"
                    >
                        <div className="text-center">
                            <div className="text-5xl mb-4">📍</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Ajoutez votre première adresse</h3>
                            <p className="text-gray-600 mb-6">
                                Pour faciliter vos futures commandes et livraisons, nous vous invitons à renseigner votre adresse.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Link
                                href={route('reperes.create')}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg text-center transition"
                            >
                                Renseigner une adresse
                            </Link>
                            <button
                                onClick={dismissAddressModal}
                                className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-3 px-4 rounded-lg text-center transition"
                            >
                                Ignorer pour le moment
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
