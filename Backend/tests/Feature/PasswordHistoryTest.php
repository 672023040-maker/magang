<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\AdminUserSession;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

/**
 * Kebijakan & riwayat password:
 * - aturan kekuatan password (min 12, campuran huruf/angka/simbol)
 * - paksaan ganti password awal (must_change_password)
 * - larangan memakai ulang password yang pernah dipakai
 * - pencabutan perangkat lain saat password diganti
 */
class PasswordHistoryTest extends TestCase
{
    use RefreshDatabase;

    private const STRONG_PASSWORD = 'Baru@2026#Aman';

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

    private function changePassword(string $sessionId, string $current, string $new): TestResponse
    {
        $path = $this->adminPath();

        return $this->withAdminSession($sessionId)
            ->putJson("/api/{$path}/password", [
                'current_password' => $current,
                'new_password' => $new,
                'new_password_confirmation' => $new,
            ]);
    }

    public function test_password_lemah_ditolak_oleh_validasi(): void
    {
        $this->createAdmin();
        $sessionId = $this->login();

        // Terlalu pendek + tanpa simbol/angka.
        $this->changePassword($sessionId, 'admin123', 'password')
            ->assertStatus(422);
    }

    public function test_password_tidak_sesuai_policy_ditolak(): void
    {
        $this->createAdmin();
        $sessionId = $this->login();

        // Cukup panjang tapi tanpa huruf kapital & angka.
        $this->changePassword($sessionId, 'admin123', 'passwordabcdef')
            ->assertStatus(422);
    }

    public function test_ganti_password_sukses(): void
    {
        $this->createAdmin();
        $sessionId = $this->login();

        $this->changePassword($sessionId, 'admin123', self::STRONG_PASSWORD)
            ->assertOk()
            ->assertJsonPath('message', 'Password berhasil diganti. Seluruh perangkat lain telah di-logout.');

        $this->assertTrue(Hash::check(self::STRONG_PASSWORD, Admin::first()->password));
        $this->assertFalse((bool) Admin::first()->must_change_password);

        // History mencatat password lama + baru.
        $hashes = DB::table('admin_password_history')->pluck('password_hash')->all();
        $this->assertCount(2, $hashes);
    }

    public function test_password_lama_tidak_bisa_dipakai_ulang(): void
    {
        $this->createAdmin();
        $sessionId = $this->login();

        $lama = 'Lama@2026#Aman';
        $baru = 'Baru@2026#Aman';

        // Ubah dua kali; password "lama" kini ada di history.
        $this->changePassword($sessionId, 'admin123', $lama)->assertOk();
        $this->changePassword($sessionId, $lama, $baru)->assertOk();

        // Coba pakai lagi password lama yang pernah dipakai (tercatat di history).
        $this->changePassword($sessionId, $baru, $lama)
            ->assertStatus(422)
            ->assertJsonPath('message', 'Password baru tidak boleh sama dengan password yang pernah digunakan sebelumnya.');
    }

    public function test_must_change_password_memblokir_crud_tapi_mengizinkan_ganti_password(): void
    {
        $admin = $this->createAdmin(['must_change_password' => true]);
        $sessionId = $this->login();
        $path = $this->adminPath();

        // CRUD diblokir sementara.
        $this->withAdminSession($sessionId)
            ->getJson("/api/{$path}/profil")
            ->assertStatus(403)
            ->assertJsonPath('message', 'Anda harus mengganti password sebelum melanjutkan.');

        $this->withAdminSession($sessionId)
            ->postJson("/api/{$path}/project", [
                'nama_project' => 'X',
                'deskripsi' => 'D',
                'status' => 'unpublish',
            ])
            ->assertStatus(403);

        // Endpoint ganti-password tetap boleh.
        $this->changePassword($sessionId, 'admin123', self::STRONG_PASSWORD)->assertOk();

        // Setelah ganti password, blokir dicabut.
        $this->withAdminSession($sessionId)
            ->getJson("/api/{$path}/profil")
            ->assertStatus(200);

        $this->assertFalse((bool) Admin::find($admin->id)->must_change_password);
    }

    public function test_ganti_password_mencabut_perangkat_lain(): void
    {
        $admin = $this->createAdmin();
        $current = $this->login();
        $other = $this->login(); // perangkat kedua (row session auto-terbuat saat login)

        $this->assertSame(2, AdminUserSession::query()->whereNull('revoked_at')->count());

        $this->changePassword($current, 'admin123', self::STRONG_PASSWORD)->assertOk();

        // Perangkat lain dicabut, sesi saat ini tetap aktif.
        $otherRow = AdminUserSession::where('session_id', $other)->firstOrFail();
        $this->assertNotNull($otherRow->revoked_at);

        $currentRow = AdminUserSession::where('session_id', $current)->firstOrFail();
        $this->assertNull($currentRow->revoked_at);
    }

    public function test_response_tidak_mengekspos_password(): void
    {
        $this->createAdmin();
        $sessionId = $this->login();

        $response = $this->changePassword($sessionId, 'admin123', self::STRONG_PASSWORD)->assertOk();
        $this->assertArrayNotHasKey('password', $response->json());
    }
}
