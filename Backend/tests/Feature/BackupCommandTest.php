<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class BackupCommandTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('local');
        Storage::fake('public');

        config([
            'backup.disk' => 'local',
            'backup.path' => 'backups',
            'backup.files_disk' => 'public',
            'backup.retention_days' => 14,
        ]);
    }

    public function test_prune_only_menghapus_backup_lama_dan_menyisakan_yang_baru(): void
    {
        $disk = Storage::disk('local');
        $disk->makeDirectory('backups');

        $old = 'backups/db-'.now()->subDays(30)->format('Y-m-d-His').'.sql.gz';
        $new = 'backups/db-'.now()->subDays(1)->format('Y-m-d-His').'.sql.gz';

        $disk->put($old, 'lama');
        $disk->put($new, 'baru');
        $disk->put('backups/catatan.txt', 'bukan backup');

        $this->artisan('digfin:backup', ['--prune-only' => true])->assertSuccessful();

        $disk->assertMissing($old);
        $disk->assertExists($new);
        $disk->assertExists('backups/catatan.txt');
    }

    public function test_arsip_file_upload_dibuat(): void
    {
        Storage::disk('public')->put('struktur/foto.jpg', 'isi-biner');

        $this->artisan('digfin:backup', ['--no-db' => true])->assertSuccessful();

        $archives = array_values(array_filter(
            Storage::disk('local')->files('backups'),
            fn (string $f): bool => str_contains($f, 'files-') && str_ends_with($f, '.tar.gz'),
        ));

        $this->assertCount(1, $archives);
    }

    public function test_dump_db_dilewati_saat_driver_bukan_pgsql(): void
    {
        // Lingkungan test memakai sqlite; command harus lulus dengan peringatan.
        $this->artisan('digfin:backup', ['--no-files' => true])->assertSuccessful();
    }
}
