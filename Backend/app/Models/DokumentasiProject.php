<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DokumentasiProject extends Model
{
    protected $table = 'dokumentasi_project';

    protected $fillable = [
        'project_id',
        'file_gambar',
        'keterangan',
    ];
}
