import { useEffect, useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        telephone: '',
        email: '',
        role: 'client',
        password: '',
        password_confirmation: '',
        moyen_transport: '',
        immatriculation: '',
        description_boutique: '',
        adresse: '',
        propre_service_livraison: false,
        photo_devanture: null,
        photo_moyen_transport: null,
        latitude: '',
        longitude: '',
    });

    const [isLocating, setIsLocating] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [passwordMatchError, setPasswordMatchError] = useState(false);

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    // Check if passwords match in real-time
    useEffect(() => {
        if (data.password_confirmation && data.password) {
            setPasswordMatchError(data.password !== data.password_confirmation);
        } else {
            setPasswordMatchError(false);
        }
    }, [data.password, data.password_confirmation]);

    const getLocation = () => {
        if (!navigator.geolocation) {
            alert("La géolocalisation n'est pas supportée par votre navigateur.");
            return;
        }
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                setData(data => ({ ...data, latitude: lat, longitude: lon }));

                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                    const result = await response.json();
                    if (result && result.display_name) {
                        setData(data => ({ ...data, adresse: result.display_name, latitude: lat, longitude: lon }));
                    }
                } catch (error) {
                    console.error("Erreur lors du reverse geocoding:", error);
                    alert("Position trouvée, mais impossible de récupérer l'adresse exacte.");
                }
                setIsLocating(false);
            },
            (error) => {
                setIsLocating(false);
                alert("Impossible de récupérer votre position. Veuillez vérifier vos autorisations.");
            }
        );
    };

    const submit = (e) => {
        e.preventDefault();
        if (data.password !== data.password_confirmation) {
            setPasswordMatchError(true);
            return;
        }
        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Inscription" />

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block font-medium text-sm text-gray-700">Nom complet ou Nom de l'entreprise</label>
                    <input
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    {errors.name && <div className="text-red-600 mt-2 text-sm">{errors.name}</div>}
                </div>

                <div>
                    <label htmlFor="telephone" className="block font-medium text-sm text-gray-700">Téléphone (Ex: 771234567)</label>
                    <input
                        id="telephone"
                        name="telephone"
                        type="tel"
                        pattern="[0-9]{9}"
                        maxLength={9}
                        title="Entrez exactement 9 chiffres"
                        placeholder="7X XXX XX XX"
                        value={data.telephone}
                        className="mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                        onChange={(e) => setData('telephone', e.target.value.replace(/\D/g, '').slice(0, 9))}
                        required
                    />
                    {/* Le backend vérifie déjà l'unicité et renvoie l'erreur ici */}
                    {errors.telephone && <div className="text-red-600 mt-2 text-sm">{errors.telephone}</div>}
                </div>

                <div>
                    <label htmlFor="email" className="block font-medium text-sm text-gray-700">Email (Optionnel)</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    {errors.email && <div className="text-red-600 mt-2 text-sm">{errors.email}</div>}
                </div>

                <div>
                    <label htmlFor="role" className="block font-medium text-sm text-gray-700">Je suis un...</label>
                    <select
                        id="role"
                        name="role"
                        value={data.role}
                        className="mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                        onChange={(e) => setData('role', e.target.value)}
                    >
                        <option value="client">Client</option>
                        <option value="livreur">Livreur</option>
                        <option value="partenaire">Partenaire (Boutique)</option>
                    </select>
                    {errors.role && <div className="text-red-600 mt-2 text-sm">{errors.role}</div>}
                </div>

                {data.role === 'livreur' && (
                    <div className="mt-4 p-4 border rounded-md bg-gray-50 space-y-4">
                        <h3 className="font-semibold text-gray-700">Informations Livreur</h3>
                        <div>
                            <label htmlFor="moyen_transport" className="block font-medium text-sm text-gray-700">Moyen de transport</label>
                            <select
                                id="moyen_transport"
                                name="moyen_transport"
                                value={data.moyen_transport}
                                className="mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                onChange={(e) => setData('moyen_transport', e.target.value)}
                                required
                            >
                                <option value="">Sélectionnez un moyen de transport</option>
                                <option value="camionnette">Camionnette</option>
                                <option value="tricycles">Tricycles</option>
                                <option value="voiture de transport de bagages">Voiture de transport de bagages</option>
                            </select>
                            {errors.moyen_transport && <div className="text-red-600 mt-2 text-sm">{errors.moyen_transport}</div>}
                        </div>
                        <div>
                            <label htmlFor="immatriculation" className="block font-medium text-sm text-gray-700">Numéro d'immatriculation</label>
                            <input
                                id="immatriculation"
                                type="text"
                                name="immatriculation"
                                value={data.immatriculation}
                                className="mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                onChange={(e) => setData('immatriculation', e.target.value.toUpperCase())}
                                placeholder="Ex: DK-1234-AB"
                                required
                            />
                            {errors.immatriculation && <div className="text-red-600 mt-2 text-sm">{errors.immatriculation}</div>}
                        </div>
                        <div>
                            <label htmlFor="photo_moyen_transport" className="block font-medium text-sm text-gray-700">Photo du moyen de transport</label>
                            <input
                                id="photo_moyen_transport"
                                type="file"
                                name="photo_moyen_transport"
                                accept="image/*"
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                onChange={(e) => setData('photo_moyen_transport', e.target.files[0])}
                                required
                            />
                            {errors.photo_moyen_transport && <div className="text-red-600 mt-2 text-sm">{errors.photo_moyen_transport}</div>}
                        </div>
                    </div>
                )}

                {data.role === 'partenaire' && (
                    <div className="mt-4 p-4 border rounded-md bg-gray-50 space-y-4">
                        <h3 className="font-semibold text-gray-700">Informations Boutique / Partenaire</h3>
                        <div>
                            <label htmlFor="description_boutique" className="block font-medium text-sm text-gray-700">Description de la boutique</label>
                            <textarea
                                id="description_boutique"
                                name="description_boutique"
                                value={data.description_boutique}
                                className="mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                                onChange={(e) => setData('description_boutique', e.target.value)}
                            ></textarea>
                            {errors.description_boutique && <div className="text-red-600 mt-2 text-sm">{errors.description_boutique}</div>}
                        </div>
                        <div>
                            <label htmlFor="adresse" className="block font-medium text-sm text-gray-700">Adresse complète de la boutique</label>
                            <div className="flex mt-1">
                                <input
                                    id="adresse"
                                    type="text"
                                    name="adresse"
                                    value={data.adresse}
                                    className="block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-l-md shadow-sm"
                                    onChange={(e) => setData('adresse', e.target.value)}
                                    placeholder="Entrez votre adresse ou utilisez la géolocalisation"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={getLocation}
                                    disabled={isLocating}
                                    className="px-4 py-2 bg-blue-100 text-blue-700 border border-blue-200 rounded-r-md hover:bg-blue-200 transition whitespace-nowrap disabled:opacity-50"
                                >
                                    {isLocating ? 'Recherche...' : '📍 Me localiser'}
                                </button>
                            </div>
                            {errors.adresse && <div className="text-red-600 mt-2 text-sm">{errors.adresse}</div>}
                        </div>
                        <div>
                            <label htmlFor="photo_devanture" className="block font-medium text-sm text-gray-700">Photo de la devanture</label>
                            <input
                                id="photo_devanture"
                                type="file"
                                name="photo_devanture"
                                accept="image/*"
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                onChange={(e) => setData('photo_devanture', e.target.files[0])}
                                required
                            />
                            {errors.photo_devanture && <div className="text-red-600 mt-2 text-sm">{errors.photo_devanture}</div>}
                        </div>
                        <div className="flex items-center">
                            <input
                                id="propre_service_livraison"
                                type="checkbox"
                                name="propre_service_livraison"
                                checked={data.propre_service_livraison}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                onChange={(e) => setData('propre_service_livraison', e.target.checked)}
                            />
                            <label htmlFor="propre_service_livraison" className="ml-2 text-sm font-medium text-gray-900">
                                Je possède mon propre service de livraison
                            </label>
                        </div>
                    </div>
                )}

                <div className="mt-4">
                    <label htmlFor="password" className="block font-medium text-sm text-gray-700">Mot de passe</label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={data.password}
                            className={`mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm pr-10 ${passwordMatchError ? 'border-red-500 focus:ring-red-500' : ''}`}
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-1"
                        >
                            {showPassword ? (
                                <span title="Masquer le mot de passe">👁️‍🗨️</span>
                            ) : (
                                <span title="Afficher le mot de passe">👁️</span>
                            )}
                        </button>
                    </div>
                    {errors.password && <div className="text-red-600 mt-2 text-sm">{errors.password}</div>}
                </div>

                <div className="mt-4">
                    <label htmlFor="password_confirmation" className="block font-medium text-sm text-gray-700">Confirmer le mot de passe</label>
                    <div className="relative">
                        <input
                            id="password_confirmation"
                            type={showPassword ? "text" : "password"}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className={`mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm pr-10 ${passwordMatchError ? 'border-red-500 focus:ring-red-500' : ''}`}
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                    </div>
                    {passwordMatchError && (
                        <div className="text-red-600 mt-2 text-sm font-medium">Les mots de passe ne correspondent pas.</div>
                    )}
                    {errors.password_confirmation && <div className="text-red-600 mt-2 text-sm">{errors.password_confirmation}</div>}
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link
                        href={route('login')}
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Déjà inscrit ?
                    </Link>

                    <button 
                        className={`ms-4 inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest transition ease-in-out duration-150 ${(processing || passwordMatchError) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'}`}
                        disabled={processing || passwordMatchError}
                    >
                        S'inscrire
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
