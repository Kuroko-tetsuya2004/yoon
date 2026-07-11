FROM php:8.4-apache

# Installer les dépendances système, Node.js et PostgreSQL client
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    libzip-dev \
    zip \
    unzip \
    nodejs \
    npm \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && docker-php-ext-install pdo_pgsql mbstring exif pcntl bcmath gd zip \
    && apt-get clean

# Activer le module rewrite d'Apache (pour Laravel)
RUN a2enmod rewrite

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copier les fichiers de l'application
COPY . .

# Installer les dépendances PHP (sans exécuter les scripts qui font planter la compilation car la base de données n'est pas encore connectée)
ENV COMPOSER_ALLOW_SUPERUSER=1
RUN composer install --no-dev --optimize-autoloader --no-scripts --ignore-platform-reqs

# Installer les dépendances JS
RUN npm install

# Exposer les variables d'environnement VITE pour la compilation
ENV VITE_REVERB_APP_KEY="4qkyonks9nnrsiz6qnck"
ENV VITE_REVERB_HOST="yoon-reverb.onrender.com"
ENV VITE_REVERB_PORT="443"
ENV VITE_REVERB_SCHEME="https"

# Compiler le JS au moment du build
RUN npm run build

# Configurer Apache pour pointer vers le dossier public de Laravel
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf
RUN sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf

# Configurer Apache pour utiliser une variable placeholder qui sera remplacée au démarrage
RUN sed -i 's/Listen 80/Listen ${PORT}/g' /etc/apache2/ports.conf
RUN sed -i 's/<VirtualHost \*:80>/<VirtualHost \*:${PORT}>/g' /etc/apache2/sites-available/000-default.conf

# Donner les bonnes permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Créer un script de démarrage qui remplace ${PORT} par sa vraie valeur puis démarre Apache
ENV LOG_CHANNEL=stderr
RUN echo '#!/bin/bash' > /usr/local/bin/start.sh && \
    echo 'sed -i "s/\${PORT}/$PORT/g" /etc/apache2/ports.conf' >> /usr/local/bin/start.sh && \
    echo 'sed -i "s/\${PORT}/$PORT/g" /etc/apache2/sites-available/000-default.conf' >> /usr/local/bin/start.sh && \
    echo 'php artisan optimize' >> /usr/local/bin/start.sh && \
    echo 'php artisan package:discover --ansi' >> /usr/local/bin/start.sh && \
    echo 'php artisan migrate --force' >> /usr/local/bin/start.sh && \
    echo 'php artisan storage:link' >> /usr/local/bin/start.sh && \
    echo 'chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public/build' >> /usr/local/bin/start.sh && \
    echo 'chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public/build' >> /usr/local/bin/start.sh && \
    echo 'apache2-foreground' >> /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

CMD ["/usr/local/bin/start.sh"]