<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\DokumentasiProject;
use App\Models\Kontak;
use App\Models\Profil;
use App\Models\Project;
use App\Models\SosialMedia;
use App\Models\StrukturOrganisasi;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DigitalFintechSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedAdmin();
        $this->seedProfil();
        $this->seedStruktur();
        $this->seedProject();
        $this->seedKontak();
    }

    private function seedAdmin(): void
    {
        // Sekali dibuat, password default TIDAK boleh diketahui siapa pun.
        // Gunakan password acak + must_change_password = true sehingga login
        // pertama di-paksa ganti password. Kredensial awal diatur via:
        //     php artisan digfin:init-admin <username>
        Admin::query()->firstOrCreate(
            ['username' => 'admin'],
            [
                'password' => Hash::make(Str::password(20)),
                'nama' => 'Admin DIGIFIN',
                'role' => 'admin',
                'must_change_password' => true,
            ]
        );
    }

    private function seedProfil(): void
    {
        Profil::query()->firstOrCreate(['id' => 1], [
            'visi' => 'Menjadi perusahaan fintech digital terdepan di Indonesia yang memberdayakan masyarakat melalui teknologi keuangan.',
            'misi' => '1. Menyediakan layanan keuangan digital yang mudah diakses.\n2. Mendorong inklusi keuangan bagi seluruh lapisan masyarakat.\n3. Menjaga keamanan dan kepercayaan pengguna.\n4. Berinovasi secara berkelanjutan di bidang teknologi keuangan.',
            'tujuan' => 'Mendukung transformasi digital UKSW melalui pengembangan dan pemanfaatan teknologi informasi serta inovasi layanan digital yang efektif, terintegrasi, dan berkelanjutan.',
        ]);
    }

    private function seedStruktur(): void
    {
        StrukturOrganisasi::query()->create([
            'nama' => 'Budi Santoso',
            'jabatan' => 'Direktur Utama',
            'foto' => null,
        ]);

        StrukturOrganisasi::query()->create([
            'nama' => 'Siti Rahayu',
            'jabatan' => 'Direktur Operasional',
            'foto' => null,
        ]);
    }

    private function seedProject(): void
    {
        $projectSelesai = Project::query()->create([
            'nama_project' => 'Pengembangan Platform Mobile Banking',
            'deskripsi' => 'Membangun platform perbankan digital yang responsif dengan fitur transfer, pembayaran, dan manajemen akun.',
            'status' => 'selesai',
            'tgl_dibuat' => now()->subMonths(6)->toDateString(),
        ]);

        DokumentasiProject::query()->create([
            'project_id' => $projectSelesai->id,
            'file_gambar' => $this->ensurePlaceholderJpeg('dokumentasi/mobile-banking.jpg'),
            'keterangan' => 'Tampilan antarmuka utama platform mobile banking.',
        ]);

        $projectBerjalan = Project::query()->create([
            'nama_project' => 'Integrasi Pembayaran QRIS',
            'deskripsi' => 'Mengintegrasikan sistem pembayaran QRIS agar pengguna dapat bertransaksi di berbagai merchant secara praktis.',
            'status' => 'berjalan',
            'tgl_dibuat' => now()->subMonth()->toDateString(),
        ]);

        DokumentasiProject::query()->create([
            'project_id' => $projectBerjalan->id,
            'file_gambar' => $this->ensurePlaceholderJpeg('dokumentasi/qris-integration.jpg'),
            'keterangan' => 'Proses pengujian integrasi pembayaran QRIS.',
        ]);
    }

    /**
     * Sediakan gambar placeholder JPEG asli (bukan referensi 404) untuk
     * dokumentasi project. Dibuat hanya bila belum ada di disk publik.
     */
    private function ensurePlaceholderJpeg(string $relativePath): string
    {
        if (! Storage::disk('public')->exists($relativePath)) {
            $width = 1200;
            $height = 675;
            $canvas = imagecreatetruecolor($width, $height);
            $color = imagecolorallocate($canvas, 56, 116, 96);
            imagefill($canvas, 0, 0, $color);
            imagejpeg($canvas, Storage::disk('public')->path($relativePath), (int) config('security.upload.jpeg_quality', 85));
            imagedestroy($canvas);
        }

        return $relativePath;
    }

    private function seedKontak(): void
    {
        $kontak = Kontak::query()->firstOrCreate(['id' => 1], [
            'email' => 'halo@digifin.co.id',
        ]);

        $sosmed = [
            ['platform' => 'Instagram', 'url' => 'https://instagram.com/digifin'],
            ['platform' => 'LinkedIn', 'url' => 'https://linkedin.com/company/digifin'],
            ['platform' => 'Twitter', 'url' => 'https://twitter.com/digifin'],
        ];

        SosialMedia::query()->where('kontak_id', $kontak->id)->delete();

        foreach ($sosmed as $item) {
            SosialMedia::query()->create([
                'kontak_id' => $kontak->id,
                'platform' => $item['platform'],
                'url' => $item['url'],
            ]);
        }
    }
}
