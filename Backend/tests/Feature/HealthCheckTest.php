<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Tests\TestCase;

class HealthCheckTest extends TestCase
{
    use RefreshDatabase;

    public function test_health_ok_saat_semua_dependensi_hidup(): void
    {
        $this->getJson('/api/health')
            ->assertOk()
            ->assertJsonPath('status', 'ok')
            ->assertJsonPath('checks.database', true)
            ->assertJsonPath('checks.cache', true)
            ->assertJsonPath('checks.storage', true)
            ->assertJsonStructure(['status', 'checks' => ['database', 'cache', 'storage'], 'timestamp']);
    }

    public function test_health_degraded_503_saat_komponen_gagal(): void
    {
        Storage::shouldReceive('disk')->andThrow(new RuntimeException('disk down'));

        $this->getJson('/api/health')
            ->assertStatus(503)
            ->assertJsonPath('status', 'degraded')
            ->assertJsonPath('checks.storage', false);
    }
}
