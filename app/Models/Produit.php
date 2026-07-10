<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    use HasFactory;

    protected $fillable = [
        'partenaire_id',
        'categorie',
        'marque',
        'modele',
        'nom_produit',
        'description',
        'prix',
        'photo',
        'est_disponible',
        'quantite_stock'
    ];

    protected $appends = ['photo_url'];

    public function getPhotoUrlAttribute()
    {
        return $this->photo ? \Illuminate\Support\Facades\Storage::disk('s3')->url($this->photo) : null;
    }

    public function reduireStock($quantite)
    {
        if (in_array($this->categorie, ['gaz', 'pondereux'])) {
            $this->quantite_stock -= $quantite;
            if ($this->quantite_stock <= 0) {
                $this->quantite_stock = 0;
                $this->est_disponible = false;
            }
            $this->save();
        }
    }

    public function renflouer($quantite)
    {
        if (in_array($this->categorie, ['gaz', 'pondereux'])) {
            $this->quantite_stock += $quantite;
            if ($this->quantite_stock > 0) {
                $this->est_disponible = true;
            }
            $this->save();
        }
    }

    public function partenaire()
    {
        return $this->belongsTo(User::class, 'partenaire_id');
    }
}
