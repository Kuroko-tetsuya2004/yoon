<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prestation extends Model
{
    protected $fillable = [
        'commande_evenementielle_id', 'produit_id', 'partenaire_id', 
        'quantite', 'prix_unitaire', 'caution', 'statut'
    ];

    public function commandeEvenementielle()
    {
        return $this->belongsTo(CommandeEvenementielle::class);
    }

    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }

    public function partenaire()
    {
        return $this->belongsTo(User::class, 'partenaire_id');
    }
}
