<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommandePondereux extends Model
{
    protected $fillable = [
        'commande_id', 'partenaire_id', 'type_produit', 
        'poids_estime', 'quantite'
    ];

    public function commande()
    {
        return $this->morphOne(Commande::class, 'commandeable');
    }

    public function partenaire()
    {
        return $this->belongsTo(User::class, 'partenaire_id');
    }
}
