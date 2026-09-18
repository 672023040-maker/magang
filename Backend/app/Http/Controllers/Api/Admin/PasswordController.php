<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ChangePasswordRequest;
use App\Models\Admin;
use App\Services\Security\DeviceSessionService;
use App\Services\Security\SecurityLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class PasswordController extends Controller
{
    public function __construct(
        private readonly DeviceSessionService $devices,
        private readonly SecurityLogger $logger,
    ) {}

    public function update(ChangePasswordRequest $request): JsonResponse
    {
        /** @var Admin $admin */
        $admin = $request->user('admin');

        $newPassword = $request->string('new_password')->toString();
        $historyCount = max((int) config('security.password.history_count'), 0);

        $recent = $admin->passwordHistory()
            ->orderByDesc('created_at')
            ->limit($historyCount ?: 1)
            ->get();

        foreach ($recent as $item) {
            if (Hash::check($newPassword, $item->password_hash)) {
                return response()->json([
                    'message' => 'Password baru tidak boleh sama dengan password yang pernah digunakan sebelumnya.',
                ], 422);
            }
        }

        // Catat password LAMA dan BARU ke history agar tidak bisa dipakai
        // ulang dalam rentang history_count (termasuk password awal yang
        // dipaksa ganti saat first-login).
        $oldHash = $admin->password;

        $admin->password = Hash::make($newPassword);
        $admin->must_change_password = false;
        $admin->password_changed_at = now();
        $admin->save();

        $admin->passwordHistory()->create([
            'password_hash' => $oldHash,
            'created_at' => now(),
        ]);

        $admin->passwordHistory()->create([
            'password_hash' => $admin->password,
            'created_at' => now(),
        ]);

        if ($historyCount > 0) {
            $admin->passwordHistory()
                ->orderByDesc('created_at')
                ->skip($historyCount)
                ->limit(1000)
                ->get()
                ->each->delete();
        }

        $this->devices->revokeAllExcept($admin, $request->session()->getId());

        $this->logger->log('PASSWORD_CHANGED', $request, [], $admin->id);
        $this->logger->log('SESSION_REVOKED', $request, ['trigger' => 'password_changed_other_devices'], $admin->id);

        return response()->json([
            'message' => 'Password berhasil diganti. Seluruh perangkat lain telah di-logout.',
        ]);
    }
}
