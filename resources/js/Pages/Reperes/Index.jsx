import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Index({ auth, reperes, flash }) {
    const { patch, delete: destroy } = useForm();
    const hasMultiple = reperes.length > 1;
    const hasDefault = reperes.some(r => r.is_default);

    const setDefault = (id) => {
        patch(route('reperes.default', id));
    };

    const deleteRepere = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce repère ?')) {
            destroy(route('reperes.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mes Repères (Adresses de livraison)</h2>}>
            <Head title="Mes Repères" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 sm:mb-0">Gérez vos points de livraison</h3>
                        <Link href={route('reperes.create')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow transition duration-150 ease-in-out">
                            + Ajouter un repère
                        </Link>
                    </div>

                    

                    {hasMultiple && !hasDefault && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded-r-lg shadow-sm" role="alert">
                            <div className="flex items-center">
                                <span className="mr-2 text-yellow-600 text-xl">⚠️</span>
                                <p className="font-bold">Attention</p>
                            </div>
                            <p className="mt-1 ml-8 text-sm">Vous avez enregistré plusieurs adresses. Veuillez définir l'une d'entre elles comme adresse principale (par défaut) pour vos futures commandes.</p>
                        </div>
                    )}

                    {reperes.length === 0 ? (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 text-center text-gray-500">
                            Vous n'avez pas encore enregistré de repère géolocalisé. Ajoutez votre premier repère pour faciliter vos prochaines livraisons.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {reperes.map((repere, idx) => (
                                <motion.div 
                                    key={repere.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition duration-150"
                                >
                                    {repere.photo ? (
                                        <img src={repere.photo} alt="Photo du repère" className="w-full h-48 object-cover" />
                                    ) : (
                                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                            <span className="text-4xl text-gray-400">🏠</span>
                                        </div>
                                    )}
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-xl font-bold text-gray-900">{repere.nom}</h4>
                                            {repere.is_default && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 shadow-sm">
                                                    Par défaut
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{repere.adresse}</p>
                                        <p className="text-gray-500 text-xs italic mb-4 line-clamp-2">{repere.description}</p>
                                        
                                        <div className="flex items-center justify-between mt-auto">
                                            {!repere.is_default && (
                                                <button onClick={() => setDefault(repere.id)} className="text-sm text-indigo-600 hover:text-indigo-900 font-medium">
                                                    Définir par défaut
                                                </button>
                                            )}
                                            
                                            <button onClick={() => deleteRepere(repere.id)} className="text-sm text-red-600 hover:text-red-900 font-medium ml-auto">
                                                Supprimer
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
