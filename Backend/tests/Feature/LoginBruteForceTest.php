<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Services\Security\LoginBruteForceService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

/**
 * Proteksi brute force: batas percobaan, progressive backoff, deteksi
 * serangan multi-username, dan anti-enumerasi username.
 */
class LoginBruteForceTest extends TestCase
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

    private function attempt(string $username, string $password): TestResponse
    {
        return $this->from(config('app.url'))
            ->withSession([])
            ->postJson('/api/login', [
                'username' => $username,
                'password' => $password,
            ]);
    }

    public function test_password_salah_mengembalikan_401(): void
    {
        $this->createAdmin();

        $this->attempt('admin', 'salah1234')
            ->assertStatus(401)
            ->assertJsonPath('message', 'Username atau password salah.');
    }

    public function test_setelah_5_kali_gagal_login_dikunci(): void
    {
        $this->createAdmin();

        // 5x gagal: seluruhnya 401.
        foreach (range(1, 5) as $i) {
            $response = $this->attempt('admin', 'salah');
            $this->assertSame(401, $response->status(), "percobaan ke-{$i}");
        }

        // Percobaan ke-6: terkunci (brute force / progressive backoff).
        $this->attempt('admin', 'admin123')
            ->assertStatus(429)
            ->assertJsonPath('message', 'Terlalu banyak percobaan login. Silakan coba lagi nanti.');

        // Event keamanan tercatat.
        $this->assertDatabaseHas('security_events', ['event_type' => 'RATE_LIMIT_TRIGGERED']);
    }

    public function test_backoff_progresif_boleh_akses_sebelum_batas(): void
    {
        $service = app(LoginBruteForceService::class);
        $config = config('security.login');

        $this->assertSame(0, $service->cooldownFor(4), 'Belum mencapai batas → tanpa cooldown.');
        $this->assertSame((int) $config['cooldown_short'], $service->cooldownFor(5));
        $this->assertSame((int) $config['cooldown_medium'], $service->cooldownFor(10));
        $this->assertSame((int) $config['cooldown_long'], $service->cooldownFor(15));
        $this->assertSame((int) $config['cooldown_extended'], $service->cooldownFor(20));
    }

    public function test_login_sukses_membersihkan_counter_kegagalan(): void
    {
        $this->createAdmin();

        // 4x gagal (di bawah ambang 5) — belum terkunci.
        foreach (range(1, 4) as $i) {
            $this->attempt('admin', 'salah')->assertStatus(401);
        }

        // Login benar langsung sukses & masih di bawah throttle rate.
        $this->attempt('admin', 'admin123')->assertStatus(200);

        // Counter dibersihkan → gagal berikutnya tetap 401 (bukan 429).
        $this->attempt('admin', 'salah')->assertStatus(401);
    }

    public function test_brute_force_banyak_username_dari_satu_ip_terdeteksi(): void
    {
        $this->createAdmin();

        // Probe sejumlah username berbeda dari IP yang sama.
        foreach (range(1, (int) config('security.login.max_usernames_per_ip')) as $i) {
            $this->attempt("user{$i}", 'salah')->assertStatus(401);
        }

        $this->assertDatabaseHas(
            'security_events',
            ['event_type' => 'BRUTE_FORCE_DETECTED', 'ip_address' => '127.0.0.1']
        );
    }

    public function test_login_tidak_membocorkan_keberadaan_username(): void
    {
        $this->createAdmin();

        $existing = $this->attempt('admin', 'salah')->json('message');
        $missing = $this->attempt('ghostuser', 'salah')->json('message');

        $this->assertSame($existing, $missing, 'Pesan error harus identik (anti-enumerasi).');
    }

    public function test_response_login_sukses_tidak_mengandung_password_or_token(): void
    {
        $this->createAdmin();

        $response = $this->attempt('admin', 'admin123')
            ->assertStatus(200);

        $this->assertArrayNotHasKey('password', $response->json('admin'));
        $this->assertArrayNotHasKey('token', $response->json());
        $this->assertArrayNotHasKey('access_token', $response->json());
    }
}
