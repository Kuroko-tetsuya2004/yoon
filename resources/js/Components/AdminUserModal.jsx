import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Phone, Mail, Calendar, Bike, Package, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function AdminUserModal({ user, isOpen, onClose }) {
    if (!user) return null;

    const isLivreur = user.role === 'livreur';
    const isPartenaire = user.role === 'partenaire';

    const getStatusBadge = (status) => {
        switch(status) {
            case 'valide': return <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1"><CheckCircle size={16}/> Validé</span>;
            case 'rejete': return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1"><XCircle size={16}/> Rejeté</span>;
            case 'suspendu': return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1"><XCircle size={16}/> Suspendu</span>;
            default: return <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1"><Clock size={16}/> En attente</span>;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-xl z-50 overflow-hidden max-h-[90vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                            <h3 className="text-xl font-bold text-slate-800 capitalize">
                                Détails {user.role}
                            </h3>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition p-1 rounded-full hover:bg-slate-200">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 overflow-y-auto">
                            <div className="flex flex-col sm:flex-row gap-6 mb-8">
                                {/* Photo */}
                                <div className="shrink-0">
                                    {(user.photo_devanture || user.photo_moyen_transport) ? (
                                        <img 
                                            src={`/storage/${user.photo_devanture || user.photo_moyen_transport}`} 
                                            alt="Photo" 
                                            className="w-32 h-32 rounded-xl object-cover border-4 border-white shadow-md bg-slate-100"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 rounded-xl bg-slate-100 border-4 border-white shadow-md flex items-center justify-center text-slate-300">
                                            {isLivreur ? <Bike size={48} /> : <Package size={48} />}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Info Principales */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
                                            <p className="text-slate-500 flex items-center gap-2 mt-1">
                                                <Calendar size={16} /> Inscrit le {new Date(user.created_at).toLocaleDateString('fr-FR')}
                                            </p>
                                        </div>
                                        <div>
                                            {getStatusBadge(user.statut_validation)}
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 mt-4">
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <Phone size={18} className="text-slate-400" />
                                            <span>{user.telephone || 'Non renseigné'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-700">
                                            <Mail size={18} className="text-slate-400" />
                                            <span>{user.email}</span>
                                        </div>
                                        {user.adresse && (
                                            <div className="flex items-center gap-2 text-slate-700 sm:col-span-2">
                                                <MapPin size={18} className="text-slate-400 shrink-0" />
                                                <span className="truncate">{user.adresse}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Section Spécifique au Rôle */}
                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                                    <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                        {isLivreur ? <><Bike size={18} className="text-blue-500" /> Véhicule & Transport</> : <><Package size={18} className="text-orange-500" /> Boutique & Services</>}
                                    </h4>
                                    
                                    {isLivreur && (
                                        <div className="space-y-4 text-sm">
                                            <div>
                                                <p className="text-slate-500 mb-1">Moyen de transport</p>
                                                <p className="font-medium text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-lg">
                                                    {user.moyen_transport ? `${user.moyen_transport === 'Moto' ? '🏍️' : user.moyen_transport === 'Vélo' ? '🚲' : user.moyen_transport === 'camionnette' ? '🚚' : '🚗'} ${user.moyen_transport}` : 'Non renseigné'}
                                                </p>
                                            </div>
                                            {user.immatriculation && (
                                                <div>
                                                    <p className="text-slate-500 mb-1">Immatriculation</p>
                                                    <p className="font-mono font-bold text-slate-700 bg-slate-200 border border-slate-300 px-3 py-2 rounded-lg inline-block tracking-wider">
                                                        {user.immatriculation}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {isPartenaire && (
                                        <div className="space-y-4 text-sm">
                                            <div>
                                                <p className="text-slate-500 mb-1">Description Boutique</p>
                                                <p className="font-medium text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-lg whitespace-pre-wrap">
                                                    {user.description_boutique || 'Aucune description fournie.'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 mb-1">Service de Livraison</p>
                                                {user.propre_service_livraison ? (
                                                    <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 font-medium px-3 py-1.5 rounded-lg border border-indigo-100">
                                                        🚚 Possède son propre service
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200">
                                                        Utilise les livreurs Yoon
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Section Statistiques / Activité */}
                                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                                    <h4 className="font-semibold text-slate-800 mb-4">Statistiques d'Activité</h4>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        {isPartenaire && (
                                            <div className="bg-white border border-slate-200 p-4 rounded-xl text-center">
                                                <div className="text-3xl font-black text-orange-500 mb-1">{user.produits_count ?? 0}</div>
                                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Produits</div>
                                            </div>
                                        )}
                                        {isLivreur && (
                                            <div className="bg-white border border-slate-200 p-4 rounded-xl text-center">
                                                <div className="text-3xl font-black text-blue-500 mb-1">{user.livraisons_count ?? 0}</div>
                                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Courses</div>
                                            </div>
                                        )}
                                        <div className="bg-white border border-slate-200 p-4 rounded-xl text-center">
                                            <div className="text-sm font-bold text-slate-700 mb-1 truncate">{user.latitude && user.longitude ? 'Localisé' : 'Non localisé'}</div>
                                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">GPS</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
