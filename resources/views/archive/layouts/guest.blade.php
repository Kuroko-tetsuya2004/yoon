<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Yoon') }} - Authentification</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="font-sans text-gray-900 antialiased overflow-x-hidden selection:bg-indigo-500 selection:text-white">
        <div class="flex min-h-screen bg-gray-50">
            <!-- Left Side - Branding -->
            <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900 via-indigo-700 to-purple-800 relative justify-center items-center overflow-hidden">
                <!-- Abstract decorative elements -->
                <div class="absolute -top-32 -left-32 w-[30rem] h-[30rem] rounded-full bg-white opacity-5 blur-[100px]"></div>
                <div class="absolute -bottom-40 -right-40 w-[40rem] h-[40rem] rounded-full bg-fuchsia-500 opacity-20 blur-[100px] animate-pulse duration-1000"></div>
                <div class="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-blue-400 opacity-20 blur-[80px]"></div>
                
                <div class="relative z-10 text-center px-12 text-white flex flex-col items-center">
                    <div class="mb-8 p-4 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl">
                        <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <h1 class="text-6xl font-extrabold tracking-tight mb-6 drop-shadow-xl">Yoon</h1>
                    <p class="text-xl font-medium opacity-90 mb-10 max-w-md mx-auto leading-relaxed">Votre plateforme de livraison rapide, fiable et innovante au Sénégal.</p>
                    <div class="flex justify-center space-x-3">
                        <div class="w-12 h-1.5 bg-white rounded-full opacity-80"></div>
                        <div class="w-3 h-1.5 bg-white/30 rounded-full"></div>
                        <div class="w-3 h-1.5 bg-white/30 rounded-full"></div>
                    </div>
                </div>
            </div>

            <!-- Right Side - Form -->
            <div class="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 sm:px-12 lg:px-24">
                <div class="w-full max-w-md relative z-10">
                    <div class="lg:hidden flex flex-col items-center justify-center mb-10">
                        <div class="mb-4 p-3 bg-indigo-600 rounded-2xl shadow-lg">
                            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight">Yoon</h1>
                    </div>
                    
                    <div class="bg-white/80 backdrop-blur-xl px-8 py-10 sm:px-10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-[2rem] border border-gray-100/50 transition-all duration-300 hover:shadow-[0_8px_40px_rgb(99,102,241,0.12)]">
                        {{ $slot }}
                    </div>
                    
                    <p class="text-center text-sm text-gray-500 mt-8">
                        &copy; {{ date('Y') }} Yoon. Tous droits réservés.
                    </p>
                </div>
            </div>
        </div>
    </body>
</html>
