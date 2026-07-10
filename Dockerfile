FROM serversideup/php:8.2-fpm-nginx

# Revenir en root pour installer Node.js (nécessaire pour compiler le frontend Vite) et PostgreSQL
USER root
RUN apt-get update && apt-get install -y nodejs npm postgresql-client && apt-get clean

# Revenir à l'utilisateur www-data (sécurité)
USER www-data

# Copier tous les fichiers du projet
COPY --chown=www-data:www-data . /var/www/html

# Installer les dépendances PHP et compiler le frontend
RUN composer install --no-dev --optimize-autoloader
RUN npm install
RUN npm run build
