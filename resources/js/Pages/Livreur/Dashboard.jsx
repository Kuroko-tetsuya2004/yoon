import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Package, Wallet, CheckCircle, Navigation } from 'lucide-react';

export default function Dashboard({ auth, stats, coursesGraphique: coursesRaw, historique: historiqueRaw, proposition, flash }) {
    const coursesGraphique = Array.isArray(coursesRaw) ? coursesRaw : Object.values(coursesRaw || {});
    const historique = Array.isArray(historiqueRaw) ? historiqueRaw : Object.values(historiqueRaw || {});

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Tableau de bord Livreur</h2>}>
            <Head title="Tableau de bord" />

            <div className="pb-12 pt-2 sm:pt-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Alertes flash */}
                    {flash?.success && (
                        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                            {flash.error}
                        </div>
                    )}

                    {/* Alerte Nouvelle Proposition */}
                    {proposition && (
                        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl flex justify-between items-center shadow-sm">
                            <span className="flex items-center gap-2 font-medium">
                                🚀 Une nouvelle proposition de course est en attente !
                            </span>
                            <Link href={route('livreur.courses')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-4 rounded-lg text-sm transition shadow-sm">
                                Gérer les courses
                            </Link>
                        </div>
                    )}

                    {/* Statistiques Livreur */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-800">{stats?.total_courses ?? 0}</div>
                                <div className="text-sm text-slate-500">Courses terminées</div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <Wallet size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-800">{Number(stats?.gains_estimes ?? 0).toLocaleString('fr-FR')} FCFA</div>
                                <div className="text-sm text-slate-500">Gains estimés</div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                                <Package size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-800">{stats?.en_cours ?? 0}</div>
                                <div className="text-sm text-slate-500">Courses en cours</div>
                            </div>
                        </div>
                    </div>

                    {/* Accès rapide à la carte / courses actives */}
                    {stats?.en_cours > 0 && (
                        <div className="bg-slate-900 text-white p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md">
                            <div>
                                <p className="font-bold text-lg">🏍️ Vous avez {stats.en_cours} course(s) en cours de livraison</p>
                                <p className="text-sm text-slate-400">Ouvrez le module courses pour visualiser l'itinéraire GPS et gérer vos livraisons.</p>
                            </div>
                            <Link href={route('livreur.courses')} className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20">
                                <Navigation size={18} /> Ouvrir la Carte
                            </Link>
                        </div>
                    )}

                    {/* Graphique des courses */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                            <TrendingUp className="text-blue-600" /> Mon Activité (7 derniers jours)
                        </h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={coursesGraphique} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorCourses" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <RechartsTooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value) => [`${value} course(s)`, 'Réalisées']}
                                    />
                                    <Area type="monotone" dataKey="courses" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorCourses)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Historique des courses */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                <CheckCircle className="text-emerald-600" /> Historique (5 dernières courses)
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            {historique.length === 0 ? (
                                <div className="p-6 text-center text-slate-500">Aucune course terminée pour le moment.</div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white border-b border-slate-200 text-sm font-medium text-slate-500">
                                            <th className="p-4">ID</th>
                                            <th className="p-4">Date</th>
                                            <th className="p-4">Client</th>
                                            <th className="p-4">Gains</th>
                                            <th className="p-4">Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {historique.map(course => (
                                            <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-4 font-medium text-slate-900">#{course.id}</td>
                                                <td className="p-4 text-slate-600">{course.date}</td>
                                                <td className="p-4 text-slate-900">{course.client}</td>
                                                <td className="p-4 font-bold text-slate-900">{Number(course.gains ?? 0).toLocaleString('fr-FR')} FCFA</td>
                                                <td className="p-4">
                                                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                                        course.statut === 'livree' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                                                    }`}>
                                                        {course.statut === 'livree' ? 'Livrée' : 'Retournée'}
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
