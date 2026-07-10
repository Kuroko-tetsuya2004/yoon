<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Livraison extends Model
{
    protected $fillable = [
        'commande_id',
        'livreur_id',
        'heure_depart',
        'heure_arrivee',
        'statut_livraison'
    ];

    public function commande()
    {
        return $this->belongsTo(Commande::class);
    }

    public function livreur()
    {
        return $this->belongsTo(User::class, 'livreur_id');
    }
}
