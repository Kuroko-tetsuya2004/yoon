<?php
namespace App\Notifications;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
class CommandeStatusNotification extends Notification
{
    use Queueable;
    public $commande;
    public $statusMessage;
    public function __construct($commande, $statusMessage) {
        $this->commande = $commande;
        $this->statusMessage = $statusMessage;
    }
    public function via(object $notifiable): array {
        return ['database'];
    }
    public function toArray(object $notifiable): array {
        return [
            'commande_id' => $this->commande->id,
            'message' => $this->statusMessage
        ];
    }
}
