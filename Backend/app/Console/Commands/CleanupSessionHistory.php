<?php

namespace App\Console\Commands;

use App\Models\AdminUserSession;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CleanupSessionHistory extends Command
{
    protected $signature = 'sessions:cleanup-history {--days=30 : Hapus session revoked/expired lebih lama dari N hari}';
    protected $description = 'Hapus history session lama (revoked/expired) otomatis';

    public function handle(): int
    {
        $days = (int) $this->option('days');
        $cutoff = Carbon::now()->subDays($days);

        $deleted = AdminUserSession::query()
            ->where(function ($q) use ($cutoff) {
                $q->whereNotNull('revoked_at')
                  ->where('revoked_at', '<', $cutoff)
                  ->orWhere(function ($q2) use ($cutoff) {
                      $q2->whereNull('revoked_at')
                        ->where('expires_at', '<', $cutoff);
                  });
            })
            ->delete();

        return self::SUCCESS;
    }
}