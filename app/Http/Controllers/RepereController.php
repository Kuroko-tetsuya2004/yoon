<?php

namespace App\Http\Controllers;

use App\Models\Repere;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RepereController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $reperes = $request->user()->reperes()->latest()->get();
        return inertia('Reperes/Index', ['reperes' => $reperes]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Reperes/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'adresse' => 'required|string|max:500',
            'description' => 'nullable|string',
            'photo' => 'nullable|image|max:5120', // 5MB max
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('reperes', 's3');
            $validated['photo'] = Storage::disk('s3')->url($path);
        }

        $validated['is_default'] = $request->user()->reperes()->count() === 0;
        $request->user()->reperes()->create($validated);

        return redirect()->route('reperes.index')->with('success', 'Repère ajouté avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Repere $repere)
    {
        // Autorisation : seul le propriétaire peut supprimer
        if ($repere->client_id !== auth()->id()) {
            abort(403);
        }

        if ($repere->photo) {
            // L'URL retournée par S3 contient tout le chemin, on extrait le chemin de l'objet
            $path = parse_url($repere->photo, PHP_URL_PATH);
            // Suppression du premier slash si présent, puis du nom du bucket si c'est path-style
            // Ex: /yoon/reperes/image.jpg => reperes/image.jpg
            $path = str_replace('/' . env('AWS_BUCKET') . '/', '', $path);
            Storage::disk('s3')->delete($path);
        }

        $repere->delete();

        return redirect()->route('reperes.index')->with('success', 'Repère supprimé.');
    }

    /**
     * Set the specified resource as default.
     */
    public function setDefault(Request $request, Repere $repere)
    {
        if ($repere->client_id !== $request->user()->id) {
            abort(403);
        }

        $request->user()->reperes()->update(['is_default' => false]);
        $repere->update(['is_default' => true]);

        return redirect()->route('reperes.index')->with('success', 'Adresse définie comme adresse par défaut.');
    }
}
