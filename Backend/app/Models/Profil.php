<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profil extends Model
{
    protected $table = 'profil';

    protected $fillable = [
        'visi',
        'misi',
        'tujuan',
        'visi_bulat',
        'misi_bulat',
        'tujuan_bulat',
    ];

    protected $casts = [
        'visi_bulat' => 'boolean',
        'misi_bulat' => 'boolean',
        'tujuan_bulat' => 'boolean',
    ];
}
