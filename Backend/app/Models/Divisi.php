<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Divisi extends Model
{
    protected $table = 'divisi';

    protected $fillable = [
        'struktur_organisasi_id',
        'nama_divisi',
        'deskripsi',
    ];
}
