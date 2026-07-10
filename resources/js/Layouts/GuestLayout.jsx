import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <Link href="/">
                    {/* Logo placeholder */}
                    <div className="w-20 h-20 bg-blue-600 text-white flex items-center justify-center rounded-full text-2xl font-bold shadow-lg">
                        Yoon
                    </div>
                </Link>
            </motion.div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                className="w-full sm:max-w-md mt-6 px-6 py-8 bg-white shadow-xl overflow-hidden sm:rounded-2xl"
            >
                {children}
            </motion.div>
        </div>
    );
}
