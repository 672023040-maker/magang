<?php

namespace App\Http\Middleware;

use App\Models\Admin;
use App\Services\Security\SecurityLogger;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Memaksa admin mengganti password awal (must_change_password = true)
 * sebelum dapat mengakses area kelola (CRUD). Endpoint ganti-password,
 * perangkat, logout & me tetap dapat diakses.
 */
class EnsurePasswordChanged
{
    public function __construct(private readonly SecurityLogger $logger) {}

    public function handle(Request $request, Closure $next): Response
    {
        /** @var Admin|null $admin */
        $admin = $request->user('admin');

        if ($admin && $admin->must_change_password) {
            $this->logger->log('PASSWORD_CHANGE_REQUIRED', $request, [], $admin->id);

            return response()->json([
                'message' => 'Anda harus mengganti password sebelum melanjutkan.',
            ], 403);
        }

        return $next($request);
    }
}
