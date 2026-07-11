import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, Users, Store, Bike, AlertTriangle, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default function Dashboard({ stats, ventesGraphique, dernieresCommandes, comptesEnAttente, partenaires, livreurs }) {
    const formatNumber = (num) => Number(num).toLocaleString('fr-FR');

    const statCards = [
        { label: "Chiffre d'affaires", value: `${formatNumber(stats.ca_genere)} FCFA`, icon: <TrendingUp size={24} />, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: "Total Commandes", value: stats.total_commandes, icon: <Package size={24} />, color: 'text-slate-700', bg: 'bg-slate-100' },
        { label: "Clients Actifs", value: stats.utilisateurs_actifs, icon: <Users size={24} />, color: 'text-slate-700', bg: 'bg-slate-100' },
        { label: "Partenaires Validés", value: stats.partenaires_actifs, icon: <Store size={24} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: "Partenaires En Attente", value: stats.partenaires_en_attente, icon: <Clock size={24} />, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: "Litiges Ouverts", value: stats.litiges_ouverts, icon: <AlertTriangle size={24} />, color: 'text-red-600', bg: 'bg-red-50' },
        { label: "Livreurs Validés", value: stats.livreurs_actifs, icon: <Bike size={24} />, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: "Livreurs En Attente", value: stats.livreurs_en_attente, icon: <Clock size={24} />, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    return (
        <AuthenticatedLayout header="Tableau de bord Administrateur">
            <Head title="Admin Dashboard" />

            <div className="page-header mb-8">
                <h1 className="page-title">Vue d'ensemble</h1>
                <p className="page-subtitle">Statistiques clés et gestion des utilisateurs.</p>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="stat-card bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center"
                    >
                        <div className={`stat-card-icon w-12 h-12 rounded-full flex items-center justify-center text-xl mb-3 ${stat.bg} ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div className="stat-card-value text-2xl font-bold text-slate-800">{stat.value}</div>
                        <div className="stat-card-label text-sm text-slate-500 font-medium">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Graphique d'Évolution du CA */}
            <div className="mb-12 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                    <TrendingUp className="text-indigo-600" /> Évolution du Chiffre d'Affaires (7 derniers jours)
                </h2>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={ventesGraphique} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorCa" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value.toLocaleString('fr-FR')}`} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value) => [`${Number(value).toLocaleString('fr-FR')} FCFA`, "Chiffre d'affaires"]}
                            />
                            <Area type="monotone" dataKey="ca" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorCa)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Dernières Commandes */}
            <div className="mb-12 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <Package className="text-slate-600" /> Dernières Commandes (Top 5)
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-slate-200 text-sm font-medium text-slate-500">
                                <th className="p-4">ID</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Client</th>
                                <th className="p-4">Boutique</th>
                                <th className="p-4">Livreur</th>
                                <th className="p-4">Montant</th>
                                <th className="p-4">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {dernieresCommandes.map(cmd => (
                                <tr key={cmd.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-medium text-slate-900">#{cmd.id}</td>
                                    <td className="p-4 text-slate-600">{cmd.date}</td>
                                    <td className="p-4 text-slate-900">{cmd.client}</td>
                                    <td className="p-4 text-emerald-700 font-medium">{cmd.partenaire} <span className="text-xs text-slate-400 font-normal">({cmd.type})</span></td>
                                    <td className="p-4 text-blue-700">{cmd.livreur}</td>
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
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                
                {/* Colonne Gauche */}
                <div className="space-y-8">
                    {/* Comptes en Attente */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 bg-amber-50">
                            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                <span>⏳</span> Comptes en attente de validation ({comptesEnAttente.length})
                            </h2>
                        </div>
                        <div className="p-0">
                            {comptesEnAttente.length === 0 ? (
                                <div className="p-6 text-center text-slate-500">Aucun compte en attente.</div>
                            ) : (
                                <ul className="divide-y divide-slate-200">
                                    {comptesEnAttente.map((compte) => (
                                        <li key={compte.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 gap-4">
                                            <div className="flex gap-4">
                                                {(compte.photo_devanture || compte.photo_moyen_transport) && (
                                                    <img 
                                                        src={compte.photo_devanture ? `/storage/${compte.photo_devanture}` : `/storage/${compte.photo_moyen_transport}`} 
                                                        alt="Photo" 
                                                        className="w-16 h-16 rounded object-cover border"
                                                    />
                                                )}
                                                <div>
                                                    <div className="font-medium text-slate-800">{compte.name}</div>
                                                    <div className="text-sm text-slate-500">{compte.email} &bull; <span className="capitalize text-amber-600 font-medium">{compte.role}</span></div>
                                                    {(compte.adresse || compte.latitude) && (
                                                        <div className="text-xs text-slate-500 mt-1">
                                                            📍 {compte.adresse || `${compte.latitude}, ${compte.longitude}`}
                                                        </div>
                                                    )}
                                                    {compte.role === 'livreur' && compte.moyen_transport && (
                                                        <div className="text-xs text-blue-600 mt-1 font-medium">
                                                            {compte.moyen_transport === 'Moto' ? '🏍️' : compte.moyen_transport === 'Vélo' ? '🚲' : compte.moyen_transport === 'camionnette' ? '🚚' : '🚗'} {compte.moyen_transport} 
                                                            {compte.immatriculation && <span className="ml-2 font-mono bg-slate-100 px-1 rounded text-slate-700 border border-slate-200">{compte.immatriculation}</span>}
                                                        </div>
                                                    )}
                                                    {compte.role === 'partenaire' && compte.description_boutique && (
                                                        <div className="text-xs text-slate-600 mt-1 truncate max-w-xs">
                                                            🏪 {compte.description_boutique}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <Link
                                                    href={route(`admin.${compte.role}s.valider`, compte.id)}
                                                    method="patch"
                                                    as="button"
                                                    preserveScroll
                                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    Valider
                                                </Link>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* Colonne Droite */}
                <div className="space-y-8">
                    {/* Partenaires Actifs */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 bg-blue-50">
                            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                <span>🏪</span> Gestion des Partenaires ({partenaires.length})
                            </h2>
                        </div>
                        <div className="p-0 max-h-96 overflow-y-auto">
                            {partenaires.length === 0 ? (
                                <div className="p-6 text-center text-slate-500">Aucun partenaire.</div>
                            ) : (
                                <ul className="divide-y divide-slate-200">
                                    {partenaires.map((p) => (
                                        <li key={p.id} className="p-4 flex items-start justify-between hover:bg-slate-50 gap-4">
                                            <div className="flex gap-4">
                                                {p.photo_devanture ? (
                                                    <img src={`/storage/${p.photo_devanture}`} alt="Devanture" className="w-12 h-12 rounded object-cover border" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center text-slate-400 border">🏪</div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-slate-800">{p.name}</div>
                                                    <div className="text-sm text-slate-500">{p.email} &bull; {p.telephone} &bull; <span className={`font-medium ${p.statut_validation === 'valide' ? 'text-emerald-600' : 'text-red-600'}`}>{p.statut_validation}</span></div>
                                                    {p.adresse && <div className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">📍 {p.adresse}</div>}
                                                    <div className="text-xs text-slate-600 mt-1 flex gap-2">
                                                        <span className="bg-slate-100 px-1.5 py-0.5 rounded">📦 {p.produits_count} produit(s)</span>
                                                        {p.propre_service_livraison && <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">🚚 Propre livraison</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <Link
                                                    href={route('admin.partenaires.suspendre', p.id)}
                                                    method="patch"
                                                    as="button"
                                                    preserveScroll
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${p.statut_validation === 'valide' ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                                                >
                                                    {p.statut_validation === 'valide' ? 'Suspendre' : 'Réactiver'}
                                                </Link>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Livreurs Actifs */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 bg-indigo-50">
                            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                <span>🛵</span> Gestion des Livreurs ({livreurs.length})
                            </h2>
                        </div>
                        <div className="p-0 max-h-96 overflow-y-auto">
                            {livreurs.length === 0 ? (
                                <div className="p-6 text-center text-slate-500">Aucun livreur.</div>
                            ) : (
                                <ul className="divide-y divide-slate-200">
                                    {livreurs.map((l) => (
                                        <li key={l.id} className="p-4 flex items-start justify-between hover:bg-slate-50 gap-4">
                                            <div className="flex gap-4">
                                                {l.photo_moyen_transport ? (
                                                    <img src={`/storage/${l.photo_moyen_transport}`} alt="Transport" className="w-12 h-12 rounded object-cover border" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center text-slate-400 border">🛵</div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-slate-800">{l.name}</div>
                                                    <div className="text-sm text-slate-500">{l.email} &bull; {l.telephone} &bull; <span className={`font-medium ${l.statut_validation === 'valide' ? 'text-emerald-600' : 'text-red-600'}`}>{l.statut_validation}</span></div>
                                                    {l.moyen_transport && (
                                                        <div className="text-xs text-slate-500 mt-0.5 flex gap-2 items-center">
                                                            <span>{l.moyen_transport === 'Moto' ? '🏍️' : l.moyen_transport === 'Vélo' ? '🚲' : l.moyen_transport === 'camionnette' ? '🚚' : '🚗'} {l.moyen_transport}</span>
                                                            {l.immatriculation && <span className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{l.immatriculation}</span>}
                                                            <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium">📦 {l.livraisons_count} course(s)</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <Link
                                                    href={route('admin.livreurs.suspendre', l.id)}
                                                    method="patch"
                                                    as="button"
                                                    preserveScroll
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${l.statut_validation === 'valide' ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                                                >
                                                    {l.statut_validation === 'valide' ? 'Suspendre' : 'Réactiver'}
                                                </Link>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
