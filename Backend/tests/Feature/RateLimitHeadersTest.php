<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

/**
 * Header rate limit standar (RFC 8584) harus tersedia bersamaan dengan header
 * X-RateLimit-* bawaan Laravel, agar klien tahu kuota dan waktu tunggu.
 */
class RateLimitHeadersTest extends TestCase
{
    use RefreshDatabase;

    private function registerProbeRoute(): void
    {
        Route::middleware('throttle:auth:login')
            ->get('/api/_rate_limit_probe', fn () => response()->json(['ok' => true]));
    }

    public function test_header_rate_limit_standar_pada_respons_normal(): void
    {
        $this->registerProbeRoute();

        $response = $this->getJson('/api/_rate_limit_probe')->assertOk();

        $limit = (int) config('security.rate_limits.login_per_minute');

        $this->assertTrue($response->headers->has('RateLimit-Limit'), 'RateLimit-Limit wajib ada');
        $this->assertTrue($response->headers->has('RateLimit-Remaining'), 'RateLimit-Remaining wajib ada');
        $this->assertSame((string) $limit, (string) $response->headers->get('RateLimit-Limit'));
        $this->assertSame((string) ($limit - 1), (string) $response->headers->get('RateLimit-Remaining'));
    }

    public function test_header_rate_limit_reset_ada_saat_terkena_batas(): void
    {
        $this->registerProbeRoute();

        $limit = (int) config('security.rate_limits.login_per_minute');

        foreach (range(1, $limit) as $_) {
            $this->getJson('/api/_rate_limit_probe')->assertOk();
        }

        $this->getJson('/api/_rate_limit_probe')
            ->assertStatus(429)
            ->assertHeader('Retry-After')
            ->assertHeader('RateLimit-Reset')
            ->assertHeader('RateLimit-Limit', (string) $limit);
    }
}
