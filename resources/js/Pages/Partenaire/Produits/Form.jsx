import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Form({ auth, produit, flash }) {
    const isEdit = !!produit;

    const { data, setData, post, put, processing, errors } = useForm({
        categorie: produit?.categorie || 'gaz',
        marque: produit?.marque || '',
        modele: produit?.modele || '',
        nom_produit: produit?.nom_produit || '',
        description: produit?.description || '',
        prix: produit?.prix || '',
        photo: null,
        est_disponible: produit?.est_disponible ?? true,
        quantite_stock: produit?.quantite_stock || 0,
        _method: isEdit ? 'PUT' : 'POST', // For file uploads in PUT requests with Inertia
    });

    const placeholders = {
        'gaz': {
            'marque': 'Marque (ex: Touba Gaz, Total)',
            'modele': 'Modèle (ex: 6kg, 12kg, 38kg)',
            'nom': 'Nom public (ex: Recharge Gaz 12kg)'
        },
        'pondereux': {
            'marque': 'Marque ou Fabricant (ex: Sococim, Lesieur)',
            'modele': 'Conditionnement (ex: Sac de 50kg, Bouteille 1L)',
            'nom': 'Nom public (ex: Riz Parfumé Brisures)'
        },
        'materiel': {
            'marque': 'Type / Marque (ex: Générique, Yamaha)',
            'modele': 'Dimensions / Capacité (ex: 50 places, 500W)',
            'nom': 'Nom du matériel (ex: Tente de réception VIP)'
        }
    };

    const currentLabels = placeholders[data.categorie] || placeholders['gaz'];
    const showStock = ['gaz', 'pondereux'].includes(data.categorie);

    const submit = (e) => {
        e.preventDefault();
        
        if (isEdit) {
            // Inertia handles PUT with files differently, so we use POST with _method=PUT
            post(route('partenaire.produits.update', produit.id));
        } else {
            post(route('partenaire.produits.store'));
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{isEdit ? 'Modifier le Produit' : 'Ajouter un Produit'}</h2>}>
            <Head title={isEdit ? 'Modifier Produit' : 'Ajouter Produit'} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6"
                    >
                        
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {/* Catégorie */}
                                <div>
                                    <label htmlFor="categorie" className="block font-medium text-sm text-gray-700">Catégorie</label>
                                    <select 
                                        id="categorie" 
                                        value={data.categorie}
                                        onChange={e => setData('categorie', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    >
                                        <option value="gaz">Gaz Butane</option>
                                        <option value="pondereux">Produit Pondéreux (Riz, Eau...)</option>
                                        <option value="materiel">Matériel Événementiel</option>
                                    </select>
                                    {errors.categorie && <p className="mt-2 text-sm text-red-600">{errors.categorie}</p>}
                                </div>

                                {/* Marque */}
                                <div>
                                    <label htmlFor="marque" className="block font-medium text-sm text-gray-700">{currentLabels.marque}</label>
                                    <input 
                                        id="marque" 
                                        type="text" 
                                        value={data.marque}
                                        onChange={e => setData('marque', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm" 
                                        required 
                                    />
                                    {errors.marque && <p className="mt-2 text-sm text-red-600">{errors.marque}</p>}
                                </div>

                                {/* Modèle */}
                                <div>
                                    <label htmlFor="modele" className="block font-medium text-sm text-gray-700">{currentLabels.modele}</label>
                                    <input 
                                        id="modele" 
                                        type="text" 
                                        value={data.modele}
                                        onChange={e => setData('modele', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm" 
                                        required 
                                    />
                                    {errors.modele && <p className="mt-2 text-sm text-red-600">{errors.modele}</p>}
                                </div>

                                {/* Nom du produit */}
                                <div>
                                    <label htmlFor="nom_produit" className="block font-medium text-sm text-gray-700">{currentLabels.nom}</label>
                                    <input 
                                        id="nom_produit" 
                                        type="text" 
                                        value={data.nom_produit}
                                        onChange={e => setData('nom_produit', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm" 
                                        required 
                                    />
                                    {errors.nom_produit && <p className="mt-2 text-sm text-red-600">{errors.nom_produit}</p>}
                                </div>

                                {/* Prix */}
                                <div>
                                    <label htmlFor="prix" className="block font-medium text-sm text-gray-700">Prix de base (FCFA)</label>
                                    <input 
                                        id="prix" 
                                        type="number" 
                                        value={data.prix}
                                        onChange={e => setData('prix', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm" 
                                        required 
                                    />
                                    {errors.prix && <p className="mt-2 text-sm text-red-600">{errors.prix}</p>}
                                </div>

                                {/* Photo */}
                                <div>
                                    <label htmlFor="photo" className="block font-medium text-sm text-gray-700">Photo du produit (Optionnel)</label>
                                    <input 
                                        id="photo" 
                                        type="file" 
                                        onChange={e => setData('photo', e.target.files[0])}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" 
                                        accept="image/*" 
                                    />
                                    {isEdit && produit.photo && (
                                        <img src={produit.photo_url || `/storage/${produit.photo}`} className="h-16 mt-2 rounded border" alt="Produit" />
                                    )}
                                    {errors.photo && <p className="mt-2 text-sm text-red-600">{errors.photo}</p>}
                                </div>

                                {/* Description */}
                                <div className="sm:col-span-2">
                                    <label htmlFor="description" className="block font-medium text-sm text-gray-700">Description courte</label>
                                    <textarea 
                                        id="description" 
                                        rows="3"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    ></textarea>
                                    {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
                                </div>

                                {/* Quantité en Stock */}
                                {showStock && (
                                    <div className="sm:col-span-2">
                                        <label htmlFor="quantite_stock" className="block font-medium text-sm text-gray-700">Quantité en stock</label>
                                        <input 
                                            id="quantite_stock" 
                                            type="number" 
                                            min="0"
                                            value={data.quantite_stock}
                                            onChange={e => setData('quantite_stock', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm" 
                                        />
                                        <p className="mt-1 text-sm text-gray-500">Nombre d'unités disponibles. Le produit sera automatiquement mis en rupture de stock quand ce nombre atteint 0.</p>
                                        {errors.quantite_stock && <p className="mt-2 text-sm text-red-600">{errors.quantite_stock}</p>}
                                    </div>
                                )}

                                {/* Disponibilité */}
                                <div className="sm:col-span-2">
                                    <label htmlFor="est_disponible" className="inline-flex items-center cursor-pointer">
                                        <input 
                                            id="est_disponible" 
                                            type="checkbox" 
                                            checked={data.est_disponible}
                                            onChange={e => setData('est_disponible', e.target.checked)}
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500" 
                                        />
                                        <span className="ms-2 text-sm text-gray-600">Produit disponible en stock</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex items-center justify-end mt-6 pt-4 border-t border-gray-200">
                                <Link href={route('partenaire.produits.index')} className="text-sm text-gray-600 hover:text-gray-900 mr-4">Annuler</Link>
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                                >
                                    {processing ? 'Enregistrement...' : (isEdit ? 'Mettre à jour' : 'Ajouter au catalogue')}
                                </button>
                            </div>
                        </form>

                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
