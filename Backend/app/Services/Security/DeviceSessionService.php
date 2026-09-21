<?php

namespace App\Services\Security;

use App\Models\Admin;
use App\Models\AdminUserSession;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class DeviceSessionService
{
    /**
     * Buat baris tracking baru untuk session yang baru dibuat.
     */
    public function createForSession(Admin $admin, string $sessionId, Request $request): AdminUserSession
    {
        $lifetimeMinutes = (int) config('security.session_lifetime');

        return $admin->userSessions()->create([
            'session_id' => $sessionId,
            'ip_address' => $request->ip(),
            'user_agent' => mb_substr((string) $request->userAgent(), 0, 500),
            'created_at' => now(),
            'expires_at' => now()->addMinutes($lifetimeMinutes),
            'last_activity_at' => now(),
        ]);
    }

    /**
     * Jumlah device yang masih dianggap aktif untuk admin.
     * Device "hilang" (session sudah tidak ada / expired / revoked) tidak dihitung.
     */
    public function activeDeviceCount(Admin $admin): int
    {
        return $this->activeSessionIds($admin)->count();
    }

    /**
     * Apakah session saat ini tercatat sebagai device aktif untuk admin.
     */
    public function isCurrentSessionActive(Admin $admin, string $sessionId): bool
    {
        $row = AdminUserSession::query()
            ->where('admin_id', $admin->id)
            ->where('session_id', $sessionId)
            ->whereNull('revoked_at')
            ->first();

        if (! $row) {
            return false;
        }

        return $this->sessionStillExists($sessionId);
    }

    /**
     * Update last activity + perpanjang expires_at untuk session aktif.
     */
    public function touchSession(Admin $admin, string $sessionId): void
    {
        $lifetimeMinutes = (int) config('security.session_lifetime');

        AdminUserSession::query()
            ->where('admin_id', $admin->id)
            ->where('session_id', $sessionId)
            ->whereNull('revoked_at')
            ->update([
                'last_activity_at' => now(),
                'expires_at' => now()->addMinutes($lifetimeMinutes),
            ]);
    }

    public function revokeCurrent(Admin $admin, string $sessionId): void
    {
        AdminUserSession::query()
            ->where('admin_id', $admin->id)
            ->where('session_id', $sessionId)
            ->update(['revoked_at' => now()]);
    }

    /**
     * Revoke satu device tertentu + hapus session server-nya.
     */
    public function revokeOne(Admin $admin, AdminUserSession $row): void
    {
        DB::table(config('session.table', 'sessions'))
            ->where('id', $row->session_id)
            ->delete();

        $row->update(['revoked_at' => now()]);
    }

    /**
     * Revoke seluruh device admin lain (kecuali session saat ini) dan
     * hapus session server-nya secara langsung.
     */
    public function revokeAllExcept(Admin $admin, string $currentSessionId): void
    {
        $rows = AdminUserSession::query()
            ->where('admin_id', $admin->id)
            ->whereNull('revoked_at')
            ->where('session_id', '!=', $currentSessionId)
            ->get();

        $ids = $rows->pluck('session_id')->all();

        if ($ids !== []) {
            DB::table(config('session.table', 'sessions'))
                ->whereIn('id', $ids)
                ->delete();
        }

        $now = now();

        foreach ($rows as $row) {
            $row->update(['revoked_at' => $now]);
        }
    }

    /**
     * Daftar session id dari baris tracking yang masih bernilai aktif.
     */
    private function activeSessionIds(Admin $admin): Collection
    {
        $lifetimeMinutes = max((int) config('security.session_lifetime'), 1);
        $cutoff = now()->subMinutes($lifetimeMinutes);

        $rows = AdminUserSession::query()
            ->where('admin_id', $admin->id)
            ->whereNull('revoked_at')
            ->where(function ($q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })
            ->where(function ($q) use ($cutoff) {
                $q->whereNull('last_activity_at')->orWhere('last_activity_at', '>=', $cutoff);
            })
            ->get(['session_id']);

        $ids = $rows->pluck('session_id');
        $existing = DB::table(config('session.table', 'sessions'))
            ->whereIn('id', $ids)
            ->pluck('id');

        // Cleanup baris tracking yang session-nya sudah tidak ada.
        $missing = $ids->diff($existing);
        if ($missing->isNotEmpty()) {
            AdminUserSession::query()
                ->where('admin_id', $admin->id)
                ->whereIn('session_id', $missing)
                ->update(['revoked_at' => now()]);
        }

        return $existing;
    }

    private function sessionStillExists(string $sessionId): bool
    {
        return DB::table(config('session.table', 'sessions'))
            ->where('id', $sessionId)
            ->exists();
    }
}
