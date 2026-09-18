<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('project', function (Blueprint $table) {
            $table->dropColumn('tgl_selesai');
            $table->renameColumn('tgl_mulai', 'tgl_dibuat');
        });
    }

    public function down(): void
    {
        Schema::table('project', function (Blueprint $table) {
            $table->renameColumn('tgl_dibuat', 'tgl_mulai');
            $table->date('tgl_selesai')->nullable()->after('tgl_mulai');
        });
    }
};