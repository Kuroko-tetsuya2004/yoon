<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCommandeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->role === 'client';
    }

    public function rules(): array
    {
        return [
            'produit_id' => 'required|exists:produits,id',
            'repere_id' => 'required|exists:reperes,id',
            'quantite' => 'required|integer|min:1',
            'creneau' => 'required|string',
            'mode_paiement' => 'required|string',
            'type_bonbonne' => 'nullable|string',
            'contenant_vide' => 'nullable|boolean',
            'frais_livraison' => 'nullable|numeric|min:0',
            'date_debut' => 'nullable|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'poids_estime' => 'nullable|numeric|min:0',
        ];
    }
}
