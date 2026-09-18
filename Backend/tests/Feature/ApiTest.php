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

        $this->postJson('/api/login', [
            'username' => 'admin',
            'password' => 'admin123',
        ])->assertOk()
            ->assertJsonStructure(['token', 'admin' => ['username', 'nama']]);
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
        $this->getJson('/api/admin/profil')->assertStatus(401);
    }

    public function test_admin_dapat_mengakses_area_admin(): void
    {
        $admin = $this->createAdmin();
        $token = $admin->createToken('admin-token')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/admin/profil')
            ->assertOk();
    }
}
