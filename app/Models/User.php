<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    protected $fillable = [
        'name', 'email', 'password', 'telephone', 'role', 
        'disponibilite', 'type_service', 'statut_validation', 
        'rappel_actif', 'frequence_rappel_jours', 'prochain_rappel_date', 
        'description_boutique', 'photo_devanture', 'moyen_transport', 
        'latitude', 'longitude', 'adresse', 'propre_service_livraison', 
        'photo_moyen_transport', 'immatriculation'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $appends = ['photo_devanture_url', 'photo_moyen_transport_url'];

    public function getPhotoDevantureUrlAttribute()
    {
        return $this->photo_devanture ? \Illuminate\Support\Facades\Storage::disk('s3')->url($this->photo_devanture) : null;
    }

    public function getPhotoMoyenTransportUrlAttribute()
    {
        return $this->photo_moyen_transport ? \Illuminate\Support\Facades\Storage::disk('s3')->url($this->photo_moyen_transport) : null;
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the reperes for the user.
     */
    public function reperes(): HasMany
    {
        return $this->hasMany(Repere::class, 'client_id');
    }

    public function commandes()
    {
        return $this->hasMany(Commande::class, 'client_id');
    }

    public function produits()
    {
        return $this->hasMany(Produit::class, 'partenaire_id');
    }

    public function livraisons()
    {
        return $this->hasMany(Livraison::class, 'livreur_id');
    }
}
