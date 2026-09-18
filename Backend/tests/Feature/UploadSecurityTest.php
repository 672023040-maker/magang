<?php

namespace Tests\Feature;

use App\Exceptions\UploadRejectedException;
use App\Models\Admin;
use App\Models\Project;
use App\Services\Upload\SecureImageService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * Jaminan bahwa seluruh lapisan upload security SERVER-side bekerja, dan
 * bahwa frontend/React tidak dipercaya (semua validasi diulang di Laravel).
 */
class UploadSecurityTest extends TestCase
{
    use RefreshDatabase;

    private function jpegBytes(int $width = 16, int $height = 16): string
    {
        $img = imagecreatetruecolor($width, $height);
        imagefilledrectangle($img, 0, 0, $width - 1, $height - 1, imagecolorallocate($img, 200, 30, 30));

        ob_start();
        imagejpeg($img, null, 85);
        $bytes = (string) ob_get_clean();
        imagedestroy($img);

        return $bytes;
    }

    private function uploaded(string $name, string $content): UploadedFile
    {
        return UploadedFile::fake()->createWithContent($name, $content);
    }

    private function service(): SecureImageService
    {
        return app(SecureImageService::class);
    }

    private function createAdmin(): Admin
    {
        return Admin::query()->create([
            'username' => 'admin',
            'password' => Hash::make('admin123'),
            'nama' => 'Admin Test',
            'role' => 'admin',
        ]);
    }

    public function test_jpeg_valid_tersimpan_aman_dengan_nama_random(): void
    {
        Storage::fake('public');

        $path = $this->service()->sanitizeAndStore($this->uploaded('foto.jpg', $this->jpegBytes()), 'dokumentasi', 'public');

        $this->assertStringEndsWith('.jpg', $path);
        $this->assertMatchesRegularExpression('#^dokumentasi/[0-9a-f-]{36}\.jpg$#', $path);
        $this->assertNotEquals('foto.jpg', basename($path), 'Nama asli file tidak boleh dipakai.');
        $this->assertTrue(Storage::disk('public')->exists($path));
        $this->assertTrue(Storage::disk('public')->has($path));
    }

    public function test_jpeg_disimpan_ulang_dengan_metadata_dibuang(): void
    {
        Storage::fake('public');

        // Sisipkan payload/metadata tambahan: re-encode wajib membuangnya
        // sehingga hasil tersimpan berbeda dari input dan tetap JPEG valid.
        $original = $this->jpegBytes().'GARBAGE-METADATA-TO-STRIP';
        $path = $this->service()->sanitizeAndStore($this->uploaded('foto.jpg', $original), 'dokumentasi', 'public');

        $stored = Storage::disk('public')->get($path);
        $this->assertNotSame($original, $stored, 'File harus di-re-encode ulang agar payload asing hilang.');
        $this->assertStringStartsWith("\xFF\xD8\xFF", (string) $stored, 'Hasil re-encode harus tetap JPEG asli.');
        $this->assertStringNotContainsString('GARBAGE-METADATA', (string) $stored);
    }

    public function test_png_ditolak(): void
    {
        Storage::fake('public');

        $png = $this->uploaded('gambar.png', 'x'.base64_decode('iVBORw0KGgo='));
        $this->expectException(UploadRejectedException::class);
        $this->service()->sanitizeAndStore($png, 'dokumentasi', 'public');
    }

    public function test_gif_ditolak(): void
    {
        Storage::fake('public');

        $gif = $this->uploaded('animasi.gif', 'GIF89a'.str_repeat('A', 64));
        $this->expectException(UploadRejectedException::class);
        $this->service()->sanitizeAndStore($gif, 'dokumentasi', 'public');
    }

    public function test_webp_ditolak(): void
    {
        Storage::fake('public');

        $webp = $this->uploaded('gambar.webp', 'RIFF'.str_repeat('A', 8).'WEBP'.str_repeat('B', 8));
        $this->expectException(UploadRejectedException::class);
        $this->service()->sanitizeAndStore($webp, 'dokumentasi', 'public');
    }

    public function test_svg_ditolak(): void
    {
        Storage::fake('public');

        $svg = $this->uploaded('gambar.svg', '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');
        $this->expectException(UploadRejectedException::class);
        $this->service()->sanitizeAndStore($svg, 'dokumentasi', 'public');
    }

    public function test_php_berkedok_jpg_ditolak(): void
    {
        Storage::fake('public');

        $php = $this->uploaded('webshell.jpg', "<?php system('id'); ?>");
        try {
            $this->service()->sanitizeAndStore($php, 'dokumentasi', 'public');
            $this->fail('PHP berkedok JPG harus ditolak.');
        } catch (UploadRejectedException $e) {
            $this->assertStringContainsString('jpeg', strtolower($e->getMessage()));
        }
    }

    public function test_exe_ditolak(): void
    {
        Storage::fake('public');

        $exe = $this->uploaded('virus.jpg', 'MZ'.str_repeat("\x00", 128));
        $this->expectException(UploadRejectedException::class);
        $this->service()->sanitizeAndStore($exe, 'dokumentasi', 'public');
    }

    public function test_jpeg_dengan_ekstensi_salah_ditolak(): void
    {
        Storage::fake('public');

        // Konten valid JPEG tapi ekstensi .png → lapisan extension menolak.
        $mismatch = $this->uploaded('foto.png', $this->jpegBytes());
        $this->expectException(UploadRejectedException::class);
        $this->service()->sanitizeAndStore($mismatch, 'dokumentasi', 'public');
    }

    public function test_double_extension_ditolak(): void
    {
        Storage::fake('public');

        foreach (['foto.jpg.php', 'foto.php.jpg', 'foto.jpg.phtml'] as $name) {
            try {
                $this->service()->sanitizeAndStore($this->uploaded($name, $this->jpegBytes()), 'dokumentasi', 'public');
                $this->fail("Nama file berbahaya harus ditolak: {$name}");
            } catch (UploadRejectedException $e) {
                $this->assertNotEmpty($e->getMessage());
            }
        }
    }

    public function test_filename_null_byte_ditolak(): void
    {
        Storage::fake('public');

        $weird = $this->uploaded("foto\x00.jpg", $this->jpegBytes());
        $this->expectException(UploadRejectedException::class);
        $this->service()->sanitizeAndStore($weird, 'dokumentasi', 'public');
    }

    public function test_corrupt_jpeg_ditolak(): void
    {
        Storage::fake('public');

        // Header JPEG valid tapi tidak bisa didecode → harus ditolak.
        $corrupt = $this->uploaded('rusak.jpg', "\xFF\xD8\xFF".str_repeat('X', 256));
        $this->expectException(UploadRejectedException::class);
        $this->service()->sanitizeAndStore($corrupt, 'dokumentasi', 'public');
    }

    public function test_dimensi_melebihi_batas_ditolak(): void
    {
        Storage::fake('public');

        $oversized = $this->uploaded('gede.jpg', $this->jpegBytes(6001, 8));
        try {
            $this->service()->sanitizeAndStore($oversized, 'dokumentasi', 'public');
            $this->fail('Dimensi melebihi batas harus ditolak.');
        } catch (UploadRejectedException $e) {
            $this->assertStringContainsString('Dimensi', $e->getMessage());
        }
    }

    public function test_ukuran_melebihi_batas_ditolak(): void
    {
        Storage::fake('public');
        config(['security.upload.max_size' => 1]); // 1 KB

        $big = $this->uploaded('besar.jpg', $this->jpegBytes(300, 300));
        try {
            $this->service()->sanitizeAndStore($big, 'dokumentasi', 'public');
            $this->fail('Ukuran melebihi batas harus ditolak.');
        } catch (UploadRejectedException $e) {
            $this->assertStringContainsString('Ukuran', $e->getMessage());
        }
    }

    public function test_payload_tambahan_dihilangkan_saat_reencode(): void
    {
        Storage::fake('public');

        // Polyglot: file JPEG valid yang disisipi script di belakang data.
        // Pipeline harus membuangnya saat re-encode sehingga file tersimpan bersih.
        $payload = $this->jpegBytes()."<script>alert('xss')</script><?php echo 'pwned'; ?>";
        $path = $this->service()->sanitizeAndStore($this->uploaded('polyglot.jpg', $payload), 'dokumentasi', 'public');

        $stored = (string) Storage::disk('public')->get($path);
        $this->assertStringNotContainsString('script', strtolower($stored));
        $this->assertStringNotContainsString('pwned', $stored);
        $this->assertStringStartsWith("\xFF\xD8\xFF", $stored);
    }

    public function test_endpoint_upload_hanya_untuk_admin_terautentikasi(): void
    {
        $path = trim((string) config('security.admin_path'), '/');

        // Tanpa login → 401 (auth:admin).
        $anonymous = $this->uploaded('foto.jpg', $this->jpegBytes());
        $this->post("/api/{$path}/project", [
            'nama_project' => 'X',
            'deskripsi' => 'D',
            'status' => 'berjalan',
            'dokumentasi' => [
                ['file_gambar' => $anonymous, 'keterangan' => 'k'],
            ],
        ])->assertStatus(401);
    }

    public function test_endpoint_upload_project_berhasil_menyimpan(): void
    {
        Storage::fake('public');
        $this->createAdmin();
        $path = trim((string) config('security.admin_path'), '/');

        $this->from(config('app.url'))
            ->withSession([])
            ->postJson('/api/login', [
                'username' => 'admin',
                'password' => 'admin123',
            ])
            ->assertOk();

        $sessionId = $this->app['session']->getId();

        $file = $this->uploaded('foto.jpg', $this->jpegBytes());

        $this->from(config('app.url'))
            ->withCookie(config('session.cookie'), $sessionId)
            ->post("/api/{$path}/project", [
                'nama_project' => 'Project Tes Upload',
                'deskripsi' => 'Deskripsi',
                'status' => 'berjalan',
                'dokumentasi' => [
                    ['file_gambar' => $file, 'keterangan' => 'Sampul'],
                ],
            ])
            ->assertStatus(201)
            ->assertJsonPath('data.dokumentasi.0.keterangan', 'Sampul');

        $project = Project::query()->first();
        $this->assertNotNull($project);
        $dbPath = $project->dokumentasi()->first()->file_gambar;
        $this->assertMatchesRegularExpression('#^dokumentasi/[0-9a-f-]{36}\.jpg$#', $dbPath);
        $this->assertTrue(Storage::disk('public')->exists($dbPath), 'File fisik harus benar-benar tersimpan.');
    }

    public function test_endpoint_logging_upload_tidak_menyimpan_password(): void
    {
        Storage::fake('public');
        $this->createAdmin();
        $path = trim((string) config('security.admin_path'), '/');

        $this->from(config('app.url'))
            ->withSession([])
            ->postJson('/api/login', [
                'username' => 'admin',
                'password' => 'admin123',
            ])
            ->assertOk();

        $sessionId = $this->app['session']->getId();

        // Kirim file asli + sisipan password di payload. Logging event tidak
        // boleh membocorkan password apa pun ke tabel security_events.
        $file = $this->uploaded('foto.jpg', $this->jpegBytes());

        $this->from(config('app.url'))
            ->withCookie(config('session.cookie'), $sessionId)
            ->post("/api/{$path}/project", [
                'nama_project' => 'Project Tes Upload',
                'deskripsi' => 'Deskripsi',
                'status' => 'berjalan',
                'password' => 'rahasia-super-sekali',
                'dokumentasi' => [
                    ['file_gambar' => $file, 'keterangan' => 'Sampul'],
                ],
            ])
            ->assertStatus(201);

        $this->assertDatabaseHas('security_events', ['event_type' => 'UPLOAD_SUCCESS']);

        // Tidak ada password yang tersimpan sebagai metadata event.
        $this->assertDatabaseMissing('security_events', ['metadata' => 'rahasia-super-sekali']);

        $raw = (string) DB::table('security_events')->get()->toJson();
        $this->assertStringNotContainsString('rahasia-super-sekali', $raw);
    }
}
