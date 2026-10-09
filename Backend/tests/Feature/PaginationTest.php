<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Project;
use App\Models\StrukturOrganisasi;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class PaginationTest extends TestCase
{
    use RefreshDatabase;

    private function createAdmin(): Admin
    {
        return Admin::query()->create([
            'username' => 'admin',
            'password' => Hash::make('admin123'),
            'nama' => 'Admin Test',
            'role' => 'admin',
            'must_change_password' => false,
        ]);
    }

    private function loginAndGetSessionId(): string
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

    private function adminGet(string $uri, string $sessionId)
    {
        return $this->from(config('app.url'))
            ->withCredentials()
            ->withCookie(config('session.cookie'), $sessionId)
            ->getJson($uri);
    }

    public function test_daftar_project_admin_terpaginasi(): void
    {
        $this->createAdmin();
        $sessionId = $this->loginAndGetSessionId();
        $path = trim((string) config('security.admin_path'), '/');
        $perPage = (int) config('security.admin_list_per_page');

        foreach (range(1, $perPage + 5) as $i) {
            Project::query()->create([
                'nama_project' => "Project {$i}",
                'deskripsi' => 'Deskripsi project.',
                'status' => 'publish',
            ]);
        }

        // Halaman 1: tepat sejumlah per_page, ada meta paginasi.
        $this->adminGet("/api/{$path}/project", $sessionId)
            ->assertOk()
            ->assertJsonCount($perPage, 'data')
            ->assertJsonPath('meta.current_page', 1)
            ->assertJsonPath('meta.per_page', $perPage)
            ->assertJsonPath('meta.total', $perPage + 5)
            ->assertJsonPath('meta.last_page', 2);

        // Halaman 2: sisa 5 baris.
        $this->adminGet("/api/{$path}/project?page=2", $sessionId)
            ->assertOk()
            ->assertJsonCount(5, 'data')
            ->assertJsonPath('meta.current_page', 2);
    }

    public function test_daftar_struktur_admin_terpaginasi(): void
    {
        $this->createAdmin();
        $sessionId = $this->loginAndGetSessionId();
        $path = trim((string) config('security.admin_path'), '/');
        $perPage = (int) config('security.admin_list_per_page');

        foreach (range(1, $perPage + 3) as $i) {
            StrukturOrganisasi::query()->create([
                'nama' => "Anggota {$i}",
                'jabatan' => 'Staff',
            ]);
        }

        $this->adminGet("/api/{$path}/struktur", $sessionId)
            ->assertOk()
            ->assertJsonCount($perPage, 'data')
            ->assertJsonPath('meta.total', $perPage + 3)
            ->assertJsonPath('meta.last_page', 2);
    }

    public function test_endpoint_publik_tetap_mengembalikan_seluruh_project_publish(): void
    {
        // Paginasi hanya untuk daftar admin; landing page tetap menerima
        // seluruh project publish tanpa terbungkus meta.
        $perPage = (int) config('security.admin_list_per_page');

        foreach (range(1, $perPage + 4) as $i) {
            Project::query()->create([
                'nama_project' => "Publik {$i}",
                'deskripsi' => 'Deskripsi.',
                'status' => 'publish',
            ]);
        }

        $this->getJson('/api/project')
            ->assertOk()
            ->assertJsonCount($perPage + 4, 'data')
            ->assertJsonMissingPath('meta');
    }
}
