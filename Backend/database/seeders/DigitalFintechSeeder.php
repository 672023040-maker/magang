<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\DokumentasiProject;
use App\Models\Kontak;
use App\Models\Profil;
use App\Models\Project;
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
        // updateOrCreate (bukan create) supaya menjalankan seeder berkali-kali
        // tidak menggandakan anggota tim yang sama.
        StrukturOrganisasi::query()->updateOrCreate(
            ['nama' => 'Budi Santoso'],
            [
                'jabatan' => 'Direktur Utama',
                'foto' => null,
            ]
        );

        StrukturOrganisasi::query()->updateOrCreate(
            ['nama' => 'Siti Rahayu'],
            [
                'jabatan' => 'Direktur Operasional',
                'foto' => null,
            ]
        );
    }

    private function seedProject(): void
    {
        $author = StrukturOrganisasi::query()
            ->where('nama', 'Budi Santoso')
            ->first();

        $projectSelesai = Project::query()->updateOrCreate(
            ['nama_project' => 'Pengembangan Platform Mobile Banking'],
            [
                'deskripsi' => 'Membangun platform perbankan digital yang responsif dengan fitur transfer, pembayaran, dan manajemen akun.',
                'status' => 'publish',
                'tgl_dibuat' => now()->subMonths(6)->toDateString(),
                'author_id' => $author?->id,
            ]
        );

        if ($projectSelesai->dokumentasi()->count() === 0) {
            DokumentasiProject::query()->create([
                'project_id' => $projectSelesai->id,
                'file_gambar' => $this->ensurePlaceholderJpeg('dokumentasi/mobile-banking.jpg'),
            ]);
        }

        $projectBerjalan = Project::query()->updateOrCreate(
            ['nama_project' => 'Integrasi Pembayaran QRIS'],
            [
                'deskripsi' => 'Mengintegrasikan sistem pembayaran QRIS agar pengguna dapat bertransaksi di berbagai merchant secara praktis.',
                'status' => 'unpublish',
                'tgl_dibuat' => now()->subMonth()->toDateString(),
                'author_id' => $author?->id,
            ]
        );

        if ($projectBerjalan->dokumentasi()->count() === 0) {
            DokumentasiProject::query()->create([
                'project_id' => $projectBerjalan->id,
                'file_gambar' => $this->ensurePlaceholderJpeg('dokumentasi/qris-integration.jpg'),
            ]);
        }
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
        Kontak::query()->firstOrCreate(['id' => 1], [
            'email' => 'halo@digifin.co.id',
        ]);
    }
}
