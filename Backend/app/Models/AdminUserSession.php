<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminUserSession extends Model
{
    public $timestamps = false;

    protected $table = 'admin_user_sessions';

    protected $fillable = [
        'admin_id',
        'session_id',
        'ip_address',
        'user_agent',
        'created_at',
        'expires_at',
        'last_activity_at',
        'revoked_at',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'expires_at' => 'datetime',
            'last_activity_at' => 'datetime',
            'revoked_at' => 'datetime',
        ];
    }
}
