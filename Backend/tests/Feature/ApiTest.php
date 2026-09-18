<?php

namespace Tests\Feature;

use App\Models\Admin;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ApiTest extends TestCase
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

    public function test_publik_endpoints_merespons(): void
    {
        $this->getJson('/api/profil')->assertOk();
        $this->getJson('/api/struktur')->assertOk();
        $this->getJson('/api/project')->assertOk();
        $this->getJson('/api/kontak')->assertOk();
    }

    public function test_login_sukses_mengembalikan_token(): void
    {
        $this->createAdmin();

        $this->from(config('app.url'))
            ->withSession([])
            ->postJson('/api/login', [
                'username' => 'admin',
                'password' => 'admin123',
            ])
            ->assertOk()
            ->assertJsonStructure(['admin' => ['username', 'nama']]);
    }

    public function test_login_gagal_mengembalikan_401(): void
    {
        $this->postJson('/api/login', [
            'username' => 'admin',
            'password' => 'salah',
        ])->assertStatus(401);
    }

    public function test_area_admin_membutuhkan_autentikasi(): void
    {
        $path = trim((string) config('security.admin_path', 'admin'), '/');

        $this->getJson("/api/{$path}/profil")->assertStatus(401);
    }

    public function test_admin_dapat_mengakses_area_admin(): void
    {
        $this->createAdmin();
        $path = trim((string) config('security.admin_path'), '/');

        // SPA nyata: stateful login dulu (membuat device session aktif di
        // tabel AdminUserSession, id sesi = hasil regenerate di controller).
        $this->from(config('app.url'))
            ->withSession([])
            ->postJson('/api/login', [
                'username' => 'admin',
                'password' => 'admin123',
            ])
            ->assertOk();

        // Request berikutnya membawa cookie session yang SAMA (persis browser
        // SPA HttpOnly). Session store singleton mempertahankan id hasil
        // regenerate → TrackAdminSession mendapati device aktif → 200.
        $sessionId = $this->app['session']->getId();
        $this->from(config('app.url'))
            ->withCredentials()
            ->withCookie(config('session.cookie'), $sessionId)
            ->getJson("/api/{$path}/profil")
            ->assertOk();
    }
}
