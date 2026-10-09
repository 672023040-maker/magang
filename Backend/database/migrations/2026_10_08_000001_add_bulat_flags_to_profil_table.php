<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('profil', function (Blueprint $table) {
            $table->boolean('visi_bulat')->default(false)->after('visi');
            $table->boolean('misi_bulat')->default(false)->after('misi');
            $table->boolean('tujuan_bulat')->default(false)->after('tujuan');
        });
    }

    public function down(): void
    {
        Schema::table('profil', function (Blueprint $table) {
            $table->dropColumn(['visi_bulat', 'misi_bulat', 'tujuan_bulat']);
        });
    }
};
