<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEvenementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->role === 'client';
    }

    public function rules(): array
    {
        return [
            'titre' => 'required|string|max:255',
            'type_evenement' => 'required|string|max:50',
            'date_evenement' => 'required|date|after:today',
            'repere_id' => 'required|exists:reperes,id',
        ];
    }
}
