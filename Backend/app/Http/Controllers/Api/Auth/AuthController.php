<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\AdminResource;
use App\Models\Admin;
use App\Services\Security\DeviceSessionService;
use App\Services\Security\LoginBruteForceService;
use App\Services\Security\SecurityLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function __construct(
        private readonly LoginBruteForceService $bruteForce,
        private readonly DeviceSessionService $devices,
        private readonly SecurityLogger $logger,
    ) {}

    public function login(LoginRequest $request): JsonResponse
    {
        $username = $request->string('username')->toString();
        $ip = $request->ip();

        if ($this->bruteForce->isLocked($username, $ip)) {
            $this->logger->log('RATE_LIMIT_TRIGGERED', $request, [
                'username' => $username,
                'seconds_to_unlock' => $this->bruteForce->secondsToUnlock($username, $ip),
            ]);

            return response()->json([
                'message' => 'Terlalu banyak percobaan login. Silakan coba lagi nanti.',
            ], 429);
        }

        $admin = Admin::where('username', $username)->first();

        // Response selalu generic agar tidak membocorkan apakah username valid.
        if (! $admin || ! Hash::check($request->password, $admin->password)) {
            $this->bruteForce->registerFailure($username, $ip, $request->userAgent(), $admin?->id);

            return response()->json([
                'message' => 'Username atau password salah.',
            ], 401);
        }

        $this->bruteForce->registerSuccess($username, $ip);

        $maxDevices = max((int) config('security.max_devices'), 1);

        // Lock baris admin agar dua login paralel dari device berbeda tidak
        // bisa sama-sama lolos melewati batas perangkat. (SQLite mengabaikan
        // FOR UPDATE, namun tetap aman karena menulis serial.)
        $result = DB::transaction(function () use ($admin, $maxDevices, $request): array {
            Admin::whereKey($admin->getKey())->lockForUpdate()->first();

            $activeDevices = $this->devices->activeDeviceCount($admin);

            if ($activeDevices >= $maxDevices) {
                return ['allowed' => false, 'active_devices' => $activeDevices];
            }

            Auth::guard('admin')->login($admin);
            $request->session()->regenerate();

            $this->devices->createForSession($admin, $request->session()->getId(), $request);

            return ['allowed' => true, 'active_devices' => $activeDevices];
        });

        // Counter brute-force baru dibersihkan setelah semua gate lolos —
        // admin yang terkunci karena batas perangkat bukan "login sukses".
        if (! $result['allowed']) {
            $this->logger->log('DEVICE_LIMIT_REACHED', $request, [
                'active_devices' => $result['active_devices'],
                'max_devices' => $maxDevices,
            ], $admin->id);

            return response()->json([
                'message' => 'Jumlah perangkat aktif telah mencapai batas maksimum.',
            ], 403);
        }

        $admin->forceFill([
            'last_login_at' => now(),
            'last_login_ip' => $ip,
        ])->save();

        $this->logger->log('LOGIN_SUCCESS', $request, ['username' => $username], $admin->id);
        $this->logger->log('SESSION_CREATED', $request, [], $admin->id);

        return response()->json([
            'message' => 'Login berhasil',
            'admin' => new AdminResource($admin),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'data' => new AdminResource($request->user('admin')),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        /** @var Admin $admin */
        $admin = $request->user('admin');

        $sessionId = $request->session()->getId();
        $this->devices->revokeCurrent($admin, $sessionId);

        Auth::guard('admin')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        $this->logger->log('SESSION_REVOKED', $request, ['trigger' => 'logout'], $admin->id);

        return response()->json([
            'message' => 'Logout berhasil',
        ]);
    }
}
