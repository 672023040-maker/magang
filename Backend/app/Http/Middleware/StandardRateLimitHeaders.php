<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Melengkapi header rate limit gaya lama (X-RateLimit-*) yang dipasang oleh
 * middleware throttle Laravel dengan header standar IETF (RFC 8584):
 * `RateLimit-Limit`, `RateLimit-Remaining`, dan `RateLimit-Reset`.
 *
 * Didaftarkan sebagai middleware global terdepan sehingga, saat respons
 * merambat keluar, header dari `throttle:*` (route middleware) sudah ada.
 */
class StandardRateLimitHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $this->mirror($response, 'X-RateLimit-Limit', 'RateLimit-Limit');
        $this->mirror($response, 'X-RateLimit-Remaining', 'RateLimit-Remaining');
        $this->mirror($response, 'X-RateLimit-Reset', 'RateLimit-Reset');

        return $response;
    }

    private function mirror(Response $response, string $source, string $target): void
    {
        $value = $response->headers->get($source);

        if ($value !== null && ! $response->headers->has($target)) {
            $response->headers->set($target, (string) $value);
        }
    }
}
