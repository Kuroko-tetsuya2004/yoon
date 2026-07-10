import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function FakePaymentModal({ isOpen, modePaiement, montant, onSuccess, onCancel }) {
    const [status, setStatus] = useState('idle'); // idle, processing, success

    useEffect(() => {
        if (isOpen) {
            setStatus('idle');
        }
    }, [isOpen]);

    const handlePay = () => {
        setStatus('processing');
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => {
                onSuccess();
            }, 1000);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4"
                >
                    <div className="text-center">
                        {status === 'idle' && (
                            <>
                                <div className="text-4xl mb-4">
                                    {modePaiement === 'wave' ? '🌊' : '🟠'}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Paiement Sécurisé</h3>
                                <p className="text-gray-500 mb-6">
                                    Vous êtes sur le point de payer <strong className="text-gray-900">{montant.toLocaleString('fr-FR')} FCFA</strong> via {modePaiement === 'wave' ? 'Wave' : 'Orange Money'}.
                                </p>
                                <div className="flex space-x-3">
                                    <button 
                                        onClick={onCancel}
                                        className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition"
                                    >
                                        Annuler
                                    </button>
                                    <button 
                                        onClick={handlePay}
                                        className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition"
                                    >
                                        Payer
                                    </button>
                                </div>
                            </>
                        )}

                        {status === 'processing' && (
                            <div className="py-8">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                                <p className="text-gray-600 font-medium animate-pulse">Traitement du paiement en cours...</p>
                            </div>
                        )}

                        {status === 'success' && (
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="py-8 text-green-500"
                            >
                                <svg className="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">Paiement Réussi !</h3>
                                <p className="text-gray-500 text-sm">Redirection en cours...</p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
