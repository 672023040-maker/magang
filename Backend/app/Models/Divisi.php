<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Divisi extends Model
{
    protected $table = 'divisi';

    protected $fillable = [
        'struktur_organisasi_id',
        'nama_divisi',
        'deskripsi',
    ];

    public function strukturOrganisasi(): BelongsTo
    {
        return $this->belongsTo(StrukturOrganisasi::class);
    }
}
