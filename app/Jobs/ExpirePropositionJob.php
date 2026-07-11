<?php

namespace App\Jobs;

use App\Models\PropositionLivraison;
use App\Services\LivraisonService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ExpirePropositionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $propositionId;

    /**
     * Create a new job instance.
     */
    public function __construct($propositionId)
    {
        $this->propositionId = $propositionId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $proposition = PropositionLivraison::find($this->propositionId);

        if ($proposition && $proposition->statut === 'en_attente') {
            $proposition->statut = 'refusee'; // ou 'expiree', mais 'refusee' permet d'exclure le livreur dans la requête suivante
            $proposition->save();

            // Notify the frontend via reverb if necessary, or just rely on the next assignment
            // We find the next closest driver
            LivraisonService::assignerLivreurProche($proposition->commande);
        }
    }
}
