<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('pesan_kontak');
    }

    public function down(): void
    {
        Schema::create('pesan_kontak', function (Blueprint $table) {
            $table->id();
            $table->string('nama_pengirim');
            $table->string('email');
            $table->string('subjek');
            $table->text('pesan');
            $table->timestamp('tanggal')->useCurrent();
            $table->timestamps();
        });
    }
};
