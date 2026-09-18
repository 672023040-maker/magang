<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $table = 'project';

    protected $fillable = [
        'nama_project',
        'deskripsi',
        'status',
        'tgl_dibuat',
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
}
