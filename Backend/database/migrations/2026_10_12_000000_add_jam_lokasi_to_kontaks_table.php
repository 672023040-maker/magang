<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('kontak', function (Blueprint $table) {
            $table->string('jam_buka')->nullable()->after('email');
            $table->string('jam_tutup')->nullable()->after('jam_buka');
            $table->string('hari_operasional')->nullable()->after('jam_tutup');
            $table->text('lokasi')->nullable()->after('hari_operasional');
        });
    }

    public function down(): void
    {
        Schema::table('kontak', function (Blueprint $table) {
            $table->dropColumn(['jam_buka', 'jam_tutup', 'hari_operasional', 'lokasi']);
        });
    }
};
