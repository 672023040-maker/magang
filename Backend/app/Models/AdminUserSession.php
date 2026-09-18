<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class);
    }

    public function scopeActive($query)
    {
        return $query->whereNull('revoked_at');
    }
}
