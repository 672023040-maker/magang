<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE project DROP CONSTRAINT IF EXISTS project_status_check');
            DB::statement("ALTER TABLE project ALTER COLUMN status TYPE varchar(255)");
        }

        // Migrasi data lama: berjalan -> unpublish, selesai -> publish
        DB::statement("UPDATE project SET status = 'unpublish' WHERE status = 'berjalan'");
        DB::statement("UPDATE project SET status = 'publish' WHERE status = 'selesai'");

        if ($driver === 'pgsql') {
            DB::statement("ALTER TABLE project ADD CONSTRAINT project_status_check CHECK (status IN ('publish', 'unpublish'))");
        }
    }

    public function down(): void
    {
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'pgsql') {
            DB::statement('ALTER TABLE project DROP CONSTRAINT IF EXISTS project_status_check');
        }

        // Kembalikan data: publish -> selesai, unpublish -> berjalan
        DB::statement("UPDATE project SET status = 'selesai' WHERE status = 'publish'");
        DB::statement("UPDATE project SET status = 'berjalan' WHERE status = 'unpublish'");

        if ($driver === 'pgsql') {
            DB::statement("ALTER TABLE project ADD CONSTRAINT project_status_check CHECK (status IN ('berjalan', 'selesai'))");
        }
    }
};