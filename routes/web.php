<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::get('/politique-confidentialite', function () {
    return inertia('PolitiqueConfidentialite');
})->name('politique-confidentialite');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        if (auth()->user()->role === 'livreur') {
            return redirect()->route('livreur.dashboard');
        }
        if (auth()->user()->role === 'administrateur') {
            return redirect()->route('admin.dashboard');
        }
        if (auth()->user()->role === 'partenaire') {
            return redirect()->route('partenaire.dashboard');
        }
        $hasReperes = \App\Models\Repere::where('client_id', auth()->id())->exists();
        $produits = \App\Models\Produit::with('partenaire:id,name,role,email,latitude,longitude,propre_service_livraison')
            ->where('est_disponible', true)
            ->select(['id', 'nom_produit', 'description', 'prix', 'photo', 'quantite_stock', 'categorie', 'partenaire_id', 'est_disponible'])
            ->get()
            ->groupBy('categorie');
        return inertia('Dashboard', ['produits' => $produits, 'hasReperes' => $hasReperes]);
    })->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/profile/rappel', [ProfileController::class, 'updateRappel'])->name('profile.rappel');
    
    Route::patch('/reperes/{repere}/default', [\App\Http\Controllers\RepereController::class, 'setDefault'])->name('reperes.default');
    Route::resource('reperes', \App\Http\Controllers\RepereController::class);

    // Routes pour l'Événementiel (Sprint 5)
    Route::resource('evenements', \App\Http\Controllers\EvenementController::class);
    Route::post('/evenements/{evenement}/prestation', [\App\Http\Controllers\EvenementController::class, 'addPrestation'])->name('evenements.add_prestation');
    Route::delete('/evenements/{evenement}/prestation/{prestation}', [\App\Http\Controllers\EvenementController::class, 'removePrestation'])->name('evenements.remove_prestation');
    Route::post('/evenements/{evenement}/checkout', [\App\Http\Controllers\EvenementController::class, 'checkout'])->name('evenements.checkout');

    Route::get('/commandes', [\App\Http\Controllers\CommandeController::class, 'index'])->name('commandes.index');
    Route::get('/commandes/gaz/create', [\App\Http\Controllers\CommandeController::class, 'createGaz'])->name('commandes.gaz.create');
    Route::post('/commandes/gaz', [\App\Http\Controllers\CommandeController::class, 'storeGaz'])->name('commandes.gaz.store');
    Route::get('/commandes/pondereux/create', [\App\Http\Controllers\CommandeController::class, 'createPondereux'])->name('commandes.pondereux.create');
    Route::post('/commandes/pondereux', [\App\Http\Controllers\CommandeController::class, 'storePondereux'])->name('commandes.pondereux.store');
    Route::get('/commandes/materiel/create', [\App\Http\Controllers\CommandeController::class, 'createMateriel'])->name('commandes.materiel.create');
    Route::post('/commandes/materiel', [\App\Http\Controllers\CommandeController::class, 'storeMateriel'])->name('commandes.materiel.store');
    Route::get('/commandes/{commande}', [\App\Http\Controllers\CommandeController::class, 'show'])->where('commande', '[0-9]+')->name('commandes.show');
    Route::get('/commandes/{commande}/livraison', [\App\Http\Controllers\CommandeController::class, 'suiviLivraison'])->where('commande', '[0-9]+')->name('commandes.suivi_livraison');
    Route::get('/commandes/{commande}/livreur-location', [\App\Http\Controllers\CommandeController::class, 'getLivreurLocation'])->where('commande', '[0-9]+')->name('commandes.livreur_location');
    Route::post('/commandes/{commande}/confirmer-reception', [\App\Http\Controllers\CommandeController::class, 'confirmerReception'])->where('commande', '[0-9]+')->name('commandes.confirmer_reception');

    // Routes Partenaires
    Route::middleware(['role:partenaire'])->prefix('partenaire')->name('partenaire.')->group(function () {
        Route::redirect('/', '/partenaire/dashboard');
        Route::get('/dashboard', [\App\Http\Controllers\Partenaire\DashboardController::class, 'index'])->name('dashboard');
        Route::get('/commandes', [\App\Http\Controllers\Partenaire\CommandeController::class, 'index'])->name('commandes.index');
        Route::patch('/commandes/{commande}/valider', [\App\Http\Controllers\Partenaire\CommandeController::class, 'valider'])->where('commande', '[0-9]+')->name('commandes.valider');
        Route::patch('/commandes/{commande}/refuser', [\App\Http\Controllers\Partenaire\CommandeController::class, 'refuser'])->where('commande', '[0-9]+')->name('commandes.refuser');
        Route::post('/commandes/{commande}/confirmer-retour', [\App\Http\Controllers\Partenaire\CommandeController::class, 'confirmerRetour'])->where('commande', '[0-9]+')->name('commandes.confirmer_retour');
        Route::patch('/commandes/{commande}/confirmer-recuperation', [\App\Http\Controllers\Partenaire\CommandeController::class, 'confirmerRecuperation'])->name('commandes.confirmer_recuperation');
        Route::get('/commandes/{commande}/livraison', [\App\Http\Controllers\Partenaire\CommandeController::class, 'suiviLivraison'])->where('commande', '[0-9]+')->name('commandes.suivi_livraison');
        Route::get('/commandes/{commande}/livreur-location', [\App\Http\Controllers\Partenaire\CommandeController::class, 'getLivreurLocation'])->where('commande', '[0-9]+')->name('commandes.livreur_location');
        
        // Routes de livraison par le partenaire
        Route::patch('/commandes/{commande}/livraison/statut', [\App\Http\Controllers\Partenaire\CommandeController::class, 'updateLivraisonStatut'])->name('commandes.livraison.update');
        Route::post('/location/update', [\App\Http\Controllers\Partenaire\CommandeController::class, 'updateLocation'])->name('location.update');
        Route::resource('produits', \App\Http\Controllers\Partenaire\ProduitController::class);
        Route::post('produits/{produit}/restock', [\App\Http\Controllers\Partenaire\ProduitController::class, 'restock'])->name('produits.restock');
        Route::patch('produits/{produit}/toggle-status', [\App\Http\Controllers\Partenaire\ProduitController::class, 'toggleDisponibilite'])->name('produits.toggle-status');
    });

    // Routes Livreur
    Route::middleware(['role:livreur'])->prefix('livreur')->name('livreur.')->group(function () {
        Route::redirect('/', '/livreur/dashboard');
        Route::get('/dashboard', [\App\Http\Controllers\Livreur\DashboardController::class, 'index'])->name('dashboard');
        Route::patch('/propositions/{proposition}/accepter', [\App\Http\Controllers\Livreur\DashboardController::class, 'accepterProposition'])->name('propositions.accepter');
        Route::patch('/propositions/{proposition}/refuser', [\App\Http\Controllers\Livreur\DashboardController::class, 'refuserProposition'])->name('propositions.refuser');
        Route::patch('/livraisons/{livraison}', [\App\Http\Controllers\Livreur\DashboardController::class, 'updateStatut'])->name('livraisons.update');
        Route::post('/location/update', [\App\Http\Controllers\Livreur\DashboardController::class, 'updateLocation'])->name('location.update');
    });
    // Admin Routes
    Route::middleware(['role:administrateur'])->prefix('admin')->name('admin.')->group(function () {
        Route::redirect('/', '/admin/dashboard');
        Route::get('/dashboard', [\App\Http\Controllers\AdminController::class, 'dashboard'])->name('dashboard');
        Route::get('/partenaires', [\App\Http\Controllers\AdminController::class, 'partenaires'])->name('partenaires');
        Route::patch('/partenaires/{user}/valider', [\App\Http\Controllers\AdminController::class, 'validerPartenaire'])->name('partenaires.valider');
        Route::patch('/partenaires/{user}/suspendre', [\App\Http\Controllers\AdminController::class, 'suspendrePartenaire'])->name('partenaires.suspendre');

        Route::get('/commandes', [\App\Http\Controllers\AdminController::class, 'commandes'])->name('commandes');

        Route::get('/livreurs', [\App\Http\Controllers\AdminController::class, 'livreurs'])->name('livreurs');
        Route::patch('/livreurs/{user}/valider', [\App\Http\Controllers\AdminController::class, 'validerLivreur'])->name('livreurs.valider');
        Route::patch('/livreurs/{user}/suspendre', [\App\Http\Controllers\AdminController::class, 'suspendreLivreur'])->name('livreurs.suspendre');
        
        Route::get('/litiges', [\App\Http\Controllers\AdminController::class, 'litiges'])->name('litiges');
        Route::patch('/litiges/{litige}/resoudre', [\App\Http\Controllers\AdminController::class, 'resoudreLitige'])->name('litiges.resoudre');
    });

    // Route Litiges Client/Partenaire
    Route::post('/commandes/{commande}/litige', [\App\Http\Controllers\LitigeController::class, 'store'])->where('commande', '[0-9]+')->name('litiges.store');

});

require __DIR__.'/auth.php';

Route::get('/sys/clear-cache', function () {
    \Illuminate\Support\Facades\Artisan::call('cache:clear');
    \Illuminate\Support\Facades\Artisan::call('config:clear');
    \Illuminate\Support\Facades\Artisan::call('view:clear');
    \Illuminate\Support\Facades\Artisan::call('route:clear');
    return 'Cache cleared successfully.';
});

Route::get('/sys/fix-gps', function () {
    $updated = \App\Models\User::where('role', 'partenaire')
        ->where(function($q) {
            $q->whereNull('latitude')
              ->orWhereNull('longitude')
              ->orWhere('latitude', 0)
              ->orWhere('longitude', 0);
        })
        ->update([
            'latitude' => 14.735,
            'longitude' => -17.445,
            'adresse' => 'Touba Gaz Camberene, Dakar'
        ]);
    return "Updated {$updated} partners with default coordinates.";
});

Route::get('/sys/reset-commandes', function () {
    try {
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        
        \Illuminate\Support\Facades\DB::table('litiges')->truncate();
        \Illuminate\Support\Facades\DB::table('proposition_livraisons')->truncate();
        \Illuminate\Support\Facades\DB::table('livraisons')->truncate();
        \Illuminate\Support\Facades\DB::table('commande_evenementielles')->truncate();
        \Illuminate\Support\Facades\DB::table('commande_gazs')->truncate();
        \Illuminate\Support\Facades\DB::table('commande_materiels')->truncate();
        \Illuminate\Support\Facades\DB::table('commande_pondereuxes')->truncate();
        \Illuminate\Support\Facades\DB::table('commandes')->truncate();
        
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();
        return 'Toutes les commandes, livraisons et litiges ont été supprimés de la base de données avec succès.';
    } catch (\Exception $e) {
        return 'Erreur lors de la suppression : ' . $e->getMessage();
    }
});

Route::get('/sys/delete-materiel', function () {
    try {
        $deleted = \App\Models\Produit::where('categorie', 'materiel')->delete();
        return "Suppression réussie : {$deleted} produit(s) de la catégorie 'matériel' ont été supprimés.";
    } catch (\Exception $e) {
        return 'Erreur lors de la suppression : ' . $e->getMessage();
    }
});
