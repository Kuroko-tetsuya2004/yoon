<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommandeMateriel extends Model
{
    protected $fillable = [
        'commande_id', 'partenaire_id', 'type_materiel', 
        'quantite', 'date_debut', 'date_fin'
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
