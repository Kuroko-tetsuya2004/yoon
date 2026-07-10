<?php
namespace App\Notifications;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
class NouvelleCommandeNotification extends Notification
{
    use Queueable;
    public $commande;
    public function __construct($commande) {
        $this->commande = $commande;
    }
    public function via(object $notifiable): array {
        return ['database'];
    }
    public function toArray(object $notifiable): array {
        return [
            'commande_id' => $this->commande->id,
            'message' => 'Nouvelle commande reçue (' . $this->commande->type_commande . ').'
        ];
    }
}
