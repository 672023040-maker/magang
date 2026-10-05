<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\DokumentasiProject;
use App\Models\Project;
use App\Models\StrukturOrganisasi;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * Penghapusan data lewat HTTP pada area admin.
 *
 * Alur ini sebelumnya tidak pernah diuji end-to-end: test yang ada hanya
 * memanggil Model::delete() langsung, sehingga tidak ada jaminan bahwa
 * route DELETE + middleware-nya benar-benar bisa dipakai panel admin.
 */
class AdminDeleteTest extends TestCase
{
    use RefreshDatabase;

    private function createAdmin(string $role = 'admin'): Admin
    {
        return Admin::query()->create([
            'username' => 'admin',
            'password' => Hash::make('admin123'),
            'nama' => 'Admin Test',
            'role' => $role,
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
    private function login(string $username = 'admin', string $password = 'admin123'): string
    {
        $this->from(config('app.url'))
            ->withSession([])
            ->postJson('/api/login', [
                'username' => $username,
                'password' => $password,
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

    public function test_hapus_anggota_struktur_lewat_http(): void
    {
        Storage::fake('public');

        $this->createAdmin();
        $sessionId = $this->login();
        $path = $this->adminPath();

        Storage::disk('public')->put('struktur/foto.jpg', 'isi');
        $anggota = StrukturOrganisasi::query()->create([
            'nama' => 'Budi Santoso',
            'jabatan' => 'Direktur Utama',
            'foto' => 'struktur/foto.jpg',
        ]);

        $this->withAdminSession($sessionId)
            ->deleteJson("/api/{$path}/struktur/{$anggota->id}")
            ->assertOk()
            ->assertJsonPath('message', 'Data struktur berhasil dihapus');

        $this->assertDatabaseMissing('struktur_organisasi', ['id' => $anggota->id]);

        // Berkas fisik harus ikut hilang, bukan jadi sampah di storage.
        Storage::disk('public')->assertMissing('struktur/foto.jpg');
    }

    public function test_hapus_project_lewat_http(): void
    {
        Storage::fake('public');

        $this->createAdmin();
        $sessionId = $this->login();
        $path = $this->adminPath();

        Storage::disk('public')->put('dokumentasi/sampul.jpg', 'isi');
        $project = Project::query()->create([
            'nama_project' => 'Integrasi QRIS',
            'deskripsi' => 'Project yang akan dihapus.',
            'status' => 'publish',
        ]);
        DokumentasiProject::query()->create([
            'project_id' => $project->id,
            'file_gambar' => 'dokumentasi/sampul.jpg',
        ]);

        $this->withAdminSession($sessionId)
            ->deleteJson("/api/{$path}/project/{$project->id}")
            ->assertOk()
            ->assertJsonPath('message', 'Project berhasil dihapus');

        $this->assertDatabaseMissing('project', ['id' => $project->id]);
        $this->assertDatabaseMissing('dokumentasi_project', ['project_id' => $project->id]);
        Storage::disk('public')->assertMissing('dokumentasi/sampul.jpg');

        // Jejak audit wajib tercatat untuk kejadian yang merusak data.
        $this->assertDatabaseHas('security_events', [
            'event_type' => 'PROJECT_DELETED',
        ]);
    }

    public function test_project_yang_dihapus_terlihat_hilang_di_endpoint_publik(): void
    {
        $this->createAdmin();
        $sessionId = $this->login();
        $path = $this->adminPath();

        Project::query()->create([
            'nama_project' => 'Project Lama',
            'deskripsi' => 'Akan dihapus.',
            'status' => 'publish',
        ]);

        $this->withAdminSession($sessionId)
            ->deleteJson("/api/{$path}/project/1")
            ->assertOk();

        $this->getJson('/api/project')
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_hapus_anggota_yang_menjadi_author_menurismoi_project(): void
    {
        // author_id memakai ON DELETE SET NULL. Kalau salah konfigurasi,
        // menghapus anggota tim akan ikut menghapus project miliknya.
        $this->createAdmin();
        $sessionId = $this->login();
        $path = $this->adminPath();

        $author = StrukturOrganisasi::query()->create([
            'nama' => 'Anggota Sementara',
            'jabatan' => 'Staff',
        ]);
        $project = Project::query()->create([
            'nama_project' => 'Project Milik Anggota',
            'deskripsi' => 'Tidak boleh ikut terhapus.',
            'status' => 'publish',
            'author_id' => $author->id,
        ]);

        $this->withAdminSession($sessionId)
            ->deleteJson("/api/{$path}/struktur/{$author->id}")
            ->assertOk();

        $this->assertDatabaseHas('project', [
            'id' => $project->id,
            'author_id' => null,
        ]);
    }

    public function test_hapus_id_yang_tidak_ada_mengembalikan_404(): void
    {
        $this->createAdmin();
        $sessionId = $this->login();
        $path = $this->adminPath();

        $this->withAdminSession($sessionId)
            ->deleteJson("/api/{$path}/project/9999")
            ->assertNotFound();

        $this->withAdminSession($sessionId)
            ->deleteJson("/api/{$path}/struktur/9999")
            ->assertNotFound();
    }

    public function test_hapus_membutuhkan_autentikasi(): void
    {
        $path = $this->adminPath();

        Project::query()->create([
            'nama_project' => 'Project Terlindungi',
            'deskripsi' => 'Tidak boleh terhapus tanpa login.',
            'status' => 'publish',
        ]);

        $this->deleteJson("/api/{$path}/project/1")->assertStatus(401);
        $this->assertDatabaseHas('project', ['id' => 1]);
    }

    public function test_hapus_membutuhkan_peran_admin(): void
    {
        $this->createAdmin('staff');
        $sessionId = $this->login();
        $path = $this->adminPath();

        $project = Project::query()->create([
            'nama_project' => 'Project Terlindungi',
            'deskripsi' => 'Staff tidak boleh menghapus.',
            'status' => 'publish',
        ]);

        $this->withAdminSession($sessionId)
            ->deleteJson("/api/{$path}/project/{$project->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('project', ['id' => $project->id]);
    }

    public function test_hapus_ditolak_selama_password_belum_diubah(): void
    {
        $admin = Admin::query()->create([
            'username' => 'admin',
            'password' => Hash::make('admin123'),
            'nama' => 'Admin Test',
            'role' => 'admin',
            'must_change_password' => true,
        ]);

        $sessionId = $this->login();
        $path = $this->adminPath();

        $project = Project::query()->create([
            'nama_project' => 'Project Terkunci',
            'deskripsi' => 'Tidak boleh terhapus sebelum ganti password.',
            'status' => 'publish',
        ]);

        $this->withAdminSession($sessionId)
            ->deleteJson("/api/{$path}/project/{$project->id}")
            ->assertForbidden();

        $this->assertNotNull($admin->refresh()->must_change_password);
        $this->assertDatabaseHas('project', ['id' => $project->id]);
    }
}
