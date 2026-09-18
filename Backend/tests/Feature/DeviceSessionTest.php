<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\AdminUserSession;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Manajemen device/session: batas jumlah perangkat, revoke satu device,
 * revoke semua, dan penolakan akses setelah session dicabut.
 */
class DeviceSessionTest extends TestCase
{
    use RefreshDatabase;

    private function createAdmin(): Admin
    {
        return Admin::query()->create([
            'username' => 'admin',
            'password' => Hash::make('admin123'),
            'nama' => 'Admin Test',
            'role' => 'admin',
        ]);
    }

    private function adminPath(): string
    {
        return trim((string) config('security.admin_path'), '/');
    }

    /**
     * Login stateful seperti SPA sungguhan; mengembalikan session id hasil
     * regenerate agar bisa dipakai sebagai cookie request berikutnya.
     */
    private function login(): string
    {
        $this->from(config('app.url'))
            ->withSession([])
            ->postJson('/api/login', [
                'username' => 'admin',
                'password' => 'admin123',
            ])
            ->assertOk();

        return $this->app['session']->getId();
    }

    private function withAdminSession(string $sessionId): static
    {
        return $this->from(config('app.url'))
            ->withCredentials()
            ->withCookie(config('session.cookie'), $sessionId);
    }

    public function test_login_sukses_membuat_tracking_device_aktif(): void
    {
        $admin = $this->createAdmin();
        $sessionId = $this->login();

        $this->assertDatabaseHas('admin_user_sessions', [
            'admin_id' => $admin->id,
            'session_id' => $sessionId,
        ]);

        $this->assertDatabaseHas('sessions', ['id' => $sessionId]);
    }

    public function test_device_kedua_masih_diizinkan(): void
    {
        $admin = $this->createAdmin();

        $first = $this->login();
        $second = $this->login(); // login kedua sukses juga

        $this->assertNotSame($first, $second, 'Setiap login harus menghasilkan session baru.');
        $this->assertSame(2, AdminUserSession::query()->whereNull('revoked_at')->count());
    }

    public function test_device_ketiga_ditolak(): void
    {
        $admin = $this->createAdmin();

        // Dua device aktif dulu (baris tracking + session server).
        foreach (['dev-a', 'dev-b'] as $i => $sid) {
            DB::table('sessions')->insert([
                'id' => $sid,
                'user_id' => $admin->id,
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Test-Agent',
                'payload' => base64_encode(''),
                'last_activity' => time(),
            ]);

            AdminUserSession::query()->create([
                'admin_id' => $admin->id,
                'session_id' => $sid,
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Test-Agent',
                'created_at' => now(),
                'expires_at' => now()->addMinutes(120),
                'last_activity_at' => now(),
            ]);
        }

        $this->assertSame((int) config('security.max_devices'), 2);

        // Login ke-3 harus ditolak karena sudah 2 perangkat aktif.
        $this->from(config('app.url'))
            ->postJson('/api/login', [
                'username' => 'admin',
                'password' => 'admin123',
            ])
            ->assertStatus(403)
            ->assertJsonPath('message', 'Jumlah perangkat aktif telah mencapai batas maksimum.');

        $this->assertDatabaseCount('admin_user_sessions', 2);
    }

    public function test_revoke_device_membuat_session_tidak_aktif(): void
    {
        $this->createAdmin();
        $sessionId = $this->login();
        $path = $this->adminPath();

        $device = AdminUserSession::query()
            ->where('session_id', $sessionId)
            ->firstOrFail();

        $this->withAdminSession($sessionId)
            ->postJson("/api/{$path}/devices/{$device->id}/revoke")
            ->assertOk()
            ->assertJsonPath('message', 'Device berhasil di-logout.');

        $this->assertNotNull($device->refresh()->revoked_at);

        // Session yang sudah di-revoke → tidak boleh akses area admin lagi.
        $this->withAdminSession($sessionId)
            ->getJson("/api/{$path}/profil")
            ->assertStatus(401);
    }

    public function test_revoke_semua_mencabut_device_lain_tapi_menjaga_sesi_saat_ini(): void
    {
        $this->createAdmin();
        $current = $this->login();
        $other = $this->login(); // device ke-2
        $path = $this->adminPath();

        $this->assertSame(2, AdminUserSession::query()->whereNull('revoked_at')->count());

        $this->withAdminSession($current)
            ->postJson("/api/{$path}/devices/revoke-all")
            ->assertOk()
            ->assertJsonPath('message', 'Seluruh device lain berhasil di-logout.');

        // Device lain dicabut, sesi saat ini tetap aktif.
        $otherRow = AdminUserSession::query()->where('session_id', $other)->firstOrFail();
        $this->assertNotNull($otherRow->revoked_at);

        $currentRow = AdminUserSession::query()->where('session_id', $current)->firstOrFail();
        $this->assertNull($currentRow->revoked_at);
    }

    public function test_revoke_memerlukan_izin_admin(): void
    {
        Admin::query()->create([
            'username' => 'staff',
            'password' => Hash::make('staff123'),
            'nama' => 'Staff',
            'role' => 'staff',
        ]);

        $this->from(config('app.url'))
            ->withSession([])
            ->postJson('/api/login', [
                'username' => 'staff',
                'password' => 'staff123',
            ])
            ->assertOk();

        $sessionId = $this->app['session']->getId();
        $path = $this->adminPath();

        $this->withAdminSession($sessionId)
            ->getJson("/api/{$path}/devices")
            ->assertStatus(403);

        $this->withAdminSession($sessionId)
            ->postJson("/api/{$path}/devices/revoke-all")
            ->assertStatus(403);
    }
}
