<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminPasswordHistory extends Model
{
    public $timestamps = false;

    protected $table = 'admin_password_history';

    protected $fillable = [
        'admin_id',
        'password_hash',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }
}
