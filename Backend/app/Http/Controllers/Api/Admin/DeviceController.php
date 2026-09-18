<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Services\Security\DeviceSessionService;
use App\Services\Security\SecurityLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeviceController extends Controller
{
    public function __construct(
        private readonly DeviceSessionService $devices,
        private readonly SecurityLogger $logger,
    ) {}

    public function index(Request $request): JsonResponse
    {
        /** @var Admin $admin */
        $admin = $request->user('admin');

        $devices = $admin->userSessions()
            ->orderByDesc('last_activity_at')
            ->get()
            ->map(function ($session) use ($request) {
                return [
                    'id' => $session->id,
                    'current' => $session->session_id === $request->session()->getId(),
                    'ip_address' => $this->maskIp($session->ip_address),
                    'user_agent' => $session->user_agent,
                    'last_active_at' => $session->last_activity_at?->toDateTimeString(),
                    'login_at' => $session->created_at?->toDateTimeString(),
                    'expires_at' => $session->expires_at?->toDateTimeString(),
                    'revoked_at' => $session->revoked_at?->toDateTimeString(),
                ];
            });

        return response()->json([
            'data' => array_values($devices->all()),
        ]);
    }

    public function revoke(Request $request, int $id): JsonResponse
    {
        /** @var Admin $admin */
        $admin = $request->user('admin');

        $session = $admin->userSessions()->find($id);

        if (! $session || $session->revoked_at !== null) {
            return response()->json(['message' => 'Device tidak ditemukan.'], 404);
        }

        $this->devices->revokeOne($admin, $session);

        $this->logger->log('SESSION_REVOKED', $request, ['trigger' => 'device_revoke'], $admin->id);

        return response()->json(['message' => 'Device berhasil di-logout.']);
    }

    public function revokeAll(Request $request): JsonResponse
    {
        /** @var Admin $admin */
        $admin = $request->user('admin');

        $this->devices->revokeAllExcept($admin, $request->session()->getId());

        $this->logger->log('SESSION_REVOKED', $request, ['trigger' => 'logout_all_devices'], $admin->id);

        return response()->json(['message' => 'Seluruh device lain berhasil di-logout.']);
    }

    private function maskIp(?string $ip): ?string
    {
        if ($ip === null) {
            return null;
        }

        if (str_contains($ip, '.')) {
            $parts = explode('.', $ip);
            $parts[count($parts) - 1] = '***';

            return implode('.', $parts);
        }

        // IPv6 — tampilkan awalan saja.
        return substr($ip, 0, 8).'…';
    }
}
