import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Index({ auth, produits, flash }) {
    const { patch, delete: destroy, post } = useForm();
    const { data, setData, post: postRestock } = useForm({ quantite: 1 });

    const toggleStatus = (id) => {
        patch(route('partenaire.produits.toggle-status', id));
    };

    const deleteProduit = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            destroy(route('partenaire.produits.destroy', id));
        }
    };

    const restock = (e, id) => {
        e.preventDefault();
        postRestock(route('partenaire.produits.restock', id), {
            preserveScroll: true,
            onSuccess: () => setData('quantite', 1)
        });
    };

    const formatPrice = (price) => Number(price).toLocaleString('fr-FR');

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mon Catalogue de Produits</h2>}>
            <Head title="Mon Catalogue" />

            <div className="pb-12 pt-2 sm:pt-6">
                <div className="w-full space-y-6">
                    {/* Module de Géolocalisation Boutique */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                    📍 Localisation GPS de votre boutique
                                </h3>
                                {auth.user.latitude && auth.user.longitude ? (
                                    <p className="text-sm text-emerald-600 mt-1">
                                        Position enregistrée : <span className="font-bold">{Number(auth.user.latitude).toFixed(5)}, {Number(auth.user.longitude).toFixed(5)}</span> ({auth.user.adresse || 'Adresse textuelle non définie'})
                                    </p>
                                ) : (
                                    <p className="text-sm text-rose-600 mt-1">
                                        ⚠️ Votre boutique n'est pas encore géolocalisée. Vos livraisons ne pourront pas être assignées automatiquement !
                                    </p>
                                )}
                            </div>
                            <Link
                                href={route('partenaire.location')}
                                className={`w-full sm:w-auto font-bold py-2.5 px-5 rounded-xl shadow transition flex items-center justify-center gap-2 text-center ${
                                    auth.user.latitude && auth.user.longitude
                                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                        : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
                                }`}
                            >
                                {auth.user.latitude && auth.user.longitude ? 'Modifier ma position GPS' : 'Géolocaliser ma boutique'}
                            </Link>
                        </div>
                    </div>
                    

                    

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h3 className="text-lg font-medium text-gray-900">Gérez vos articles</h3>
                        <Link href={route('partenaire.produits.create')} className="w-full sm:w-auto text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow transition">
                            + Ajouter un produit
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm border border-gray-100 sm:rounded-xl">
                        <div className="p-0 sm:p-6 text-gray-900">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {produits.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-10 text-center text-sm text-gray-500">
                                                    Vous n'avez pas encore ajouté de produit à votre catalogue.
                                                </td>
                                            </tr>
                                        ) : (
                                            produits.map(produit => (
                                                <motion.tr 
                                                    key={produit.id} 
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                {produit.photo ? (
                                                                    <img className="h-10 w-10 rounded-full object-cover" src={produit.photo_url || `/storage/${produit.photo}`} alt="" />
                                                                ) : (
                                                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">📦</div>
                                                                )}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{produit.nom_produit}</div>
                                                                <div className="text-sm text-gray-500">{produit.marque} - {produit.modele}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                                            {produit.categorie}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                        {formatPrice(produit.prix)} FCFA
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {['gaz', 'pondereux'].includes(produit.categorie) ? (
                                                            <div className="flex items-center space-x-2">
                                                                <span className={`font-semibold ${produit.quantite_stock <= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                                    {produit.quantite_stock}
                                                                </span>
                                                                <form onSubmit={(e) => restock(e, produit.id)} className="flex items-center space-x-1">
                                                                    <input 
                                                                        type="number" 
                                                                        min="1" 
                                                                        value={data.quantite}
                                                                        onChange={e => setData('quantite', e.target.value)}
                                                                        className="w-16 text-xs border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" 
                                                                    />
                                                                    <button type="submit" className="inline-flex items-center px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded shadow-sm transition" title="Renflouer le stock">
                                                                        + Renflouer
                                                                    </button>
                                                                </form>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">—</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex flex-col space-y-1">
                                                            {produit.est_disponible ? (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 self-start">En stock</span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 self-start">Rupture</span>
                                                            )}
                                                            {['gaz', 'pondereux'].includes(produit.categorie) && (
                                                                <button onClick={() => toggleStatus(produit.id)} className="text-xs text-indigo-600 hover:text-indigo-900 underline text-left">
                                                                    {produit.est_disponible ? 'Mettre en rupture' : 'Remettre en stock'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Link href={route('partenaire.produits.edit', produit.id)} className="text-indigo-600 hover:text-indigo-900 mr-3">Éditer</Link>
                                                        <button onClick={() => deleteProduit(produit.id)} className="text-red-600 hover:text-red-900">Supprimer</button>
                                                    </td>
                                                </motion.tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
