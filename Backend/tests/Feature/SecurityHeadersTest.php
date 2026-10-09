<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Header keamanan dikirim untuk seluruh respons API (SecurityHeaders).
 * CSP bersifat env-aware: ketat di produksi, lebih longgar di development.
 */
class SecurityHeadersTest extends TestCase
{
    use RefreshDatabase;

    public function test_endpoint_publik_mengirim_header_keamanan(): void
    {
        $this->getJson('/api/project')
            ->assertOk()
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeader('X-Frame-Options', 'SAMEORIGIN')
            ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
            ->assertHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')
            ->assertHeader('Content-Security-Policy');
    }

    public function test_csp_memuat_direktif_utama(): void
    {
        $csp = (string) $this->getJson('/api/project')->headers->get('Content-Security-Policy');

        $this->assertStringContainsString("default-src 'self'", $csp);
        $this->assertStringContainsString("frame-ancestors 'self'", $csp);
        $this->assertStringContainsString("object-src 'none'", $csp);
        // Lingkungan test = non-produksi, jadi script-src harus longgar.
        $this->assertStringContainsString("'unsafe-eval'", $csp);
    }

    public function test_hsts_tidak_aktif_di_non_produksi(): void
    {
        $this->getJson('/api/project')->assertHeaderMissing('Strict-Transport-Security');
    }
}
