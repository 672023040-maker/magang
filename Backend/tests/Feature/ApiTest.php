<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Kontak;
use App\Models\Profil;
use App\Models\Project;
use App\Models\StrukturOrganisasi;
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

    public function test_publik_endpoints_merespons(): void
    {
        $this->getJson('/api/profil')->assertOk();
        $this->getJson('/api/struktur')->assertOk();
        $this->getJson('/api/project')->assertOk();
        $this->getJson('/api/kontak')->assertOk();
    }

    public function test_endpoint_publik_hanya_menampilkan_project_publish(): void
    {
        $publish = Project::query()->create([
            'nama_project' => 'Tampil',
            'deskripsi' => 'Project publish.',
            'status' => 'publish',
        ]);

        Project::query()->create([
            'nama_project' => 'Draft',
            'deskripsi' => 'Project unpublish — draft internal.',
            'status' => 'unpublish',
        ]);

        // Landing page TIDAK boleh membocorkan draft (unpublish).
        $this->getJson('/api/project')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.nama_project', $publish->nama_project);
    }

    public function test_endpoint_admin_menampilkan_seluruh_project_termasuk_draft(): void
    {
        $this->createAdmin();
        $path = trim((string) config('security.admin_path'), '/');

        Project::query()->create([
            'nama_project' => 'Draft A',
            'deskripsi' => 'Draft.',
            'status' => 'unpublish',
        ]);
        Project::query()->create([
            'nama_project' => 'Publish B',
            'deskripsi' => 'Publish.',
            'status' => 'publish',
        ]);

        $this->login();
        $sessionId = $this->app['session']->getId();

        // Panel admin butuh melihat draft juga (tolak ukur CRUD).
        $this->from(config('app.url'))
            ->withCredentials()
            ->withCookie(config('session.cookie'), $sessionId)
            ->getJson("/api/{$path}/project")
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_flag_bulat_profil_tersimpan_dan_tampil_di_endpoint_publik(): void
    {
        $this->createAdmin();
        $path = trim((string) config('security.admin_path'), '/');

        Profil::query()->create([
            'visi' => 'Visi kami.',
            'misi' => "Misi satu\nMisi dua.",
            'tujuan' => 'Tujuan kami.',
        ]);

        $this->login();
        $sessionId = $this->app['session']->getId();

        $this->from(config('app.url'))
            ->withCredentials()
            ->withCookie(config('session.cookie'), $sessionId)
            ->putJson("/api/{$path}/profil", [
                'visi' => 'Visi kami.',
                'misi' => "Misi satu\nMisi dua.",
                'tujuan' => 'Tujuan kami.',
                'visi_bulat' => false,
                'misi_bulat' => true,
                'tujuan_bulat' => true,
            ])
            ->assertOk()
            ->assertJsonPath('data.visi_bulat', false)
            ->assertJsonPath('data.misi_bulat', true)
            ->assertJsonPath('data.tujuan_bulat', true);

        $this->assertDatabaseHas('profil', [
            'misi_bulat' => true,
            'tujuan_bulat' => true,
        ]);

        // Landing page membaca endpoint yang sama — flag harus ikut tersedia.
        $this->getJson('/api/profil')
            ->assertOk()
            ->assertJsonPath('data.misi_bulat', true);
    }

    public function test_update_project_tanpa_file_baru_menjaga_dokumentasi_lama(): void
    {
        $this->createAdmin();
        $path = trim((string) config('security.admin_path'), '/');
        $project = Project::query()->create([
            'nama_project' => 'Awal',
            'deskripsi' => 'Deskripsi awal.',
            'status' => 'publish',
        ]);
        $project->dokumentasi()->create(['file_gambar' => 'dokumentasi/lama.jpg']);

        $this->login();
        $sessionId = $this->app['session']->getId();

        // Update hanya teks — dokumentasi lama harus tetap utuh.
        $this->from(config('app.url'))
            ->withCredentials()
            ->withCookie(config('session.cookie'), $sessionId)
            ->putJson("/api/{$path}/project/{$project->id}", [
                'nama_project' => 'Awal (diubah)',
                'deskripsi' => 'Deskripsi baru.',
                'status' => 'publish',
            ])
            ->assertOk();

        $this->assertDatabaseHas('dokumentasi_project', [
            'project_id' => $project->id,
            'file_gambar' => 'dokumentasi/lama.jpg',
        ]);
    }

    public function test_endpoint_kontak_tidak_lagi_mengekspos_sosial_media(): void
    {
        // Fitur sosial media sudah dihapus; kontak kini hanya menyimpan email.
        // Kontrak API harus ikut menyusut, bukan sekadar disembunyikan di UI.
        Kontak::query()->create(['email' => 'halo@digfin.test']);

        $data = $this->getJson('/api/kontak')->assertOk()->json('data');

        $this->assertSame('halo@digfin.test', $data['email']);
        $this->assertArrayNotHasKey('sosial_media', $data);
    }

    public function test_email_kontak_yang_diubah_admin_tampil_di_endpoint_publik(): void
    {
        $this->createAdmin();
        $path = trim((string) config('security.admin_path'), '/');
        $kontak = Kontak::query()->create(['email' => 'lama@digfin.test']);

        $this->from(config('app.url'))
            ->withSession([])
            ->postJson('/api/login', [
                'username' => 'admin',
                'password' => 'admin123',
            ])
            ->assertOk();

        $sessionId = $this->app['session']->getId();
        $this->from(config('app.url'))
            ->withCredentials()
            ->withCookie(config('session.cookie'), $sessionId)
            ->putJson("/api/{$path}/kontak/{$kontak->id}", ['email' => 'baru@digfin.test'])
            ->assertOk();

        // Landing page membaca endpoint ini — perubahan admin harus terlihat.
        $this->getJson('/api/kontak')
            ->assertOk()
            ->assertJsonPath('data.email', 'baru@digfin.test');
    }

    public function test_project_boleh_disimpan_tanpa_author(): void
    {
        $this->createAdmin();
        $path = trim((string) config('security.admin_path'), '/');

        $this->login();
        $sessionId = $this->app['session']->getId();

        $this->from(config('app.url'))
            ->withCredentials()
            ->withCookie(config('session.cookie'), $sessionId)
            ->postJson("/api/{$path}/project", [
                'nama_project' => 'Tanpa Author',
                'deskripsi' => 'Project tanpa author.',
                'status' => 'publish',
            ])
            ->assertStatus(201)
            ->assertJsonPath('data.author', null);
    }

    public function test_author_id_harus_merujuk_anggota_yang_ada(): void
    {
        $this->createAdmin();
        $path = trim((string) config('security.admin_path'), '/');

        $this->login();
        $sessionId = $this->app['session']->getId();

        $this->from(config('app.url'))
            ->withCredentials()
            ->withCookie(config('session.cookie'), $sessionId)
            ->postJson("/api/{$path}/project", [
                'nama_project' => 'Author Hantu',
                'deskripsi' => 'author_id menunjuk anggota yang tidak ada.',
                'status' => 'publish',
                'author_id' => 9999,
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('author_id');
    }

    public function test_author_project_tampil_di_endpoint_publik(): void
    {
        $this->createAdmin();
        $path = trim((string) config('security.admin_path'), '/');
        $author = StrukturOrganisasi::query()->create([
            'nama' => 'Budi Santoso',
            'jabatan' => 'Direktur Utama',
        ]);

        $this->login();
        $sessionId = $this->app['session']->getId();

        $this->from(config('app.url'))
            ->withCredentials()
            ->withCookie(config('session.cookie'), $sessionId)
            ->postJson("/api/{$path}/project", [
                'nama_project' => 'Flearn',
                'deskripsi' => 'Sistem pembelajaran.',
                'status' => 'publish',
                'author_id' => $author->id,
            ])
            ->assertStatus(201);

        // Landing page membaca endpoint ini; author harus ikut terbawa.
        $this->getJson('/api/project')
            ->assertOk()
            ->assertJsonPath('data.0.author.nama', 'Budi Santoso')
            ->assertJsonPath('data.0.author.jabatan', 'Direktur Utama');
    }

    public function test_hapus_anggota_struktur_tidak_menghapus_projectnya(): void
    {
        // author_id memakai ON DELETE SET NULL, bukan CASCADE. Kalau salah
        // konfigurasi, menghapus anggota tim akan ikut menghapus project.
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

        $author->delete();

        $this->assertDatabaseHas('project', [
            'id' => $project->id,
            'author_id' => null,
        ]);

        $this->getJson('/api/project')
            ->assertOk()
            ->assertJsonPath('data.0.author', null);
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
