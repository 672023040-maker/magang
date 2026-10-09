<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;
use Phar;
use PharData;
use Throwable;

/**
 * Backup terjadwal: dump database PostgreSQL + arsip file upload, lalu
 * menghapus backup yang melewati masa retensi.
 *
 *   php artisan digfin:backup                 # dump DB + arsip file + prune
 *   php artisan digfin:backup --no-db         # hanya arsip file
 *   php artisan digfin:backup --no-files      # hanya dump DB
 *   php artisan digfin:backup --prune-only    # hanya bersihkan backup lama
 *   php artisan digfin:backup --keep=7        # override retensi (hari)
 *
 * Restore (contoh, PostgreSQL):
 *   gunzip -c db-YYYY-MM-DD-HHMMSS.sql.gz | psql -h host -U user -d digfin
 *   tar -xzf files-YYYY-MM-DD-HHMMSS.tar.gz -C storage/app/public
 */
class BackupCommand extends Command
{
    protected $signature = 'digfin:backup
        {--no-db : Lewati dump database}
        {--no-files : Lewati arsip file upload}
        {--prune-only : Hanya hapus backup lama}
        {--keep= : Retensi dalam hari (override config)}';

    protected $description = 'Backup database + file upload, dengan retensi otomatis';

    public function handle(): int
    {
        $disk = (string) config('backup.disk', 'local');
        $dir = trim((string) config('backup.path', 'backups'), '/');

        Storage::disk($disk)->makeDirectory($dir);

        if ($this->option('prune-only')) {
            $this->prune($disk, $dir);

            return self::SUCCESS;
        }

        $stamp = now()->timezone('Asia/Jakarta')->format('Y-m-d-His');

        if (! $this->option('no-db')) {
            if (! $this->dumpDatabase($disk, $dir, $stamp)) {
                return self::FAILURE;
            }
        }

        if (! $this->option('no-files')) {
            $this->archiveFiles($disk, $dir, $stamp);
        }

        $this->prune($disk, $dir);

        $this->info('Backup selesai.');

        return self::SUCCESS;
    }

    private function dumpDatabase(string $disk, string $dir, string $stamp): bool
    {
        $connection = config('database.connections.'.config('database.default'));

        if (($connection['driver'] ?? null) !== 'pgsql') {
            $this->warn('Driver database bukan pgsql — dump DB dilewati.');

            return true;
        }

        $path = "{$dir}/db-{$stamp}.sql.gz";

        try {
            $result = Process::timeout((int) config('backup.timeout', 600))
                ->env(['PGPASSWORD' => (string) ($connection['password'] ?? '')])
                ->run([
                    (string) config('backup.pg_dump', 'pg_dump'),
                    '--no-owner',
                    '--no-acl',
                    '--host', (string) $connection['host'],
                    '--port', (string) $connection['port'],
                    '--username', (string) $connection['username'],
                    '--dbname', (string) $connection['database'],
                ]);
        } catch (Throwable $e) {
            $this->error('Gagal menjalankan pg_dump: '.$e->getMessage());

            return false;
        }

        if (! $result->successful()) {
            $this->error('pg_dump gagal (exit '.$result->exitCode().'): '.trim($result->errorOutput()));

            return false;
        }

        $compressed = gzencode($result->output(), 9);

        if ($compressed === false) {
            $this->error('Gagal mengompresi dump database.');

            return false;
        }

        Storage::disk($disk)->put($path, $compressed);
        $this->info("Database  -> {$path} (".$this->human(strlen($compressed)).')');

        return true;
    }

    private function archiveFiles(string $disk, string $dir, string $stamp): void
    {
        $filesDisk = (string) config('backup.files_disk', 'public');
        $source = Storage::disk($filesDisk)->path('');

        if (! is_dir($source) || count(File::allFiles($source)) === 0) {
            $this->warn('Tidak ada file upload untuk diarsipkan.');

            return;
        }

        $tarRel = "{$dir}/files-{$stamp}.tar";
        $tarAbs = Storage::disk($disk)->path($tarRel);

        try {
            $phar = new PharData($tarAbs);
            $phar->buildFromDirectory($source);
            $phar->compress(Phar::GZ);
            unset($phar);
            @unlink($tarAbs);
        } catch (Throwable $e) {
            @unlink($tarAbs);
            $this->error('Gagal mengarsipkan file upload: '.$e->getMessage());

            return;
        }

        $gzAbs = $tarAbs.'.gz';
        $this->info("File upload -> {$tarRel}.gz (".$this->human((int) @filesize($gzAbs)).')');
    }

    private function prune(string $disk, string $dir): void
    {
        $days = (int) ($this->option('keep') ?: config('backup.retention_days', 14));
        $cutoff = now()->subDays($days);
        $deleted = 0;

        foreach (Storage::disk($disk)->files($dir) as $file) {
            $timestamp = $this->timestampFromName(basename($file));

            if ($timestamp !== null && $timestamp->lessThan($cutoff)) {
                Storage::disk($disk)->delete($file);
                $deleted++;
            }
        }

        if ($deleted > 0) {
            $this->info("Menghapus {$deleted} backup lebih lama dari {$days} hari.");
        }
    }

    private function timestampFromName(string $name): ?Carbon
    {
        if (preg_match('/^(?:db|files)-(\d{4}-\d{2}-\d{2}-\d{6})\./', $name, $m) !== 1) {
            return null;
        }

        try {
            return Carbon::createFromFormat('Y-m-d-His', $m[1], 'Asia/Jakarta');
        } catch (Throwable) {
            return null;
        }
    }

    private function human(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = 0;

        while ($bytes >= 1024 && $i < count($units) - 1) {
            $bytes /= 1024;
            $i++;
        }

        return round($bytes, 2).' '.$units[$i];
    }
}
