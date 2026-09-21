<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('profil', function (Blueprint $table) {
            $table->text('tujuan')->nullable()->after('misi');
        });

        Schema::table('profil', function (Blueprint $table) {
            $table->dropColumn(['tentang_kami', 'nilai']);
        });
    }

    public function down(): void
    {
        Schema::table('profil', function (Blueprint $table) {
            $table->text('tentang_kami');
            $table->text('nilai');
        });

        Schema::table('profil', function (Blueprint $table) {
            $table->dropColumn('tujuan');
        });
    }
};