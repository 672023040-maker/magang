<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DokumentasiProject extends Model
{
    protected $table = 'dokumentasi_project';

    protected $fillable = [
        'project_id',
        'file_gambar',
        'keterangan',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
