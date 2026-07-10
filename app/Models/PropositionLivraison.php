<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropositionLivraison extends Model
{
    use HasFactory;

    protected $fillable = [
        'commande_id',
        'livreur_id',
        'statut'
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
