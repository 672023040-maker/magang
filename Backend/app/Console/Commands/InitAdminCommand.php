<?php

namespace App\Console\Commands;

use App\Models\Admin;
use App\Services\Security\SecurityLogger;
use Illuminate\Console\Command;
use Illuminate\Contracts\Console\PromptsForMissingInput;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Set/reset password awal admin (biasanya untuk admin pertama).
 *
 *   php artisan digfin:init-admin
 *   php artisan digfin:init-admin admin
 *
 * Tujuan:
 *  - Seeder tidak menyimpan password admin yang bisa dibaca siapa pun
 *    (pakai Str::password + must_change_password). Password awal login
 *    diatur lewat command ini.
 *  - Password TIDAK pernah di-echo ke konsol. Bila tidak diberi argumen,
 *    command meminta input interaktif (hidden) + konfirmasi.
 *  - Setelah dipakai, admin dipaksa ganti password pada login pertama
 *    (must_change_password = true), sehingga credential acak tidak pernah
 *    hidup lebih lama dari yang diperlukan.
 *
 * Catatan: jalan setidaknya satu kali saat deploy untuk menciptakan admin
 * yang bisa login. Kredensial awal hanya boleh diberikan melalui channel
 * yang aman (jangan lewat histori chat/Git).
 *
 * Gunakan conj:  php artisan digfin:init-admin --username=... --password=...
 */
class InitAdminCommand extends Command implements PromptsForMissingInput
{
    protected $signature = 'digfin:init-admin
        {username? : Username admin (default: baca env ADMIN_INITIAL_USERNAME)}
        {--password= : Password awal admin (TIDAK direkomendasikan argumen CLI — gunakan prompt atau env)}';

    protected $description = 'Buat/reset password admin DIGIFIN (tanpa echo kredensial)';

    public function __construct(private readonly SecurityLogger $logger)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $username = trim((string) $this->argument('username') ?: (string) config('security.initial_username', ''));

        if ($username === '') {
            $this->error('Username admin tidak boleh kosong. Berikan argumen atau set ADMIN_INITIAL_USERNAME.');

            return self::FAILURE;
        }

        // Password diprioritaskan dari env (ADMIN_INITIAL_PASSWORD), lalu
        // flag --password, lalu prompt interaktif. Semua DEMI menghindari
        // password ter-echo ke histori shell.
        $password = (string) ($this->option('password') ?: config('security.initial_password', ''));

        if ($password === '') {
            $password = (string) $this->secret('Password awal admin');
        }

        if (strlen($password) < 8) {
            $this->error('Password minimal 8 karakter.');

            return self::FAILURE;
        }

        $existing = Admin::query()->where('username', $username)->first();

        $admin = Admin::query()->updateOrCreate(
            ['username' => $username],
            [
                'password' => Hash::make($password),
                'nama' => $existing?->nama ?? ucfirst($username),
                'role' => 'admin',
                'must_change_password' => true,
                'password_changed_at' => null,
            ]
        );

        // Command berjalan DI LUAR konteks HTTP — tidak ada Request aktif.
        // SecurityLogger mewajibkan Request non-nullable (kolom ip/user_agent);
        // beri request kosong, IP/UA akan tercatat kosong (wajar untuk CLI).
        $request = new Request;

        if ($admin->wasRecentlyCreated) {
            $this->logger->log('ADMIN_CREATED', $request, ['source' => 'init_admin_command'], $admin->id);
        } else {
            $this->logger->log('ADMIN_PASSWORD_RESET', $request, ['source' => 'init_admin_command'], $admin->id);
        }

        $this->info('Password awal berhasil di-set untuk admin "'.$username.'".');
        $this->warn('Admin akan DIPAKSA mengganti password ini pada login berikutnya.');

        return self::SUCCESS;
    }
}
