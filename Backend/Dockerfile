# syntax=docker/dockerfile:1

# Backend Laravel 12 (PHP 8.2 + php-fpm). Dipakai bersama nginx edge di
# image frontend (frontend/nginx.conf) yang menghubungi service ini via FastCGI.
FROM php:8.2-fpm AS app

# Ekstensi sistem yang dibutuhkan: gd (re-encode gambar upload), pdo_pgsql,
# intl, zip, pcntl (queue worker), dan redis (cache/queue/session).
# $PHPIZE_DEPS (autoconf/gcc/make/...) disediakan image php resmi untuk pecl.
RUN apt-get update && apt-get install -y --no-install-recommends \
        $PHPIZE_DEPS \
        libpng-dev \
        libjpeg62-turbo-dev \
        libfreetype6-dev \
        libzip-dev \
        libonig-dev \
        libpq-dev \
        libicu-dev \
        postgresql-client \
        unzip \
        git \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" pdo_pgsql gd bcmath intl zip pcntl exif opcache \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Layer dependency dipisah agar cache build tetap valid saat kode berubah.
COPY composer.json composer.lock ./
RUN composer install \
        --no-dev \
        --no-interaction \
        --prefer-dist \
        --optimize-autoloader \
        --no-scripts

COPY . .

# package:discover dijalankan saat runtime (entrypoint) setelah .env tersedia.
RUN composer dump-autoload --optimize --no-scripts \
    && mkdir -p \
        storage/app/public \
        storage/framework/cache/data \
        storage/framework/sessions \
        storage/framework/views \
        storage/logs \
        bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 9000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["php-fpm"]
