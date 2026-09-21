<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SecurityEvent extends Model
{
    public $timestamps = false;

    public const UPDATED_AT = null;

    protected $table = 'security_events';

    protected $fillable = [
        'event_type',
        'user_id',
        'ip_address',
        'user_agent',
        'details',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'details' => 'array',
            'created_at' => 'datetime',
        ];
    }
}
