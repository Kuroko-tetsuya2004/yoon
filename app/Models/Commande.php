<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    protected $fillable = [
        'client_id', 'repere_id', 'statut', 'montant_total', 
        'creneau', 'mode_paiement', 'statut_paiement', 'type_commande', 'motif_refus', 'frais_livraison'
    ];

    public function commandeable()
    {
        return $this->morphTo();
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function repere()
    {
        return $this->belongsTo(Repere::class);
    }

    public function gaz()
    {
        return $this->hasOne(CommandeGaz::class);
    }

    public function pondereux()
    {
        return $this->hasOne(CommandePondereux::class);
    }

    public function livraison()
    {
        return $this->hasOne(Livraison::class);
    }

    public function materiel()
    {
        return $this->hasOne(CommandeMateriel::class);
    }

    public function evenementielle()
    {
        return $this->hasOne(CommandeEvenementielle::class);
    }

    public function propositionLivraisons()
    {
        return $this->hasMany(PropositionLivraison::class);
    }

    // Alias court utilisé dans les eager loads partenaire
    public function propositions()
    {
        return $this->hasMany(PropositionLivraison::class);
    }
}
