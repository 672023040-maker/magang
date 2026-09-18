<?php

namespace Tests\Feature;

use App\Models\Admin;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Lapisan otorisasi & perlindungan web:
 * - endpoint admin wajib 401 tanpa login
 * - role non-admin diblokir 403
 * - CORS hanya mengizinkan origin frontend
 * - token CSRF terpasang (Sanctum cookie)
 * - ketahanan terhadap SQL injection / XSS / mass assignment
 */
class AuthorizationCsrfTest extends TestCase
{
    use RefreshDatabase;

    private function createAdmin(array $overrides = []): Admin
    {
        return Admin::query()->create(array_merge([
            'username' => 'admin',
            'password' => Hash::make('admin123'),
            'nama' => 'Admin Test',
            'role' => 'admin',
        ], $overrides));
    }

    private function adminPath(): string
    {
        return trim((string) config('security.admin_path'), '/');
    }

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

    public function test_area_admin_tanpa_login_mengembalikan_401(): void
    {
        $path = $this->adminPath();

        $this->getJson("/api/{$path}/profil")->assertStatus(401);
        $this->getJson("/api/{$path}/project")->assertStatus(401);
        $this->getJson("/api/{$path}/struktur")->assertStatus(401);
        $this->getJson("/api/{$path}/kontak")->assertStatus(401);
        $this->getJson("/api/{$path}/devices")->assertStatus(401);
        $this->putJson("/api/{$path}/password", [])->assertStatus(401);
    }

    public function test_role_non_admin_diblokir_403(): void
    {
        $this->createAdmin(['role' => 'staff']);
        $sessionId = $this->login();
        $path = $this->adminPath();

        $this->withAdminSession($sessionId)
            ->getJson("/api/{$path}/profil")
            ->assertStatus(403)
            ->assertJsonPath('message', 'Anda tidak memiliki izin.');
    }

    public function test_role_admin_dapat_mengakses_area_admin(): void
    {
        $this->createAdmin();
        $sessionId = $this->login();
        $path = $this->adminPath();

        $this->withAdminSession($sessionId)
            ->getJson("/api/{$path}/profil")
            ->assertOk();
    }

    public function test_cors_hanya_mengizinkan_origin_frontend(): void
    {
        // Origin berbahaya → tidak ada header CORS.
        $this->getJson('/api/profil', ['Origin' => 'https://evil.example'])
            ->assertHeaderMissing('Access-Control-Allow-Origin');

        // Origin frontend yang terdaftar → header CORS dikirim.
        $origin = 'http://localhost:5173';
        $this->getJson('/api/profil', ['Origin' => $origin])
            ->assertHeader('Access-Control-Allow-Origin', $origin);
    }

    public function test_csrf_token_terpasang_pada_middleware_sanctum(): void
    {
        // Sanctum mewajibkan ValidateCsrfToken untuk request stateful.
        $this->assertSame(
            ValidateCsrfToken::class,
            config('sanctum.middleware.validate_csrf_token')
        );

        // Cookie session HttpOnly + SameSite=Lax (anti-PHP session hijack/XSRF).
        $this->assertTrue((bool) config('session.http_only'));
        $this->assertSame('lax', strtolower((string) config('session.same_site')));
    }

    public function test_sql_injection_pada_login_tidak_lolos(): void
    {
        $this->createAdmin();

        $payloads = [
            ["admin' OR '1'='1", 'salah'],
            ['admin"--', 'salah'],
            ["'; DROP TABLE admins;--", 'salah'],
        ];

        foreach ($payloads as [$user, $pass]) {
            $this->postJson('/api/login', [
                'username' => $user,
                'password' => $pass,
            ])->assertStatus(401);

            // Tidak ada yang tertulis/bocor dari injeksi.
            $this->assertDatabaseCount('admins', 1);
        }
    }

    public function test_xss_tersimpan_sebagai_data_bukan_dieksekusi(): void
    {
        $this->createAdmin();
        $sessionId = $this->login();
        $path = $this->adminPath();

        $payload = '<script>alert(document.cookie)</script>';
        $this->withAdminSession($sessionId)
            ->postJson("/api/{$path}/kontak", [
                'email' => 'kontak@digfin.test',
                'phone' => '081234567890',
                'alamat' => "Jl. Test 1, RT 2 {$payload}",
            ])
            ->assertStatus(201);

        // Data tersimpan apa adanya; tidak ada field respon yang mengeksekusi.
        $raw = DB::table('kontak')->where('email', 'kontak@digfin.test')->value('alamat');
        $this->assertStringContainsString('<script>', $raw);
    }

    public function test_mass_assignment_extra_field_diabaikan(): void
    {
        $this->createAdmin();
        $sessionId = $this->login();
        $path = $this->adminPath();

        // Kirim field yang bukan milik Kontak/Project — harus diabaikan
        // karena controller hanya memakai $request->only()/validated().
        $this->withAdminSession($sessionId)
            ->postJson("/api/{$path}/kontak", [
                'email' => 'mass@digfin.test',
                'phone' => '081234567890',
                'alamat' => 'Alamat',
                'role' => 'superadmin',
                'password' => 'nembus123',
                'is_admin' => true,
                'must_change_password' => true,
                'nama' => 'Penyerang',
            ])
            ->assertStatus(201);

        $kontak = DB::table('kontak')->where('email', 'mass@digfin.test')->first();
        $this->assertNotNull($kontak);

        // Tidak ada kolom ekstra yang tersimpan sebagai bagian kontak.
        $this->assertArrayNotHasKey('role', (array) $kontak);
        $this->assertArrayNotHasKey('password', (array) $kontak);
    }

    public function test_ujung_publik_tidak_membocorkan_field_sensitif(): void
    {
        $this->createAdmin();

        // Endpoint publik boleh dipakai tanpa login.
        $response = $this->getJson('/api/profil')->assertOk();
        $content = $response->json();

        // Boleh kosong (belum ada profil), tapi kalau ada data tidak boleh
        // membocorkan field sensitive seperti password.
        if (! is_null($content['data'] ?? null)) {
            $this->assertArrayNotHasKey('password', $content['data']);
            $this->assertArrayNotHasKey('must_change_password', $content['data']);
            $this->assertArrayNotHasKey('role', $content['data']);
        }
    }
}
