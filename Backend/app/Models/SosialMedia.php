<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SosialMedia extends Model
{
    protected $table = 'sosial_media';

    protected $fillable = [
        'kontak_id',
        'platform',
        'url',
    ];

    public function kontak(): BelongsTo
    {
        return $this->belongsTo(Kontak::class);
    }
}
