import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Package, TrendingUp, AlertTriangle, Box, CheckCircle } from 'lucide-react';

export default function Dashboard({ stats, ventesGraphique, topProduits, dernieresCommandes }) {
    const { auth } = usePage().props;
    const formatNumber = (num) => Number(num).toLocaleString('fr-FR');
    const [updatingLocation, setUpdatingLocation] = useState(false);
    const [gpsError, setGpsError] = useState(null);

    const registerLocation = () => {
        if (!navigator.geolocation) {
            setGpsError("La géolocalisation n'est pas supportée par votre navigateur.");
            return;
        }
        setUpdatingLocation(true);
        setGpsError(null);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                router.post(route('partenaire.location.update'), {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }, {
                    preserveScroll: true,
                    onFinish: () => setUpdatingLocation(false),
                    onSuccess: () => setGpsError(null)
                });
            },
            (err) => {
                setUpdatingLocation(false);
                setGpsError("Impossible de récupérer votre position GPS. Veuillez autoriser l'accès à la localisation.");
                console.error(err);
            }
        );
    };

    const statCards = [
        { label: "Chiffre d'affaires", value: `${formatNumber(stats.ca_genere)} FCFA`, icon: <TrendingUp size={24} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: "Ventes Réalisées", value: stats.total_ventes, icon: <CheckCircle size={24} />, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: "Produits Actifs", value: stats.produits_actifs, icon: <Package size={24} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: "Ruptures de stock", value: stats.ruptures_stock, icon: <AlertTriangle size={24} />, color: 'text-red-600', bg: 'bg-red-50' },
    ];

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tableau de bord Boutique</h2>}>
            <Head title="Partenaire Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
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
                                {gpsError && (
                                    <p className="text-sm text-red-500 mt-2 font-medium">❌ {gpsError}</p>
                                )}
                            </div>
                            <button
                                disabled={updatingLocation}
                                onClick={registerLocation}
                                className={`w-full sm:w-auto font-bold py-2.5 px-5 rounded-xl shadow transition flex items-center justify-center gap-2 ${
                                    auth.user.latitude && auth.user.longitude
                                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                        : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
                                }`}
                            >
                                {updatingLocation ? 'Enregistrement...' : 'Enregistrer ma position GPS actuelle'}
                            </button>
                        </div>
                    </div>
                    
                    {/* Statistiques clés */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {statCards.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center"
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-3 ${stat.bg} ${stat.color}`}>
                                    {stat.icon}
                                </div>
                                <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                                <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Graphique Ventes */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                                <TrendingUp className="text-emerald-600" /> Mes Ventes (7 derniers jours)
                            </h2>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={ventesGraphique} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorCaPartenaire" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value.toLocaleString('fr-FR')}`} />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <RechartsTooltip 
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value) => [`${Number(value).toLocaleString('fr-FR')} FCFA`, "Ventes"]}
                                        />
                                        <Area type="monotone" dataKey="ca" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorCaPartenaire)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Top Produits */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                                <Box className="text-indigo-600" /> Top Produits Vendus
                            </h2>
                            {topProduits.length === 0 ? (
                                <div className="text-center text-slate-500 py-10">Aucune donnée disponible.</div>
                            ) : (
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={topProduits} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                            <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis dataKey="nom" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={100} />
                                            <RechartsTooltip 
                                                cursor={{fill: '#f8fafc'}}
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Bar dataKey="quantite" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={20} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Dernières Commandes */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                <Package className="text-slate-600" /> Dernières Commandes
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            {dernieresCommandes.length === 0 ? (
                                <div className="p-6 text-center text-slate-500">Aucune commande pour le moment.</div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white border-b border-slate-200 text-sm font-medium text-slate-500">
                                            <th className="p-4">ID</th>
                                            <th className="p-4">Date</th>
                                            <th className="p-4">Client</th>
                                            <th className="p-4">Montant</th>
                                            <th className="p-4">Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {Object.values(dernieresCommandes).map(cmd => (
                                            <tr key={cmd.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-4 font-medium text-slate-900">#{cmd.id}</td>
                                                <td className="p-4 text-slate-600">{cmd.date}</td>
                                                <td className="p-4 text-slate-900">{cmd.client}</td>
                                                <td className="p-4 font-bold text-slate-900">{Number(cmd.montant).toLocaleString('fr-FR')} FCFA</td>
                                                <td className="p-4">
                                                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                                        cmd.statut === 'livree' ? 'bg-emerald-100 text-emerald-800' :
                                                        cmd.statut === 'annulee' ? 'bg-red-100 text-red-800' :
                                                        cmd.statut === 'en_livraison' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-amber-100 text-amber-800'
                                                    }`}>
                                                        {cmd.statut.replace('_', ' ')}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
