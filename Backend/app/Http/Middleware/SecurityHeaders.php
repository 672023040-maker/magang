<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
        $response->headers->set('Content-Security-Policy', $this->contentSecurityPolicy());

        if ($this->shouldEnableHsts($request)) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        return $response;
    }

    /**
     * CSP ketat untuk produksi; varian lebih longgar saat development agar
     * tidak memblokir tooling (Vite/HMR) dan inline style yang tidak berbahaya.
     */
    private function contentSecurityPolicy(): string
    {
        $scriptSrc = app()->environment('production')
            ? "'self'"
            : "'self' 'unsafe-inline' 'unsafe-eval'";

        return implode('; ', [
            "default-src 'self'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'self'",
            "object-src 'none'",
            "img-src 'self' data: blob: https:",
            "font-src 'self' data: https://fonts.gstatic.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "script-src {$scriptSrc}",
            "connect-src 'self'",
        ]);
    }

    private function shouldEnableHsts(Request $request): bool
    {
        return app()->environment('production')
            && str_starts_with((string) $request->getSchemeAndHttpHost(), 'https');
    }
}
