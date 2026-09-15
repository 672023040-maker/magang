<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dokumentasi_project', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')
                ->constrained('project')
                ->cascadeOnDelete();
            $table->string('file_gambar');
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dokumentasi_project');
    }
};
