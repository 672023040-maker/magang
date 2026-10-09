#!/usr/bin/env sh
#
# Entrypoint container backend.
#  - Menunggu database siap sebelum migrasi (hindari race saat compose start).
#  - Menjalankan migrasi (idempotent, aman diulang saat restart).
#  - Meng-cache konfigurasi/route untuk performa produksi.
#
# Semua perintah artisan dijalankan sebagai www-data agar berkas
# storage/logs & bootstrap/cache tetap bisa ditulis oleh worker php-fpm.
#
# Catatan: admin awal TIDAK dibuat di sini. Jalankan sekali secara manual:
#   docker compose --env-file .env.docker run --rm app php artisan digfin:init-admin
set -e

if [ -n "${DB_HOST:-}" ]; then
    echo "Menunggu database di ${DB_HOST}:${DB_PORT:-5432}..."
    until php -r "exit(@fsockopen(getenv('DB_HOST'), (int) (getenv('DB_PORT') ?: 5432)) ? 0 : 1);"; do
        sleep 2
    done
fi

runuser -u www-data -- php artisan migrate --force

# Cache config/route/event/view. Aman diulang setiap start.
runuser -u www-data -- php artisan optimize

exec "$@"
