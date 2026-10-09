<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Index untuk mempercepat query yang benar-benar dipakai aplikasi:
     *  - project: filter publik `WHERE status = 'publish'` + urutan `created_at`
     *    (`latest()`), serta join ke struktur_organisasi lewat author_id.
     *  - struktur_organisasi: urutan `created_at` (`latest()`) dan filter jabatan.
     *
     * Catatan: PostgreSQL TIDAK otomatis membuat index untuk kolom foreign key,
     * jadi index `author_id` di sini penting (mempercepat eager-load author).
     */
    public function up(): void
    {
        Schema::table('project', function (Blueprint $table) {
            $table->index('author_id');
            $table->index('created_at');
            $table->index(['status', 'created_at']);
        });

        Schema::table('struktur_organisasi', function (Blueprint $table) {
            $table->index('created_at');
            $table->index('jabatan');
        });
    }

    public function down(): void
    {
        Schema::table('project', function (Blueprint $table) {
            $table->dropIndex(['author_id']);
            $table->dropIndex(['created_at']);
            $table->dropIndex(['status', 'created_at']);
        });

        Schema::table('struktur_organisasi', function (Blueprint $table) {
            $table->dropIndex(['created_at']);
            $table->dropIndex(['jabatan']);
        });
    }
};
