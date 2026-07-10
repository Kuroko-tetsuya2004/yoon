<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Litige;
use App\Models\Commande;

class LitigeController extends Controller
{
    public function store(Request $request, Commande $commande)
    {
        $request->validate([
            'description' => 'required|string|max:1000',
        ]);

        // Vérifier si un litige existe déjà
        if (Litige::where('commande_id', $commande->id)->where('user_id', $request->user()->id)->exists()) {
            return back()->with('error', 'Vous avez déjà ouvert un litige pour cette commande.');
        }

        Litige::create([
            'commande_id' => $commande->id,
            'user_id' => $request->user()->id,
            'description' => $request->description,
            'statut' => 'ouvert',
        ]);

        return back()->with('success', 'Votre litige a été soumis à l\'administration.');
    }
}
