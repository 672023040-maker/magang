<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('project', function (Blueprint $table) {
            $table->foreignId('author_id')
                ->nullable()
                ->after('nama_project')
                ->constrained('struktur_organisasi')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('project', function (Blueprint $table) {
            $table->dropConstrainedForeignId('author_id');
        });
    }
};
