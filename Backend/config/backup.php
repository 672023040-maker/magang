<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Backup DIGFIN
    |--------------------------------------------------------------------------
    |
    | `digfin:backup` menyimpan dump database + arsip file upload ke sebuah
    | disk, lalu menghapus backup yang lebih lama dari `retention_days`.
    | Backup ditulis memakai disk dari bawah ini (default: disk "local" yang
    | berada di storage/app/private, TIDAK dapat diakses publik).
    |
    */

    'disk' => env('BACKUP_DISK', 'local'),

    'path' => env('BACKUP_PATH', 'backups'),

    'retention_days' => (int) env('BACKUP_RETENTION_DAYS', 14),

    // Binary pg_dump/pg_restore. Bisa diarahkan ke path absolut bila tidak ada
    // di PATH (mis. pada Windows).
    'pg_dump' => env('BACKUP_PG_DUMP', 'pg_dump'),
    'pg_restore' => env('BACKUP_PG_RESTORE', 'pg_restore'),

    'timeout' => (int) env('BACKUP_TIMEOUT', 600),

    // Direktori (disk "public") yang diarsipkan sebagai file upload.
    'files_disk' => env('BACKUP_FILES_DISK', 'public'),

];
