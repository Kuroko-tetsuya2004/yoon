<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommandeEvenementielle extends Model
{
    protected $fillable = ['commande_id', 'titre', 'type_evenement', 'date_evenement'];

    protected $casts = [
        'date_evenement' => 'datetime',
    ];

    public function commande()
    {
        return $this->belongsTo(Commande::class);
    }

    public function prestations()
    {
        return $this->hasMany(Prestation::class);
    }
}
