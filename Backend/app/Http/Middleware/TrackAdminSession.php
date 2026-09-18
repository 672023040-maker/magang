<?php

namespace App\Http\Middleware;

use App\Models\Admin;
use App\Services\Security\DeviceSessionService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class TrackAdminSession
{
    public function __construct(private readonly DeviceSessionService $devices) {}

    public function handle(Request $request, Closure $next): Response
    {
        /** @var Admin|null $admin */
        $admin = $request->user('admin');

        if ($admin === null) {
            return $next($request);
        }

        $sessionId = Session::getId();

        // Session tidak lagi tercatat sebagai device aktif (mis. sudah di-revoke
        // dari "logout semua device") -> paksa keluar.
        if (! $this->devices->isCurrentSessionActive($admin, $sessionId)) {
            Auth::guard('admin')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $this->devices->touchSession($admin, $sessionId);

        return $next($request);
    }
}
