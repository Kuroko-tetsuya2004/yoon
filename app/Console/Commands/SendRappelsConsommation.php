<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class SendRappelsConsommation extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-rappels';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Envoie des rappels de consommation aux clients pour commander du gaz';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = Carbon::today();
        
        $users = User::where('rappel_actif', true)
                     ->whereNotNull('prochain_rappel_date')
                     ->whereDate('prochain_rappel_date', '<=', $today)
                     ->get();

        $count = 0;
        foreach ($users as $user) {
            Log::info("🔔 Rappel Automatique Yoon : Bonjour {$user->name}, il est peut-être temps de renouveler votre stock de gaz ! (Tel: {$user->telephone})");
            
            // On repousse le prochain rappel en attendant que le client commande, 
            // ou on ajoute 3 jours de sursis avant le prochain spam.
            $user->prochain_rappel_date = $today->copy()->addDays(3);
            $user->save();
            $count++;
        }

        $this->info("{$count} rappel(s) envoyé(s) avec succès !");
    }
}
