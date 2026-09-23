<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('divisi');
    }

    public function down(): void
    {
        Schema::create('divisi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('struktur_organisasi_id')
                ->constrained('struktur_organisasi')
                ->cascadeOnDelete();
            $table->string('nama_divisi');
            $table->text('deskripsi');
            $table->timestamps();
        });
    }
};