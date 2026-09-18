<?php

namespace App\Http\Middleware;

use App\Services\Security\SecurityLogger;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminRole
{
    public function __construct(private readonly SecurityLogger $logger) {}

    public function handle(Request $request, Closure $next): Response
    {
        $admin = $request->user('admin');

        if (! $admin || $admin->role !== 'admin') {
            $this->logger->log('UNAUTHORIZED_ADMIN_ACCESS', $request, [
                'roles' => $admin?->role,
            ], $admin?->id);

            return response()->json(['message' => 'Anda tidak memiliki izin.'], 403);
        }

        return $next($request);
    }
}
