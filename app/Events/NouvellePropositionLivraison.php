<?php

namespace App\Events;

use App\Models\PropositionLivraison;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NouvellePropositionLivraison implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $propositionId;
    public $livreurId;

    public function __construct(PropositionLivraison $proposition)
    {
        $this->propositionId = $proposition->id;
        $this->livreurId = $proposition->livreur_id;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('livreur.' . $this->livreurId),
        ];
    }
}
