-- ============================================================================
-- DIGIFIN — Database role khusus aplikasi (least privilege)
-- ============================================================================
-- Tujuan  : Jangan jalankan aplikasi dengan akun superuser 'postgres'.
--           Buat role non-superuser yang hanya diberi hak minimum:
--             1. connect ke database `digfin`
--             2. DML (SELECT/INSERT/UPDATE/DELETE) + SEQUENCE usage
--             3. hak pada skema public
-- Konteks : PostgreSQL (sesuai Backend/.env => DB_CONNECTION=pgsql)
-- ============================================================================
-- CARA PAKAI (DWAS ADMIN DATABASE, bukan dari aplikasi):
--   1) Login sebagai superuser:
--         psql -U postgres -h 127.0.0.1 -d digfin
--   2) Jalankan isi file ini (sesuaikan password di bawah).
--   3) Update Backend/.env :
--         DB_USERNAME=digfin_app
--         DB_PASSWORD=<password-role-bar>   (jangan dibagikan / tidak di commit)
--   4) Uji akses dengan koneksi baru memakai kredensial digfin_app.
-- ============================================================================

BEGIN;

-- 1. Role aplikasi (non-login superuser; password WAJIB diganti sebelum dipakai)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'digfin_app') THEN
        CREATE ROLE digfin_app LOGIN PASSWORD 'GantiPasswordIniDenganYangKuat';
    ELSE
        RAISE NOTICE 'Role digfin_app sudah ada — lewati pembuatan.';
    END IF;
END
$$;

-- 2. Beri akses connect + skema public
GRANT CONNECT ON DATABASE digfin TO digfin_app;
GRANT USAGE ON SCHEMA public TO digfin_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE ON SCHEMA public TO digfin_app;

-- 3. Hak DML untuk semua tabel existing + yang akan dibuat nanti
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO digfin_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO digfin_app;

-- 4. Sequential / auto-increment (perlu jika aplikasi memakai RETURNING / INSERT)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO digfin_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO digfin_app;

-- 5. PENTING: aplikasi TIDAK butuh hak berikut, sengaja tidak diberikan:
--      CREATEDB, CREATEROLE, SUPERUSER, melewati RLS.
--    Migrasi (`php artisan migrate`) hanya dijalankan saat deploy oleh
--    akun admin/khusus migrator, BUKAN oleh digfin_app.

COMMIT;

-- ============================================================================
-- Verifikasi setelah role aktif:
--   \du                       -> periksa atribut role
--   \dn+                      -> periksa akses skema
--   SELECT * FROM information_schema.table_privileges
--     WHERE grantee='digfin_app';
-- ============================================================================