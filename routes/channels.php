<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('livreur.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id && $user->role === 'livreur';
});
