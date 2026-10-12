<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kontak extends Model
{
    protected $table = 'kontak';

    protected $fillable = [
        'email',
        'jam_buka',
        'jam_tutup',
        'hari_operasional',
        'lokasi',
    ];
}
