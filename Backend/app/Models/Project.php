<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $table = 'project';

    protected $fillable = [
        'nama_project',
        'deskripsi',
        'status',
        'tgl_dibuat',
        'author_id',
    ];

    protected function casts(): array
    {
        return [
            'tgl_dibuat' => 'date',
        ];
    }

    public function dokumentasi(): HasMany
    {
        return $this->hasMany(DokumentasiProject::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(StrukturOrganisasi::class, 'author_id');
    }
}
