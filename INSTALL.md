# Guide d'Installation de Yoon

Bienvenue sur le projet **Yoon**. Ce projet utilise **Laravel 11**, **React**, **Inertia.js**, et **Docker (Laravel Sail)**.
Voici les étapes pour installer et configurer le projet sur une nouvelle machine.

## Prérequis
Avant de commencer, assurez-vous d'avoir installé les éléments suivants sur votre machine :
- **Docker** et **Docker Compose**
- **Git**
- *Optionnel mais recommandé* : **PHP** et **Composer** installés localement (pour faciliter l'installation initiale des dépendances PHP).

## 1. Cloner le projet
```bash
git clone <URL_DU_DEPOT> yoon
cd yoon
```

## 2. Installer les dépendances PHP
Si vous avez Composer installé localement, exécutez simplement :
```bash
composer install
```
*Si vous n'avez pas PHP/Composer en local, vous pouvez utiliser un conteneur temporaire :*
```bash
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd):/var/www/html" \
    -w /var/www/html \
    laravelsail/php83-composer:latest \
    composer install --ignore-platform-reqs
```

## 3. Configuration de l'environnement
Copiez le fichier d'exemple `.env.example` pour créer votre propre `.env` :
```bash
cp .env.example .env
```
Assurez-vous que les variables de base de données correspondent à celles configurées pour Docker (par défaut avec Sail, aucune modification n'est nécessaire).

## 4. Démarrer les conteneurs Docker
Le projet utilise Docker pour gérer l'environnement (Nginx, PHP, MySQL, Redis, etc.).
```bash
docker compose up -d
```
*(Vous pouvez utiliser les commandes docker classiques au lieu de Sail).*

## 5. Initialiser l'application Laravel
Une fois les conteneurs lancés, générez la clé de sécurité de l'application :
```bash
docker compose exec laravel.test php artisan key:generate
```

Lancez les migrations pour créer la structure de la base de données, ainsi que les seeders pour pré-remplir la base avec des comptes de test (Admin, Livreur, Partenaire, Client) :
```bash
docker compose exec laravel.test php artisan migrate --seed
```

Créez le lien symbolique pour le stockage des fichiers publics (pour les images, logos des partenaires, etc.) :
```bash
docker compose exec laravel.test php artisan storage:link
```

## 6. Compiler le Frontend (React / Inertia)
Le projet utilise Vite.js avec React et Inertia. Installez les dépendances NPM et compilez le frontend :
```bash
docker compose exec laravel.test npm install
docker compose exec laravel.test npm run build
```

## 7. C'est prêt ! 🎉
L'application est maintenant accessible à l'adresse suivante : **http://localhost** (ou le port défini dans votre `.env`, ex: `APP_PORT=8000`).

---

### Commandes utiles pour le développement :
- **Lancer le serveur de développement frontend (Hot-Reload) :**
  ```bash
  docker compose exec laravel.test npm run dev
  ```
- **Arrêter les conteneurs :**
  ```bash
  docker compose down
  ```
- **Lancer les tests :**
  ```bash
  docker compose exec laravel.test php artisan test
  ```
