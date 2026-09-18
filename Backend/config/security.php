<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Admin Path
    |--------------------------------------------------------------------------
    |
    | Prefix yang dipakai untuk seluruh route admin API. Nilai ini BUKAN
    | pengganti authentication/authorization, hanya lapisan obscurity tambahan.
    | Kemampuan akses tetap dijamin oleh middleware auth + role + rate limit.
    |
    */

    'admin_path' => env('ADMIN_PATH', 'digfin-secure-panel'),

    /*
    |--------------------------------------------------------------------------
    | Inisialisasi Admin Awal
    |--------------------------------------------------------------------------
    |
    | Dipakai command `php artisan digfin:init-admin`. Nilai default KOSONG —
    | command akan meminta password interaktif (hidden prompt). Bila lingkungan
    | tidak mendukung prompt interaktif (mis. CI/CD), berikan lewat env di
    | proses satu-kali:
    |
    |     set ADMIN_INITIAL_PASSWORD=... && php artisan digfin:init-admin
    |
    | Password awal TIDAK boleh di-commit ke repo / .env. Env ini hanya untuk
    | momen bootstrap admin pertama (sekali pakai, langsung dipaksa ganti).
    |
    */

    'initial_username' => (string) env('ADMIN_INITIAL_USERNAME', ''),
    'initial_password' => (string) env('ADMIN_INITIAL_PASSWORD', ''),

    /*
    |--------------------------------------------------------------------------
    | Session / Device Management
    |--------------------------------------------------------------------------
    */

    'max_devices' => (int) env('ADMIN_MAX_DEVICES', 2),

    'session_lifetime' => (int) env('ADMIN_SESSION_LIFETIME', 120),

    /*
    |--------------------------------------------------------------------------
    | Login / Brute Force Protection
    |--------------------------------------------------------------------------
    |
    | Progressive backoff:
    |   Level 1 : max_attempts        gagal -> cooldown_short
    |   Level 2 : max_attempts * 2    gagal -> cooldown_medium
    |   Level 3 : max_attempts * 3    gagal -> cooldown_long
    |   Level 4 : seterusnya          gagal -> cooldown_extended
    |
    */

    'login' => [
        'max_attempts' => (int) env('LOGIN_MAX_ATTEMPTS', 5),

        'cooldown_short' => (int) env('LOGIN_COOLDOWN_SHORT', 1),      // menit
        'cooldown_medium' => (int) env('LOGIN_COOLDOWN_MEDIUM', 5),    // menit
        'cooldown_long' => (int) env('LOGIN_COOLDOWN_LONG', 15),       // menit
        'cooldown_extended' => (int) env('LOGIN_COOLDOWN_EXTENDED', 30), // menit

        // Jarak kasus waktu (menit) untuk deteksi "banyak username dari 1 IP"
        'username_probe_window' => (int) env('LOGIN_USERNAME_PROBE_WINDOW', 10),
        'max_usernames_per_ip' => (int) env('LOGIN_MAX_USERNAMES_PER_IP', 10),

        // Jarak kasus waktu (menit) untuk deteksi "satu username diserang banyak IP"
        'ip_probe_window' => (int) env('LOGIN_IP_PROBE_WINDOW', 15),
        'max_ips_per_username' => (int) env('LOGIN_MAX_IPS_PER_USERNAME', 5),
    ],

    /*
    |--------------------------------------------------------------------------
    | Password Policy
    |--------------------------------------------------------------------------
    */

    'password' => [
        'min_length' => (int) env('PASSWORD_MIN_LENGTH', 12),
        'require_uppercase' => (bool) env('PASSWORD_REQUIRE_UPPERCASE', true),
        'require_lowercase' => (bool) env('PASSWORD_REQUIRE_LOWERCASE', true),
        'require_digit' => (bool) env('PASSWORD_REQUIRE_DIGIT', true),
        'require_symbol' => (bool) env('PASSWORD_REQUIRE_SYMBOL', true),
        'history_count' => (int) env('PASSWORD_HISTORY_COUNT', 5),
    ],

    /*
    |--------------------------------------------------------------------------
    | Upload Security
    |--------------------------------------------------------------------------
    */

    'upload' => [
        'allowed_extensions' => ['jpg', 'jpeg'],
        'allowed_mimes' => ['image/jpeg'],
        'max_size' => (int) env('MAX_IMAGE_SIZE', 5 * 1024), // KB
        'max_width' => (int) env('MAX_IMAGE_WIDTH', 6000),
        'max_height' => (int) env('MAX_IMAGE_HEIGHT', 6000),
        'max_files_per_request' => (int) env('MAX_IMAGE_FILES', 5),
        'jpeg_quality' => (int) env('JPEG_REENCODE_QUALITY', 85),
    ],

    /*
    |--------------------------------------------------------------------------
    | Rate Limit (request / menit)
    |--------------------------------------------------------------------------
    |
    | - login   : semua percobaan login per IP (lapisan di atas brute-force).
    | - sensitive : ganti password & kelola perangkat (per admin/IP).
    | - upload  : endpoint pembawa file (project & struktur).
    | - write   : perubahan data admin selain upload.
    |
    */

    'rate_limits' => [
        'login_per_minute' => (int) env('LOGIN_RATE_PER_MINUTE', 10),
        'sensitive_per_minute' => (int) env('SENSITIVE_RATE_PER_MINUTE', 5),
        'upload_per_minute' => (int) env('UPLOAD_RATE_PER_MINUTE', 10),
        'write_per_minute' => (int) env('ADMIN_WRITE_RATE_PER_MINUTE', 30),
    ],

    /*
    |--------------------------------------------------------------------------
    | Antivirus (optional)
    |--------------------------------------------------------------------------
    |
    | activation optional, nonaktif secara default. Hanya nyalakan bila binary
    | clamav/clamscan benar-benar tersedia di server production.
    |
    */

    'antivirus' => [
        'enabled' => (bool) env('AV_SCAN_ENABLED', false),
        'binary' => env('AV_SCAN_BINARY', 'clamscan'),
        'timeout' => (int) env('AV_SCAN_TIMEOUT', 60),
    ],

];
