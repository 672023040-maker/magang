<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Divisi;
use App\Models\DokumentasiProject;
use App\Models\Informasi;
use App\Models\Kontak;
use App\Models\PesanKontak;
use App\Models\Profil;
use App\Models\Project;
use App\Models\SosialMedia;
use App\Models\StrukturOrganisasi;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DigitalFintechSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedAdmin();
        $this->seedProfil();
        $this->seedStruktur();
        $this->seedInformasi();
        $this->seedProject();
        $this->seedKontak();
        $this->seedPesanKontak();
    }

    private function seedAdmin(): void
    {
        Admin::query()->firstOrCreate(
            ['username' => 'admin'],
            [
                'password' => Hash::make('admin123'),
                'nama' => 'Admin DIGIFIN',
                'role' => 'admin',
            ]
        );
    }

    private function seedProfil(): void
    {
        Profil::query()->firstOrCreate(['id' => 1], [
            'tentang_kami' => 'DIGIFIN adalah platform digital fintech yang berfokus pada penyediaan layanan keuangan digital yang inovatif, inklusif, dan terpercaya untuk mendukung pertumbuhan ekonomi masyarakat.',
            'visi' => 'Menjadi perusahaan fintech digital terdepan di Indonesia yang memberdayakan masyarakat melalui teknologi keuangan.',
            'misi' => '1. Menyediakan layanan keuangan digital yang mudah diakses.\n2. Mendorong inklusi keuangan bagi seluruh lapisan masyarakat.\n3. Menjaga keamanan dan kepercayaan pengguna.\n4. Berinovasi secara berkelanjutan di bidang teknologi keuangan.',
            'nilai' => 'Integritas, Inovasi, Inklusivitas, Kolaborasi, dan Transparansi.',
        ]);
    }

    private function seedStruktur(): void
    {
        $direktur = StrukturOrganisasi::query()->create([
            'nama' => 'Budi Santoso',
            'jabatan' => 'Direktur Utama',
            'foto' => null,
        ]);

        Divisi::query()->create([
            'struktur_organisasi_id' => $direktur->id,
            'nama_divisi' => 'Divisi Teknologi',
            'deskripsi' => 'Mengelola pengembangan platform digital dan infrastruktur teknologi perusahaan.',
        ]);

        Divisi::query()->create([
            'struktur_organisasi_id' => $direktur->id,
            'nama_divisi' => 'Divisi Keuangan',
            'deskripsi' => 'Mengelola produk keuangan, kepatuhan, dan hubungan dengan mitra keuangan.',
        ]);

        $direkturOps = StrukturOrganisasi::query()->create([
            'nama' => 'Siti Rahayu',
            'jabatan' => 'Direktur Operasional',
            'foto' => null,
        ]);

        Divisi::query()->create([
            'struktur_organisasi_id' => $direkturOps->id,
            'nama_divisi' => 'Divisi Layanan Pelanggan',
            'deskripsi' => 'Memberikan layanan dan dukungan terbaik kepada pelanggan.',
        ]);
    }

    private function seedInformasi(): void
    {
        $items = [
            [
                'judul' => 'DIGIFIN Meluncurkan Fitur Baru Dompet Digital',
                'kategori' => 'berita',
                'isi' => 'Kami dengan bangga mengumumkan peluncuran fitur dompet digital terbaru yang memudahkan pengguna melakukan transaksi harian dengan lebih cepat dan aman.',
                'tanggal' => now()->subDays(2)->toDateString(),
            ],
            [
                'judul' => 'Tips Mengelola Keuangan Digital untuk Pemula',
                'kategori' => 'artikel',
                'isi' => 'Artikel ini membahas langkah-langkah sederhana untuk mulai mengelola keuangan secara digital, mulai dari mencatat pengeluaran hingga memanfaatkan fitur keamanan.',
                'tanggal' => now()->subDays(5)->toDateString(),
            ],
            [
                'judul' => 'Pemeliharaan Sistem Berkala',
                'kategori' => 'pengumuman',
                'isi' => 'Sistem akan mengalami pemeliharaan berkala pada akhir pekan. Beberapa layanan mungkin tidak dapat diakses sementara selama proses berlangsung.',
                'tanggal' => now()->subDays(1)->toDateString(),
            ],
        ];

        foreach ($items as $item) {
            Informasi::query()->firstOrCreate(['judul' => $item['judul']], $item);
        }
    }

    private function seedProject(): void
    {
        $projectSelesai = Project::query()->create([
            'nama_project' => 'Pengembangan Platform Mobile Banking',
            'deskripsi' => 'Membangun platform perbankan digital yang responsif dengan fitur transfer, pembayaran, dan manajemen akun.',
            'status' => 'selesai',
            'tgl_mulai' => now()->subMonths(6)->toDateString(),
            'tgl_selesai' => now()->subMonth()->toDateString(),
        ]);

        DokumentasiProject::query()->create([
            'project_id' => $projectSelesai->id,
            'file_gambar' => 'dokumentasi/mobile-banking.jpg',
            'keterangan' => 'Tampilan antarmuka utama platform mobile banking.',
        ]);

        $projectBerjalan = Project::query()->create([
            'nama_project' => 'Integrasi Pembayaran QRIS',
            'deskripsi' => 'Mengintegrasikan sistem pembayaran QRIS agar pengguna dapat bertransaksi di berbagai merchant secara praktis.',
            'status' => 'berjalan',
            'tgl_mulai' => now()->subMonth()->toDateString(),
            'tgl_selesai' => null,
        ]);

        DokumentasiProject::query()->create([
            'project_id' => $projectBerjalan->id,
            'file_gambar' => 'dokumentasi/qris-integration.jpg',
            'keterangan' => 'Proses pengujian integrasi pembayaran QRIS.',
        ]);
    }

    private function seedKontak(): void
    {
        $kontak = Kontak::query()->firstOrCreate(['id' => 1], [
            'email' => 'halo@digifin.co.id',
            'phone' => '+62 21 1234 5678',
            'alamat' => 'Jl. Teknologi No. 88, Jakarta Selatan, DKI Jakarta 12345',
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

    private function seedPesanKontak(): void
    {
        PesanKontak::query()->create([
            'nama_pengirim' => 'Andi Pratama',
            'email' => 'andi@example.com',
            'subjek' => 'Informasi Layanan',
            'pesan' => 'Halo, saya ingin bertanya mengenai layanan dompet digital yang tersedia di DIGIFIN.',
            'tanggal' => now()->subHours(3),
        ]);
    }
}
