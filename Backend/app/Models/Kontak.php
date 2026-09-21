<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kontak extends Model
{
    protected $table = 'kontak';

    protected $fillable = [
        'email',
    ];

    public function sosialMedia(): HasMany
    {
        return $this->hasMany(SosialMedia::class);
    }
}
